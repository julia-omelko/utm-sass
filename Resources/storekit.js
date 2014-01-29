
/*
 * Consolidated storekit code for the root context. - TV
 * 
 */


var Storekit = require('ti.storekit');

Storekit.receiptVerificationSandbox = (Ti.App.deployType !== 'production');
Storekit.receiptVerificationSharedSecret = "4ba2a70c810c47fe9a85071fb3b3d29f";
Storekit.autoFinishTransactions = false;
Storekit.bundleVersion = Ti.App.version; // eg. "1.0.0"
Storekit.bundleIdentifier = "com.utm"; // eg. "com.appc.storekit"
var verifyingReceipts = false;
var purchaseSuccess = false;
var tempPurchasedStore = {};
 
function isIOS7Plus(){
	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);
		if (major >= 7)	{
			return true;
		}
	}
	return false;
}
var IOS7 = isIOS7Plus();







/**
 * Purchases a product.
 * @param product A Ti.Storekit.Product (hint: use Storekit.requestProducts to get one of these!).
 */
Storekit.addEventListener('transactionState', function (evt) {
	switch (evt.state) {
		case Storekit.TRANSACTION_STATE_FAILED:
			if (evt.cancelled) {
				//alert('Purchase cancelled');
			} else {
				alert('ERROR: Buying failed! ' + evt.message);
			}
			evt.transaction && evt.transaction.finish();
			break;
		case Storekit.TRANSACTION_STATE_PURCHASED:
			if (verifyingReceipts) {
				if (IOS7) {
					// iOS 7 Plus receipt validation is just as secure as pre iOS 7 receipt verification, but is done entirely on the device.
					var msg = Storekit.validateReceipt() ? 'Receipt is Valid!' : 'Receipt is Invalid.'; 
					alert(msg);
				} else {
					// Pre iOS 7 receipt verification
					Storekit.verifyReceipt(evt, function (e) {
						if (e.success) {
							if (e.valid) {
								//alert('Thanks! Receipt Verified');
								verifyServerSideWithApple(evt.receipt,evt.productIdentifier)
							} else {
								//alert('Sorry. Receipt is invalid');
							}
						} else {
							//alert(e.message);
						}
					});
				}
			} else {
				verifyServerSideWithApple(evt.receipt,evt.productIdentifier);
			}
			evt.transaction && evt.transaction.finish();
			break;
		case Storekit.TRANSACTION_STATE_PURCHASING:
			//Ti.API.info('Purchasing ' + evt.productIdentifier);
			break;
		case Storekit.TRANSACTION_STATE_RESTORED:
			// The complete list of restored products is sent with the `restoredCompletedTransactions` event
			//Ti.API.info('Restored ' + evt.productIdentifier);
			// Downloads that exist in a RESTORED state should not necessarily be downloaded immediately. Leave it up to the user.			
			evt.transaction && evt.transaction.finish();
			break;
	}
});


 
function purchaseProduct(product)
{
	if (product.downloadable) {
		Ti.API.info('Purchasing a product that is downloadable');
	}
	Storekit.purchase({
		product: product
		// applicationUsername is a opaque identifier for the user’s account on your system. 
		// Used by Apple to detect irregular activity. Should hash the username before setting.
		// applicationUsername: '<HASHED APPLICATION USERNAME>'
	});
}



/**
 * Restores any purchases that the current user has made in the past, but we have lost memory of.
 *
 * This will be used to verify autorenewing subscriptions - TV
 */
Storekit.addEventListener('restoredCompletedTransactions', function (evt) {
	if (evt.error) {
		alert(evt.error);
	} else if (evt.transactions !== null || evt.transactions.length < 0) {
		/*
		var processTransactions = Ti.Network.createHTTPClient({
			validatesSecureCertificate:utm.validatesSecureCertificate, 
			timeout:utm.netTimeout,
			onload : function(e) {
				if (this.status == 200) {		
					var response = eval('('+this.responseText+')');
					if(response.Status ==='Sucess'){
						alert(response);
					}else{
						alert("Oops");
					}
				} else {
					utm.handleError(e, this.status, this.responseText);
				}
				processTransactions = null;
			},
			onerror : function(e) {		
				utm.handleError(e, this.status, this.responseText);
				processTransactions = null;
			}
		});
		var theUrl = utm.serviceUrl + "ProcessOfflineTransactions";
		processTransactions.open("POST", theUrl);
		processTransactions.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		processTransactions.setRequestHeader('Authorization-Token', utm.AuthToken);
		processTransactions.send(evt.transactions);
		*/
	}
});


/*
 * This sends the receipt from an App Store purchase and sends it to the UTM server for independant verification.
 * When verified, the UTM server will adjust the user's message count or add a subscription. - TV
 */
function verifyServerSideWithApple(_receipt,_productIdentifier){
	var verifyReceipt = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate, 
		timeout:utm.netTimeout,
		onload : function(e) {
			utm.inSubscriptionMode = true;
			if (this.status == 200) {		
				var response = eval('('+this.responseText+')');
				if(response.Status ==='Sucess'){
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
						SubscriptionEnds: ((_productIdentifier === 'com.youthisme.UnlimitedMessagesFor99') ? response.Data.SubscriptionInfo.SubscriptionEnds : null)
					});
				}else{
					alert("Your purchase was successful but will not be reflected right away.");
				}
			} else {
				utm.handleHttpError({}, this.status, this.responseText);
			}
			verifyReceipt = null;
		},
		onerror : function(e) {		
			utm.handleHttpError(e, this.status, this.responseText);
			resultMessage = "There was an error processing your request!";
			utm.inSubscriptionMode = false;
			verifyReceipt = null;
		},
		timeout:utm.netTimeout
	});
	var theUrl = utm.serviceUrl + "VerifyAppleReceipt";
	verifyReceipt.open("POST", theUrl);
	verifyReceipt.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	verifyReceipt.setRequestHeader('Authorization-Token', utm.AuthToken);
	verifyReceipt.send(_receipt);
}

// Called upon login.  This ultimatly triggers the restoredCompletedTransactions storekit events - TV
Ti.App.addEventListener('App:startTransactionListener',function(e){
	Storekit.addTransactionObserver();
	//Storekit.restoreCompletedTransactions();
});







