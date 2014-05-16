

var productObjects;
InAppProducts = require('com.logicallabs.inappproducts');


utm.androidProducts = [];
InAppProducts.addEventListener('receivedProducts', function(e) {
	if (e.errorCode) {
		//alert('Error: getProducts call failed! Message: ' + e.errorMessage);
	} else {
		productObjects = e.products;
		androidProducts = productObjects;
		utm.androidProducts = e.products;
		//alert(utm.androidProducts.length);
	}
});


InAppProducts.addEventListener('stateChange', function(e) {
	switch(InAppProducts.state) {
		case InAppProducts.STATE_NOT_READY:
			//alert('Not ready!');
			if (e.errorCode) {
				Ti.API.info('Initialization error code: ' + e.errorCode);
			}
			if (e.errorMessage) {
				Ti.API.info('Initialization error msg: ' + e.errorMessage);
			}
			break;
		case InAppProducts.STATE_READY:
			//alert('Ready!');
			var sku = [];
			for (var i=0; i<utm.products.length; i++) {
				sku.push(utm.products[i].ProductName);
			}
			InAppProducts.getProducts({ SKUs: ["com.youthisme.unlimited"] });
			//InAppProducts.getPurchases();
			break;
		case InAppProducts.STATE_NOT_SUPPORTED:
			//alert('Simulator!');
			break;
		default:
			alert('Invalid state!');
	}
});

InAppProducts.addEventListener('purchaseUpdate', function(e) {
	Ti.API.info('Received purchaseUpdate event');
	Ti.API.info(e.purchase);
	Ti.API.info(JSON.stringify(e.purchase));
	
	if (e.errorCode) {
		// This only happens on Android. On iOS, there is no error
		// condition associated with the purchaseUpdate event, although
		// the purchase itself may be in PURCHASE_STATE_FAILED state.
		//alert('Purchase attempt failed (code: ' + e.errorCode + ')');
		Ti.App.fireEvent('App:purchaseStateChange',{state:'failed'});
	} else {
		Ti.API.info('Product: ' + e.purchase.SKU + ' state: ' + e.purchase.state);
		switch (e.purchase.state) {
			case utm.InAppProducts.PURCHASE_STATE_PURCHASED:
				// This is a possible state on both iOS and Android
				verifyServerSideWithGoogle(e.purchase);
				Ti.App.fireEvent('App:purchaseStateChange',{state:'purchased'});
				break;
			case utm.InAppProducts.PURCHASE_STATE_CANCELED:
				// Android only
				Ti.App.fireEvent('App:purchaseStateChange',{state:'cancelled'});
				break;
			case utm.InAppProducts.PURCHASE_STATE_REFUNDED:
				// Android only
				break;
			case utm.InAppProducts.PURCHASE_STATE_PURCHASING:
				// iOS only
				break;
			case utm.InAppProducts.PURCHASE_STATE_FAILED:
				// iOS only
				Ti.App.fireEvent('App:purchaseStateChange',{state:'failed'});
				break;
			case utm.InAppProducts.PURCHASE_STATE_RESTORED:
				// iOS only
				break;
		}
	}
});



/*
 * This sends the receipt from a Google Play purchase and sends it to the UTM server for independant verification.
 * When verified, the UTM server will adjust the user's message count or add a subscription. - TV
 */
function verifyServerSideWithGoogle(_purchase){
	//Ti.API.info(123);
	var verifyReceipt = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate, 
		timeout:utm.netTimeout,
		onload : function(e) {
			//utm.inSubscriptionMode = true;
			if (this.status == 200) {		
				var response = eval('('+this.responseText+')');
				Ti.API.info(response);
				if (response.Status === 'Sucess' || response.Status ==='Success'){
					utm.User.UserProfile.MessagesRemaining = response.Data.MessagesRemaining;
					utm.User.UserProfile.SubscriptionEnds = response.Data.SubscriptionEnds; //Issue with dates not the same with SubscriptionInfo vs VerifyAppleReceipt when null
					/*
					 * These messages will be replaced with custom messages supplied by the UTM server. - TV
					 */
					if (response.Data.SubscriptionEnds === null) {
						alert("Thank you for your purchase, you now have "+ utm.User.UserProfile.MessagesRemaining + " messages remaining.");														
					} else {
						alert("Thank you for your purchase.");
					}

					Ti.App.fireEvent('updateMessageCount',{
						MessagesRemaining: response.Data.SubscriptionInfo.MessagesRemaining,
						SubscriptionEnds: ((_productIdentifier === 'com.youthisme.unlimited') ? response.Data.SubscriptionInfo.SubscriptionEnds : null)
					});
				}else{
					//alert("Your purchase was successful but will not be reflected right away.");
				}
			} else {
				utm.handleHttpError({}, this.status, this.responseText);
			}
			verifyReceipt = null;
		},
		onerror : function(e) {		
			utm.handleHttpError(e, this.status, this.responseText);
			resultMessage = "There was an error processing your request!";
			//utm.inSubscriptionMode = false;
			verifyReceipt = null;
		},
		timeout:utm.netTimeout
	});
	
	var theUrl = utm.serviceUrl + "VerifyGooglePlayReceipt";
	//Ti.API.info(1);
	//Ti.API.info(theUrl);
	//Ti.API.info(JSON.stringify(_purchase));
	//Ti.API.info(2);
	verifyReceipt.open("POST", theUrl);
	verifyReceipt.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	verifyReceipt.setRequestHeader('Authorization-Token', utm.AuthToken);
	verifyReceipt.send(JSON.stringify(_purchase));
}

InAppProducts.addEventListener('receivedPurchases', function(e) {
	//Ti.API.info(12345);
	//Ti.API.info(e.purchases);
	//Ti.API.info(JSON.stringify(e.purchases));
	verifyServerSideWithGoogle(e.purchases[0]);
});


