var SettingsWin = function(_tabGroup) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Settings', '');
	
	var scrollView = Ti.UI.createScrollView({
		layout : 'vertical',
		height: Ti.UI.FILL
	});
	self.add(scrollView);

	
	var buyMessagesButton = Ti.UI.createButton({
		title: 'Buy messages',
		top: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});
	scrollView.add(buyMessagesButton);

	buyMessagesButton.addEventListener('click', function() {
		if (utm.iPhone || utm.iPad ) {
			var SubscriptionWindow = require('/ui/common/Subscribe');
			var subscriptionWindow = new SubscriptionWindow(_tabGroup);
			_tabGroup.getActiveTab().open(subscriptionWindow);
		} else {
			Ti.Platform.openURL(utm.webUrl +'/Store');
		}
	});	

	var setPinLockButton = Ti.UI.createButton({
		title : 'Set unlock code',
		top: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});
	scrollView.add(setPinLockButton);

	setPinLockButton.addEventListener('click', function() {
		var SetPinWindow = require('/ui/common/PinCode');
		var setPinWindow = new SetPinWindow();	
		_tabGroup.getActiveTab().open(setPinWindow);	
	});

	var avatarButton = Ti.UI.createButton({
		title : 'Change avatar',
		top: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});
	scrollView.add(avatarButton);

	avatarButton.addEventListener('click', function() {
		var AvatarWin = require('/ui/common/Avatar');
		var avatarWin = new AvatarWin();	
		_tabGroup.getActiveTab().open(avatarWin);	
	});



	var forgetMeButton = Ti.UI.createButton({
		title : 'Forget me',
		top: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});
	scrollView.add(forgetMeButton);

	forgetMeButton.addEventListener('click', function() {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : [L('forget_me'), L('cancel')],
			message : 'CONFIRM - Your account, groups and messages will be deleted.  This can not be undone and messages will be gone forever!',
			title : L('forget_me')
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {
				Ti.API.info('The cancel button was clicked');
			} else {
				alert('forget me');
				//callForgetMe();
			}
		});
		dialog.show();
	});

	function callForgetMe() {
		var forgetMeReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				//utm.log('USER Was Forgotten');
				alert("You have been removed from YouThisMe.");
				Ti.App.fireEvent("app:logout", {});
			},
			onerror : function(e) {
				//Ti.App.fireEvent("app:logout", {});
				//utm.handleError(e, this.status, this.responseText);
			},
			timeout : utm.netTimeout
		});
		forgetMeReq.open('delete', utm.serviceUrl + 'ForgetMe');
		forgetMeReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		forgetMeReq.send();
	}

	return self;
};
module.exports = SettingsWin;

