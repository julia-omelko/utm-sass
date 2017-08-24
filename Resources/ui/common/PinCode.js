var SettingsWin = function(_tabGroup) {
	
	var securely = require('bencoding.securely');
	var SecureProperties = securely.createProperties({
		secret:utm.securelySecretKey,
		securityLevel:securely.PROPERTY_SECURE_LEVEL_MED,
	});	
	var currentPin = SecureProperties.getString("pin");
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Set Unlock Code', '');
	
	var updateDisplay = function() {
		self.fireEvent('reorientdisplay');
	};
	Ti.App.addEventListener('orientdisplay', updateDisplay);	

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var clearButton = Ti.UI.createLabel({
		text: 'clear',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	if (currentPin != null && currentPin != '') {
		self.setRightNavButton(clearButton);
	}
	
	var scrollingView = Ti.UI.createScrollView({
		layout : 'vertical',
		height: utm.viewableArea,
		width: Ti.Platform.displayCaps.platformWidth,
		contentHeight: utm.viewableArea+80,
		top: utm.viewableTop
	});
	self.add(scrollingView);	

	var gapWidth = 20;
	var sizeModifier = (utm.Android ? 8 : 6);
	var platformWidth = Ti.Platform.displayCaps.platformWidth;
	
	self.addEventListener('reorientdisplay', function(evt) {
		scrollingView.height = utm.viewableArea;
		scrollingView.width = Ti.Platform.displayCaps.platformWidth;
		platformWidth = Ti.Platform.displayCaps.platformWidth;
	});
	
	if(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight) {
		var boxSize = Ti.Platform.displayCaps.platformWidth;
	} else {
		var boxSize = Ti.Platform.displayCaps.platformHeight;
	}
	
	var passwordDefault = {
		color: '#000000',
		width: Math.round(boxSize/sizeModifier),
		height: Math.round(boxSize/sizeModifier),
		font: {
			fontFamily: 'Helvetica Neue',
			fontWeight: 'bold',
			fontSize: '25dp'
		},
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		borderRadius: 5*utm.sizeMultiplier,
		borderColor: utm.barColor,
		borderWidth: 1*utm.sizeMultiplier,
		top: 2
	};
	
	
	var passwordHiddenBoxDefault = {
		color: 'white',
		height: 20,
		width: Ti.Platform.displayCaps.platformWidth,
		top: ((Ti.Platform.osname === 'android') ? (-100*utm.sizeMultiplier) : 0),
		left: 0,
		passwordMask: true,
		font: { fontSize: 20 },
		visible: ((Ti.Platform.osname === 'android') ? true : false),
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType: Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT
	};
	
	self.addEventListener('reorientdisplay', function(evt) {
		passwordHiddenBoxDefault.width = Ti.Platform.displayCaps.platformWidth;
	});	
	
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

	
	function passwordLeft() {
		password[0].left = (platformWidth/2)-(gapWidth/2+gapWidth)-2*passwordDefault.width;
		password[1].left = (platformWidth/2)-(gapWidth/2)-passwordDefault.width;
		password[2].left = (platformWidth/2)+(gapWidth/2);
		password[3].left = (platformWidth/2)+(gapWidth/2+gapWidth)+passwordDefault.width;
		password[4].left = (platformWidth/2)-(gapWidth/2+gapWidth)-2*passwordDefault.width;
		password[5].left = (platformWidth/2)-(gapWidth/2)-passwordDefault.width;
		password[6].left = (platformWidth/2)+(gapWidth/2);
		password[7].left = (platformWidth/2)+(gapWidth/2+gapWidth)+passwordDefault.width;
		password[0].setBorderWidth(3);
	};
	
	passwordLeft();
	
	self.addEventListener('reorientdisplay', function(evt) {
		passwordLeft();
	});	
	
	var pinLabel = Ti.UI.createLabel({
		top: 15,
		left: 25,
		text: 'Enter new unlock code',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	scrollingView.add(pinLabel);
	
	var firstCode = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Math.round(boxSize/sizeModifier)+4,
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
		height: Ti.UI.SIZE,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor			
	});	
	scrollingView.add(pinConfirmLabel);
	
	var secondCode = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Math.round(boxSize/sizeModifier)+4,
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
			password[i].setBorderWidth(1*utm.sizeMultiplier);
			if (i >= e.value.length) {
				password[i].setText('');
			} else {
				password[i].setText('*');
			}
		}
		if (e.value.length === 8) {
			checkToDisableSaveButton();
		} else {
			password[e.value.length].setBorderWidth(3*utm.sizeMultiplier);
		}
	});
	
	var saveButton = Ti.UI.createButton({
		title: 'Save',
		top: 15*utm.sizeMultiplier,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white',
		enabled : false,
		style: Ti.UI.iOS.SystemButtonStyle.PLAIN
	});	
	scrollingView.add(saveButton);

	self.addEventListener('reorientdisplay', function(evt) {
		saveButton.width = (Ti.Platform.displayCaps.platformWidth-50);
	});	
	
	if (utm.Android && currentPin != null) {
		var clearButton = Ti.UI.createButton({
			title: 'Clear unlock code',
			top: 15,
			width: (Ti.Platform.displayCaps.platformWidth-50),
			height: 40*utm.sizeMultiplier,
			borderRadius: 20*utm.sizeMultiplier,
			font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
			backgroundColor: utm.barColor,
			color: 'white',
			style: Ti.UI.iOS.SystemButtonStyle.PLAIN
		});	
		scrollingView.add(clearButton);
	}

	clearButton.addEventListener('click', function(e) {
	
		SecureProperties.removeProperty('pin');
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
		var newPin = getPinNumberValue();
		//newPin = Ti.Utils.sha256(newPin);  // Returns a SHA-256 hash of the specified data as a hex-based String.
		
		SecureProperties.setString('pin', newPin);
		
		//Confirm new pin was saved
		var storedPin = SecureProperties.getString("pin");
		if (newPin !== storedPin){
			alert('PIN failed to save.');
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
	
	// if keyboard was closed then opend, focus is lost on box and input is gone, so re-set display
	var setInputBox = function() {
		for (var i=7;i>=0;i--) {
			password[i].setText('');
			password[i].setBorderWidth(1*utm.sizeMultiplier);
		}
            password[0].setBorderWidth(3*utm.sizeMultiplier);            

	};

	Ti.App.addEventListener('keyboardframechanged', setInputBox);
	
	//clean up Ti.AppEventListeners when window closes
	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('keyboardframechanged', setInputBox);
		Ti.App.removeEventListener('orientdisplay', updateDisplay);
	});

	return self;
};
module.exports = SettingsWin;

