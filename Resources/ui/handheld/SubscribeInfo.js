var subscribe_window = function(utm) {
	
	var moment = require('lib/moment');
	var Storekit = require('ti.storekit');

	if(utm.iPhone || utm.iPad ){
		var win = Titanium.UI.createWindow({
		layout : 'vertical',
		title : L('account_info'),
		backButtonTitle : L('button_back'),
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor
		});
	}else if(utm.Android){
		
		//create the base screen and hid the Android navbar
		var win = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
		});
		
 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text:L('account_info'),
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
 
 		//add the navbar to the screen
		win.add(my_navbar);	
	}
	var message='';	
		

	var instructionLbl = Ti.UI.createLabel({ 
		top:10,
		left:5,
		right:5,
		font:{fontSize:'15dp'},
		color:utm.textColor
	});
	
	win.add(instructionLbl);
	
	
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
	
	win.updateMessage();
	
	win.addEventListener('load', function() {
		utm.setActivityIndicator('Loading Products...');
	});	
	
	Storekit.requestProducts(utm.products, function(storeProducts) {
		if(storeProducts.success) {		
			utm.setActivityIndicator('');				
			for(i = 0; i < storeProducts.products.length; i++) {
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
					utm.setActivityIndicator('Purchasing...');
					Storekit.purchase(event.source._product);
				});	
				
				Storekit.addEventListener('transactionState', function(event){
					
					//Have to bypass the screenLockTime in order to stop the app 
					//from thinking it's being paused by an outside process
					utm.screenLockTime += 10000;
					utm.setActivityIndicator('');
					
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
							var receipt = Ti.Utils.base64encode(JSON.stringify( event.receipt));
							var resultMessage = "Thank you for your Purchase!";
							
							// var emailDialog = Titanium.UI.createEmailDialog();
							// emailDialog.subject = "Sending email from Titanium";
							// emailDialog.toRecipients = ['json@troyweb.com'];
							// emailDialog.messageBody = receipt;
							// emailDialog.open();
							
							var verifyReceipt = Ti.Network.createHTTPClient({
									validatesSecureCertificate:utm.validatesSecureCertificate, 
									timeout:utm.netTimeout,
									onload : function(e) {
										utm.setActivityIndicator('Verifying receipt...');
										var response = this.responseText;
								
										if (this.status == 200) {		
											Ti.API.debug(response);			
										} 
										else {
											utm.handleError(e, this.status, this.responseText);
											//utm.recordError("Status="+this.status + "   Message:"+this.responseText);
										}
									},
									onerror : function(e) {		
										utm.handleError(e, this.status, this.responseText);
										resultMessage = "There was an error processing your request!";
									}
									,timeout:utm.netTimeout
								});
								
								verifyReceipt.open("POST", utm.serviceUrl + "VerifyAppleReceipt");
								verifyReceipt.setRequestHeader('Authorization-Token', utm.AuthToken);
								verifyReceipt.send(receipt);
							
							utm.navController.close(win);
							break;
						case Storekit.PURCHASING:
							Ti.API.debug("Purchasing " + event.productIdentifier);
							break;
						case Storekit.RESTORED:
							// The complete list of restored products is sent with the `restoredCompletedTransactions` event
							Ti.API.debug("Restored " + event.productIdentifier);
						    break;
					}
					
					utm.showSplashScreenOnPause = true;
					utm.setActivityIndicator('');
				});	
			}
		} else {
			utm.setActivityIndicator('');
			var errorLabel = Ti.UI.createLabel({
				text : "There was an error loading the product list!/n Please try again later."
			});
			
			win.add(errorLabel);	 
		}
	});	
			
	return win;

};
module.exports = subscribe_window;
