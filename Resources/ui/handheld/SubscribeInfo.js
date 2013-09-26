var subscribe_window = function(utm) {
	
	var moment = require('lib/moment');
	var Storekit = require('ti.storekit');

	var Header = require('ui/common/Header');
	var win = new Header(utm,L('account_info'), L('button_back'));

	var message='';	
	var purchaseSuccess = false;
		
	var instructionLbl = Ti.UI.createLabel({ 
		top:10,
		left:10,
		right:10,
		font:{fontSize:'15dp'},
		color:utm.textColor
	});
	
	win.add(instructionLbl);
	
	win.addEventListener('open', function() {
		utm.setActivityIndicator(win,'Loading Products...');
	});	
	
	//TODO GetProducts... service
	

	Storekit.requestProducts(utm.products, function(storeProducts) {
		if(storeProducts.success) {		
			utm.setActivityIndicator(win, '');		
			
			//TODO Add new service to get the list of Products in our DB + cross check with Apple Products 
					
			for(i = 0; i < storeProducts.products.length; i++) {
				
				//TODO improvement to add a check IF MATCH then add product 
				
				var productButton = Ti.UI.createButton({
					title : storeProducts.products[i].title,
					top : 20,
					height : 70,
					width : 260,	
					enabled : true,
					padding : 5,
					_product: storeProducts.products[i]
				});	
				win.add(productButton);
				
				productButton.addEventListener('click', function(event){
					utm.showSplashScreenOnPause = false;
					utm.setActivityIndicator(win, 'Purchasing...');
					Storekit.purchase(event.source._product);
				});	

			}
			
			var cancelButton = Ti.UI.createButton({
					title : 'Cancel',
					top : 20,
					height : 70,
					width : 260,	
					enabled : true,
					padding : 5,
				});	
				win.add(cancelButton);
				
				cancelButton.addEventListener('click', function(event){
					closeWin();
				});	
			
			
			
		} else {
			utm.setActivityIndicator(win, '');
			var errorLabel = Ti.UI.createLabel({
				text : "There was an error loading the product list from the Apple App Store! Please try again later."
			});
			
			win.add(errorLabel);	 
		}
	});	
	
					
		Storekit.addEventListener('transactionState', function(event){
			
			//Have to bypass the screenLockTime in order to stop the app 
			//from thinking it's being paused by an outside process
			//utm.screenLockTime += 10000;
			utm.setActivityIndicator(win, '');
			
			switch (event.state) {
				case Storekit.FAILED:
					utm.showSplashScreenOnPause = true;
					if (event.cancelled) {
						resultMessage = 'Purchase cancelled!';
					} else {
						resultMessage = 'ERROR: Buying failed! ' + event.message;
					}
					break;
				case Storekit.PURCHASED:
					
					//logic to verify receipt
					//sent to service with event.receipt
					//HAD to add this check due to a double call issue - only want this called one time
					if(! purchaseSuccess){
						verifyServerSideWithApple(event.receipt);
						purchaseSuccess=true;
					}	

					break;
				case Storekit.PURCHASING:
					Ti.API.debug("Purchasing " + event.productIdentifier);
					break;
				case Storekit.RESTORED:
					utm.showSplashScreenOnPause = true;
					// The complete list of restored products is sent with the `restoredCompletedTransactions` event
					Ti.API.debug("Restored " + event.productIdentifier);
				    break;
			}
			utm.setActivityIndicator(win, '');
		});	
		
		function verifyServerSideWithApple(_receipt){
				var verifyReceipt = Ti.Network.createHTTPClient({
					validatesSecureCertificate:utm.validatesSecureCertificate, 
					timeout:utm.netTimeout,
					onload : function(e) {
						utm.setActivityIndicator(win, '');
						utm.showSplashScreenOnPause = true;
				
						if (this.status == 200) {		
							var response = eval('('+this.responseText+')');
							
							if(response.Status ==='Sucess'){

								var data =  eval('('+response.Data+')');
								utm.User.UserProfile.MessagesRemaining = data.MessagesRemaining;
								utm.User.UserProfile.SubscriptionEnds	 = data.SubscriptionEnds;
								
								alert("Thank you for your purchase, you now have "+ utm.User.UserProfile.MessagesRemaining + "  messages remaining.");
							}else{
								alert("Your purchase was successful but will not be reflected right a way.");
							}
							closeWin();
						} 
						else {
							utm.handleError(e, this.status, this.responseText);
							//utm.recordError("Status="+this.status + "   Message:"+this.responseText);
							closeWin();
						}
					},
					onerror : function(e) {		
						utm.setActivityIndicator(win, '');
						utm.handleError(e, this.status, this.responseText);
						resultMessage = "There was an error processing your request!";
						utm.showSplashScreenOnPause = true;
						closeWin();
					}
					,timeout:utm.netTimeout
				});
				utm.setActivityIndicator(win, 'Verifying receipt...');
				verifyReceipt.open("POST", utm.serviceUrl + "VerifyAppleReceipt");
				verifyReceipt.setRequestHeader('Authorization-Token', utm.AuthToken);
				verifyReceipt.send(_receipt);
		}
		
	win.updateMessage = function(){
		message='';
		if( utm.User.UserProfile.MessagesRemaining < 1 ){
			message = 'You have no more messages available \n';
		} else {
			message = 'You have ' + utm.User.UserProfile.MessagesRemaining + ' messages remaining \n';
		}
		
		var now = new Date();		
		var subDate = utm.User.UserProfile.SubscriptionEnds ? utm.User.UserProfile.SubscriptionEnds.substring(0, 10) : "UNKNOWN";
		var displayDate = subDate === "UNKNOWN" ? "UNKNOWN" : moment(subDate).format('L');
		subDate = subDate.replace(/-/g, '/');
		subDate = new Date(subDate);

		if ( displayDate !== "UNKNOWN") {
			if( subDate < now ){			
				message += '\nYour subscription has run out as of '  + 	displayDate + '\n';			
				message += '\nTo update - go to www.youthisme.com and login in to update your subscription';
			} else {
				message += '\nYour subscriptions ends on ' + displayDate;
			}
		}
				
		instructionLbl.text = message;
	};		
	
	function closeWin(){
		utm.navController.close(utm.setSubscriptionWindow);
		//utm.setSubscriptionWindow=null;
	}
	
	win.updateMessage();
	
	return win;

};
module.exports = subscribe_window;
