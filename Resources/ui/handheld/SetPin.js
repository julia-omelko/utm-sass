var SetPin_window = function(utm) {

	if(utm.iPhone || utm.iPad ){
		var keychain = require("com.0x82.key.chain");
	} else {
		var keychain = require("/lib/androidkeychain");
	}	
	var currentPin = keychain.getPasswordForService('utm', 'lockscreen');
	
	var platformWidth = Ti.Platform.displayCaps.platformWidth;
	var gapWidth = 20;
	
	var win = Titanium.UI.createWindow({
		title : 'Set Unlock Code',
		backButtonTitle : L('button_back'),
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor,
		navBarHidden: (utm.Android ? true : false)
	});
		
	
	var passwordDefault = {
		color: '#000000',
		//top: 145,
		width: Math.round(Ti.Platform.displayCaps.platformWidth/8),
		height: Math.round(Ti.Platform.displayCaps.platformWidth/8),
		//passwordMask: true,
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
		width: platformWidth,
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
	
	var wrapperView = Ti.UI.createView({
		layout: 'vertical'
	});

	win.add(wrapperView);
	if (utm.Android) {
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text:'Set Unlock Code',
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
		wrapperView.add(my_navbar);
	}
	
	//------------- Create Scrollable view for elements -----------
	// set scroll context differently for platform
	if(utm.Android){
		var scrollingView = Ti.UI.createScrollView({
		layout: 'vertical',
		scrollType : 'vertical'
		});
	}
	if(utm.iPhone || utm.iPad ){
		var scrollingView = Ti.UI.createScrollView({
		layout: 'vertical',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
		});
	}
	wrapperView.add(scrollingView);	
	
	
	var pinLabel = Ti.UI.createLabel({
		top: 5,
		text: 'Enter Unlock Code used to unlock the screen',
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		font: {
			fontSize : '14dp',
			fontWeight : 'bold'
		}		
	});
	scrollingView.add(pinLabel);
	
	var firstCode = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Math.round(Ti.Platform.displayCaps.platformWidth/8)+4,
		top: 5
	});
	firstCode.add(password[0]);
	firstCode.add(password[1]);
	firstCode.add(password[2]);
	firstCode.add(password[3]);
	scrollingView.add(firstCode);	
		
	var pinConfirmLabel = Ti.UI.createLabel({
		text: 'Confirm your Unlock Code',
		top: 5,
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		font: {
			fontSize : '14dp',
			fontWeight : 'bold'
		}		
	});	
	scrollingView.add(pinConfirmLabel);
	
	var secondCode = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Math.round(Ti.Platform.displayCaps.platformWidth/8)+4,
		top: 5
	});
	secondCode.add(password[4]);
	secondCode.add(password[5]);
	secondCode.add(password[6]);
	secondCode.add(password[7]);
	scrollingView.add(secondCode);	
	
	win.add(passwordHiddenBox);
		
	
	// get password code from hidden field
	passwordHiddenBox.addEventListener('change',function(e) {	
		if (e.value.length > 8) {
			passwordHiddenBox.setValue(e.value.substring(8,1));
			return;
		}
		for (var i=0;i<=7;i++) {
			//password[i].setBorderColor(utm.barColor);
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
		title : L('ok_button'),
		width : 160,
		enabled : false,
		height: Ti.UI.SIZE
	});

	var clearButton = Ti.UI.createButton({
		title : 'Clear',
		width : 160,
		height: Ti.UI.SIZE
	});

	var buttonWrapper = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		top:15,
		layout: 'vertical'
	});
	buttonWrapper.add(saveButton);
	if( currentPin != null) {
		if (Ti.Platform.osname === 'android') {
			//clearButton.setLeft(20);
			buttonWrapper.add(clearButton);
		} else {
			win.setRightNavButton(clearButton);
		}
	}
	scrollingView.add(buttonWrapper);


	clearButton.addEventListener('click', function(e) {
		keychain.deletePasswordForService('utm', 'lockscreen');
		currentPin=null;
	
		var alert = Titanium.UI.createAlertDialog({
	        title : 'Alert',
	        message : 'Unlock Code has been cleared!',
	        buttonNames : ['Ok']
	    });
 
		alert.addEventListener('click', function(e) {
	        if(e.index == 0) {
	            utm.navController.close(utm.setPinWindow);
	        }
	    });
	    
	    alert.show();

	});
	

	saveButton.addEventListener('click', function() {
		var newPass = getPinNumberValue();
		newPass = Ti.Utils.sha256(newPass);
		
		keychain.setPasswordForService(newPass,'utm', 'lockscreen');
		//Confirm its set in the KeyChain
		var pass = keychain.getPasswordForService('utm', 'lockscreen');
		if(newPass !==pass){
			alert('PIN failed to save to your KeyChain');
			return;
		}
		
		utm.navController.close(utm.setPinWindow);
	});
	
	
	function checkToDisableSaveButton(){		
		var enableSave = true;	
		if (passwordHiddenBox.getValue().length !== 8) {
			enableSave=false;
		}
		
		//Check that the PIN and PIN Confirm match
		if (enableSave) {
			if(getPinNumberValue() !== getPinConfirmNumberValue()){
				enableSave=false;
				alert('Your codes do not match, please try again');
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
	win.addEventListener('focus', function() {		
		passwordHiddenBox.focus();
	});
	win.addEventListener('click', function() {		
		passwordHiddenBox.focus();
	});
	if (Ti.Platform.osname === 'android') {
		win.addEventListener('open', function() {	
			passwordHiddenBox.focus();
		});
	};
	
	 
	return win;

};
module.exports = SetPin_window;

