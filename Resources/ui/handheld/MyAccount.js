var MyAccount_window = function(utm) {
	utm.inSubscriptionMode = false;
	
	if(utm.iPhone || utm.iPad ){
		var SetPinWindow = require('/ui/handheld/SetPin');
		var SetSubscriptionWindow = require('ui/handheld/SubscribeInfo');
		
		var myAccountWindow = Titanium.UI.createWindow({
			layout : 'vertical',
			title : 'My Account',
			backButtonTitle : L('button_back'),
			backgroundColor : utm.backgroundColor,
			barColor : utm.barColor
		});
	
		var buyMessagesButton = Ti.UI.createButton({
			title : L('buy_messages'),
			top : 20,
			width : 200,	
			enabled : true
		});
		myAccountWindow.add(buyMessagesButton);
	
		buyMessagesButton.addEventListener('click', function() {
			utm.setSubscriptionWindow=null;
			utm.setSubscriptionWindow = new SetSubscriptionWindow(utm);	
			utm.navController.open(utm.setSubscriptionWindow);
		});	
		
		var setPinLockButton = Ti.UI.createButton({
			title : L('unlock_code'),
			top : 20,
			width : 200,	
			enabled : true
		});
		myAccountWindow.add(setPinLockButton);
	
		setPinLockButton.addEventListener('click', function() {
			utm.setPinWindow = new SetPinWindow(utm);		
			utm.navController.open(utm.setPinWindow);		
		});
	}else if(utm.Android){
		
		//create the base screen and hid the Android navbar
		var myAccountWindow = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
		});
		
 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text:'My Account',
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
 
 		//add the navbar to the screen
		myAccountWindow.add(my_navbar);	
	}
	
	var forgetMeButton = Ti.UI.createButton({
		title : L('forget_me'),
		top : 20,
		width : 200,	
		enabled : true
	});
	
	myAccountWindow.add(forgetMeButton);

	forgetMeButton.addEventListener('click', function() {

		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : [L('forget_me'), L('cancel')],
			message : 'CONFIRM - Your account will be deleted, all MyHorts and Messages will be deleted? - NOTE: This can not be undone and messages are gone forever!',
			title : L('forget_me')
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {
				Ti.API.info('The cancel button was clicked');
			} else {
				callForgetMe();
			}
		});
		dialog.show();

	});

	function callForgetMe() {
		utm.log("About to call forget me");
		forgetMeReq.open('delete', utm.serviceUrl + 'ForgetMe');
		forgetMeReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		forgetMeReq.send();
	}

	var forgetMeReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function(e) {
			utm.log('USER Was Forgotten');
			alert("You have been removed from YouThisMe.");
			Ti.App.fireEvent("app:logout", {});
		},
		onerror : function(e) {
			//Ti.App.fireEvent("app:logout", {});
			utm.handleError(e, this.status, this.responseText);
		},
		timeout : utm.netTimeout
	});

	return myAccountWindow;

};
module.exports = MyAccount_window;
