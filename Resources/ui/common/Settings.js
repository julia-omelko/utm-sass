var SettingsWin = function(_tabGroup) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Settings', '');

	var updateDisplay = function() {
		self.fireEvent('reorientdisplay');
	};
	Ti.App.addEventListener('orientdisplay', updateDisplay);
	
	var scrollView = Ti.UI.createScrollView({
		layout : 'vertical',
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		top: utm.viewableTop
	});
	self.add(scrollView);

	
	var buyMessagesButton = Ti.UI.createButton({
		title: 'Buy messages',
		top: 25*utm.sizeMultiplier,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		font:{fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		backgroundColor: utm.buttonColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	scrollView.add(buyMessagesButton);
	
	self.addEventListener('reorientdisplay', function(evt) {
		buyMessagesButton.width = (Ti.Platform.displayCaps.platformWidth-50);
	});

	buyMessagesButton.addEventListener('click', function() {
		//if (utm.iPhone || utm.iPad ) {
			var SubscriptionWindow = require('/ui/common/Subscribe');
			var subscriptionWindow = new SubscriptionWindow(_tabGroup);
			_tabGroup.getActiveTab().open(subscriptionWindow);
		//} else {
		//	Ti.Platform.openURL(utm.webUrl +'/Store');
		//}
	});	

	var setPinLockButton = Ti.UI.createButton({
		title : 'Set unlock code',
		top: 25*utm.sizeMultiplier,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		font:{fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		backgroundColor: utm.barColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	scrollView.add(setPinLockButton);
	
	self.addEventListener('reorientdisplay', function(evt) {
		setPinLockButton.width = (Ti.Platform.displayCaps.platformWidth-50);
	});

	setPinLockButton.addEventListener('click', function() {
		var SetPinWindow = require('/ui/common/PinCode');
		var setPinWindow = new SetPinWindow();	
		_tabGroup.getActiveTab().open(setPinWindow);	
	});

	var avatarButton = Ti.UI.createButton({
		title : 'Change avatar',
		top: 25*utm.sizeMultiplier,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		font:{fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		backgroundColor: utm.barColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	scrollView.add(avatarButton);

	self.addEventListener('reorientdisplay', function(evt) {
		avatarButton.width = (Ti.Platform.displayCaps.platformWidth-50);
	});

	avatarButton.addEventListener('click', function() {
		var AvatarWin = require('/ui/common/Avatar');
		var avatarWin = new AvatarWin();	
		_tabGroup.getActiveTab().open(avatarWin);	
	});

	var accountButton = Ti.UI.createButton({
		title : 'Account settings',
		top: 25*utm.sizeMultiplier,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		font:{fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		backgroundColor: utm.barColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	scrollView.add(accountButton);
	
	self.addEventListener('reorientdisplay', function(evt) {
		accountButton.width = (Ti.Platform.displayCaps.platformWidth-50);
	});

	accountButton.addEventListener('click', function() {
		var AccountWin = require('/ui/common/PrimaryGroupDetail');
		var accountWin = new AccountWin();	
		_tabGroup.getActiveTab().open(accountWin);	
	});



	var forgetMeButton = Ti.UI.createButton({
		title : 'Forget me',
		top: 25*utm.sizeMultiplier,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		font:{fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		backgroundColor: utm.barColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	scrollView.add(forgetMeButton);
	
	self.addEventListener('reorientdisplay', function(evt) {
		forgetMeButton.width = (Ti.Platform.displayCaps.platformWidth-50);
	});	

	forgetMeButton.addEventListener('click', function() {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : [L('forget_me'), L('cancel')],
			message : 'CONFIRM - Your account, groups and messages will be deleted.  This can not be undone and messages will be gone forever!',
			title : L('forget_me')
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {
				//Ti.API.info('The cancel button was clicked');
			} else {
				callForgetMe();
			}
		});
		dialog.show();
	});

	function callForgetMe() {
		var forgetMeReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				alert("You have been removed from YouThisMe.");
				utm.loggedIn = false;
				utm.tabGroup.close();
				forgetMeReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				forgetMeReq = null;
			},
			timeout : utm.netTimeout
		});
		forgetMeReq.open('delete', utm.serviceUrl + 'ForgetMe');
		forgetMeReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		forgetMeReq.send();
	}

	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('orientdisplay', updateDisplay);
	});	

	return self;
};
module.exports = SettingsWin;

