var subscribe_window = function(utm) {
	
	var moment = require('lib/moment');
	var Storekit = require('ti.storekit');

	var Header = require('ui/common/Header');
	var win = new Header(utm,L('account_info'), L('button_back'));

	var message = '';	
	var purchaseSuccess = false;
	
	
	var scrollingView = Ti.UI.createScrollView({
		layout: 'vertical',
		scrollType : 'vertical'
	});
	win.add(scrollingView);
	
	
	var instructionLbl = Ti.UI.createLabel({ 
		top:10,
		left:10,
		right:10,
		font:{fontSize:'15dp'},
		color:utm.textColor
	});
	
	
	scrollingView.add(instructionLbl);
	
	/*
	 * removed due to load order and sometimes cant get ride of the loading message...
	 win.addEventListener('open', function() {
		utm.setActivityIndicator(win,'Loading Products...');
	});*/	
	
	utm.setActivityIndicator(win, 'Connecting to iTunes...');		

	try
	{
		Storekit.requestProducts(utm.products, function(storeProducts) {
			if(storeProducts.success) {		
							
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
					scrollingView.add(productButton);
					
					var prodDescription = Ti.UI.createLabel({
						width : 260,	
						font: {fontSize:'16dp'},
						textAlign:'center',
						text:storeProducts.products[i].description
					});
					
					scrollingView.add(prodDescription);
					
					productButton.addEventListener('click', function(event){
						utm.inSubscriptionMode = true;
						utm.setActivityIndicator(win, 'Purchasing...');
						Storekit.purchase(event.source._product);
					});	
	
				}
				
				var cancelButton = Ti.UI.createButton({
						title : 'Cancel',
						top : 25,
						height : 70,
						width : 260,	
						enabled : true,
						padding : 5,
					});	
					scrollingView.add(cancelButton);
					
					cancelButton.addEventListener('click', function(event){
						closeWin();
					});	
				
				
				utm.setActivityIndicator(win, '');		
			} else {
				utm.setActivityIndicator(win, '');
				var errorLabel = Ti.UI.createLabel({
					text : "There was an error loading the product list from the Apple App Store! Please try again later."
				});
				
				scrollingView.add(errorLabel);	 
			}
		});
	}	
	catch(err) 
	{
		alert(err);
	}
					
		Storekit.addEventListener('transactionState', function(event){
			
			switch (event.state) {
				case Storekit.FAILED:
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
					if(!purchaseSuccess){
						utm.inSubscriptionMode = false;
						verifyServerSideWithApple(event.receipt);
						purchaseSuccess = true;
					}	

					break;
				case Storekit.PURCHASING:
					Ti.API.debug("Purchasing " + event.productIdentifier);
					utm.setActivityIndicator(win, 'Connecting to iTunes...');		
					break;
				case Storekit.RESTORED:
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
						utm.inSubscriptionMode = true;
				
						if (this.status == 200) {		
							var response = eval('('+this.responseText+')');
							
							if(response.Status ==='Sucess'){

								utm.User.UserProfile.MessagesRemaining = response.Data.MessagesRemaining;
								utm.User.UserProfile.SubscriptionEnds = response.Data.SubscriptionEnds; //Issue with dates not the same with SubscriptionInfo vs VerifyAppleReceipt when null
								
								alert("Thank you for your purchase, you now have "+ utm.User.UserProfile.MessagesRemaining + " messages remaining.");
							}else{
								alert("Your purchase was successful but will not be reflected right away.");
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
						utm.inSubscriptionMode = false;
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
		
	/*	
	 *  Hide Date message due to //Issue with dates not the same with SubscriptionInfo vs VerifyAppleReceipt when null
	 * 
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
		*/		
		instructionLbl.text = message;
	};		
	
	function closeWin(){
		utm.inSubscriptionMode = false;
		utm.navController.close(utm.setSubscriptionWindow);
	}
	
	win.updateMessage();
	
	return win;

};
module.exports = subscribe_window;
