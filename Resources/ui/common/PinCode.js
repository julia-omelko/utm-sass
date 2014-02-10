var SettingsWin = function(_tabGroup) {
	
	if(utm.iPhone || utm.iPad ){
		var keychain = require("com.0x82.key.chain");
	} else {
		var keychain = require("/lib/androidkeychain");
	}	
	var currentPin = keychain.getPasswordForService('utm', 'lockscreen');
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Set Unlock Code', '');
	
	var backButton = Ti.UI.createLabel({
		text: 'Back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close({animated:true});
	});
	self.setLeftNavButton(backButton);
	
	var clearButton = Ti.UI.createLabel({
		text: 'clear',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	if (currentPin != null && currentPin !== '') {
		self.setRightNavButton(clearButton);
	}
	
	var scrollingView = Ti.UI.createScrollView({
		layout : 'vertical',
		height: utm.viewableArea,
		contentHeight: utm.viewableArea+80,
		top: 0
	});
	self.add(scrollingView);

	var gapWidth = 20;
	var platformWidth = Ti.Platform.displayCaps.platformWidth;
	
	var passwordDefault = {
		color: '#000000',
		width: Math.round(Ti.Platform.displayCaps.platformWidth/6),
		height: Math.round(Ti.Platform.displayCaps.platformWidth/6),
		font: {
			fontFamily: 'Helvetica Neue',
			fontWeight: 'bold',
			fontSize: 25
		},
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		borderRadius: 5,
		borderColor: utm.barColor,
		borderWidth: 1,
		top: 2
	};
	
	var passwordHiddenBoxDefault = {
		color: 'white',
		height: 20,
		width: Ti.Platform.displayCaps.platformWidth,
		top: ((Ti.Platform.osname === 'android') ? -100 : 0),
		left: 0,
		passwordMask: true,
		font: { fontSize: 20 },
		visible: ((Ti.Platform.osname === 'android') ? true : false),
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT
	};	
	
	var password = new Array();
 	password[0] = Ti.UI.createLabel(passwordDefault);
	password[1] = Ti.UI.createLabel(passwordDefault);
	password[2] = Ti.UI.createLabel(passwordDefault);
	password[3] = Ti.UI.createLabel(passwordDefault);
	password[4] = Ti.UI.createLabel(passwordDefault);
	password[5] = Ti.UI.createLabel(passwordDefault);
	password[6] = Ti.UI.createLabel(passwordDefault);
	password[7] = Ti.UI.createLabel(passwordDefault);
	passwordHiddenBox = Ti.UI.createTextField(passwordHiddenBoxDefault);	
	
	password[0].left = (platformWidth/2)-(gapWidth/2+gapWidth)-2*passwordDefault.width;
	password[1].left = (platformWidth/2)-(gapWidth/2)-passwordDefault.width;
	password[2].left = (platformWidth/2)+(gapWidth/2);
	password[3].left = (platformWidth/2)+(gapWidth/2+gapWidth)+passwordDefault.width;
	password[4].left = (platformWidth/2)-(gapWidth/2+gapWidth)-2*passwordDefault.width;
	password[5].left = (platformWidth/2)-(gapWidth/2)-passwordDefault.width;
	password[6].left = (platformWidth/2)+(gapWidth/2);
	password[7].left = (platformWidth/2)+(gapWidth/2+gapWidth)+passwordDefault.width;
	password[0].setBorderWidth(3);

	var pinLabel = Ti.UI.createLabel({
		top: 25,
		left: 25,
		text: 'Enter new unlock code',
		width: Ti.UI.SIZE,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	scrollingView.add(pinLabel);
	
	var firstCode = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Math.round(Ti.Platform.displayCaps.platformWidth/6)+4,
		top: 10
	});
	firstCode.add(password[0]);
	firstCode.add(password[1]);
	firstCode.add(password[2]);
	firstCode.add(password[3]);
	scrollingView.add(firstCode);	
		
	var pinConfirmLabel = Ti.UI.createLabel({
		text: 'Confirm your unlock code',
		top: 15,
		left: 25,
		width: Ti.UI.SIZE,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor			
	});	
	scrollingView.add(pinConfirmLabel);
	
	var secondCode = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Math.round(Ti.Platform.displayCaps.platformWidth/6)+4,
		top: 10
	});
	secondCode.add(password[4]);
	secondCode.add(password[5]);
	secondCode.add(password[6]);
	secondCode.add(password[7]);
	scrollingView.add(secondCode);	
	
	self.add(passwordHiddenBox);
		
	
	// get password code from hidden field
	passwordHiddenBox.addEventListener('change',function(e) {	
		if (e.value.length > 8) {
			passwordHiddenBox.setValue(e.value.substring(8,1));
			return;
		}
		for (var i=0;i<=7;i++) {
			password[i].setBorderWidth(1);
			if (i >= e.value.length) {
				password[i].setText('');
			} else {
				password[i].setText('*');
			}
		}
		if (e.value.length === 8) {
			checkToDisableSaveButton();
		} else {
			password[e.value.length].setBorderWidth(3);
		}
	});
	
	var saveButton = Ti.UI.createButton({
		title: 'Save',
		top: 15,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});	
	
	scrollingView.add(saveButton);	

	clearButton.addEventListener('click', function(e) {
		keychain.deletePasswordForService('utm', 'lockscreen');
		currentPin = null;
	
		var alert = Titanium.UI.createAlertDialog({
	        title : 'Alert',
	        message : 'Unlock code has been cleared.',
	        buttonNames : ['Ok']
	    });
 		alert.addEventListener('click', function(e) {
	        if (e.index === 0) {
	            self.close();
	        }
	  	});
	    alert.show();
	});
	
	saveButton.addEventListener('click', function() {
		var newPass = getPinNumberValue();
		newPass = Ti.Utils.sha256(newPass);
		
		keychain.setPasswordForService(newPass, 'utm', 'lockscreen');
		//Confirm its set in the KeyChain
		var pass = keychain.getPasswordForService('utm', 'lockscreen');
		if (newPass !== pass){
			alert('PIN failed to save to your KeyChain.');
			return;
		}	
		self.close();
	});
	
	
	function checkToDisableSaveButton(){		
		var enableSave = true;	
		if (passwordHiddenBox.getValue().length !== 8) {
			enableSave = false;
		}
		
		//Check that the PIN and PIN Confirm match
		if (enableSave) {
			if(getPinNumberValue() !== getPinConfirmNumberValue()) {
				enableSave = false;
				alert('Your codes do not match, please try again.');
				passwordHiddenBox.setValue('');
				passwordHiddenBox.fireEvent('change',{value:''});
				
			}
		}
		saveButton.enabled = enableSave;
	}
	

	function getPinNumberValue(){
		return passwordHiddenBox.getValue().substring(0,4);
	};
	function getPinConfirmNumberValue(){
		return passwordHiddenBox.getValue().substring(4);
	};
	
	// set focus on passwordHiddenBox field
	self.addEventListener('focus', function() {		
		passwordHiddenBox.focus();
	});
	self.addEventListener('click', function() {		
		passwordHiddenBox.focus();
	});
	if (Ti.Platform.osname === 'android') {
		self.addEventListener('open', function() {	
			passwordHiddenBox.focus();
		});
	};
	

	return self;
};
module.exports = SettingsWin;

