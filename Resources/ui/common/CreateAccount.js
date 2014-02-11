var CreateAccountWin = function() {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Create Account', '');
	
	var backButton = Ti.UI.createLabel({
		text: 'Back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close({animated:true});
	});
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width: '100%',
		height: utm.viewableArea-10,
		showVerticalScrollIndicator: true,
		contentHeight: 'auto',
		layout: 'vertical',
		top: utm.viewableTop
	});
	self.add(scrollingView);
	
	var avatarHeader = Ti.UI.createLabel({
		text: 'Choose your avatar',
		top: 15*utm.sizeMultiplier,
		left: 25*utm.sizeMultiplier,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	scrollingView.add(avatarHeader);
	
	var avatarHolder = Ti.UI.createScrollView({
		top: 10*utm.sizeMultiplier,
		left: 15*utm.sizeMultiplier,
		right: 15*utm.sizeMultiplier,
		height: 90*utm.sizeMultiplier,
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 4,
		showHorizontalScrollIndicator: true,
		contentWidth: 'auto',
		scrollType: 'horizontal',
		selectedAvatar: 0
	});
	
	var aAvatar = [];
	for (var i=0; i<12; i++) {
		aAvatar[i] = Ti.UI.createImageView({
			left: (10*utm.sizeMultiplier) + (80*utm.sizeMultiplier*i),
			image: '/images/avatar/'+ i +'.png',
			width: 70*utm.sizeMultiplier,
			height: 70*utm.sizeMultiplier,
			backgroundColor: 'white',
			borderColor: '#D4D4D4',
			borderWidth: 1,
			borderRadius: 2,
			avatarID: i
		});
		aAvatar[i].addEventListener('click',function(e){
			for (var i=0; i<12; i++) {
				aAvatar[i].setBorderColor('#D4D4D4');
				aAvatar[i].setBorderWidth(1);
			}
			e.source.setBorderColor(utm.barColor);
			e.source.setBorderWidth(2);
			avatarHolder.selectedAvatar = e.source.avatarID;
		});
		avatarHolder.add(aAvatar[i]);
	}
	aAvatar[aAvatar.length-1].setRight(10);
	aAvatar[0].fireEvent('click');
	scrollingView.add(avatarHolder);
	
	var username = Ti.UI.createTextField({
		color: utm.textFieldColor,		
		width: Math.min(235*utm.sizeMultiplier,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: (utm.Android ? Ti.UI.SIZE : 40),
		hintText: 'username',
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 15,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
		paddingLeft: 7,
		isUnique: false,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	var focused = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	username.addEventListener('focus', function() {
		username.add(focused);
	});
	username.addEventListener('blur', function() { 
		username.remove(focused);
	});
	scrollingView.add(username);

	var nickname = Ti.UI.createTextField({
		color: utm.textFieldColor,		
		width: Math.min(235*utm.sizeMultiplier,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: (utm.Android ? Ti.UI.SIZE : 40),
		hintText: 'nickname',
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: -1,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	nickname.addEventListener('focus', function() {
		nickname.add(focused);
	});
	nickname.addEventListener('blur', function() { 
		nickname.remove(focused);
	});
	scrollingView.add(nickname);


	var password = Ti.UI.createTextField({
		color: utm.textFieldColor,		
		width: Math.min(235*utm.sizeMultiplier,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: (utm.Android ? Ti.UI.SIZE : 40),
		hintText: 'enter password',
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: -1,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
		paddingLeft: 7,
		passwordMask: true,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	password.addEventListener('focus', function() {
		password.add(focused);
	});
	password.addEventListener('blur', function() { 
		password.remove(focused);
	});
	scrollingView.add(password);
	
	var passwordConfirm = Ti.UI.createTextField({
		color: utm.textFieldColor,		
		width: Math.min(235*utm.sizeMultiplier,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: (utm.Android ? Ti.UI.SIZE : 40),
		hintText: 'retype password',
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: -1,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
		paddingLeft: 7,
		passwordMask: true,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	passwordConfirm.addEventListener('focus', function() {
		passwordConfirm.add(focused);
	});
	passwordConfirm.addEventListener('blur', function() { 
		passwordConfirm.remove(focused);
	});
	scrollingView.add(passwordConfirm);
	
	var PasswordMeter = require("/lib/PasswordStrength");
	var pwMeter = new PasswordMeter();
	
	var email = Ti.UI.createTextField({
		color: utm.textFieldColor,		
		width: Math.min(235*utm.sizeMultiplier,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: (utm.Android ? Ti.UI.SIZE : 40),
		hintText: 'enter your e-mail',
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 15,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	email.addEventListener('focus', function() {
		email.add(focused);
	});
	email.addEventListener('blur', function() { 
		email.remove(focused);
	});
	scrollingView.add(email);
	
	var phone = Ti.UI.createTextField({
		color: utm.textFieldColor,		
		width: Math.min(235*utm.sizeMultiplier,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: (utm.Android ? Ti.UI.SIZE : 40),
		hintText: 'phone (optional)',
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: -1,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	phone.addEventListener('focus', function() {
		phone.add(focused);
	});
	phone.addEventListener('blur', function() { 
		phone.remove(focused);
	});
	scrollingView.add(phone);
	
	var rulesView = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		top: 10,
		layout: 'horizontal'
	});
	scrollingView.add(rulesView);
	var rulesSwitch = Ti.UI.createSwitch({
		value: false
	});
	rulesView.add(rulesSwitch);
	var rulesLabel = Ti.UI.createLabel({
		text: 'I accept rules of use',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		left: 15,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor	
	});
	rulesView.add(rulesLabel);
	
	rulesLabel.addEventListener('click',function(e){
		var WebView = require('/ui/common/WebView');
		var webView = new WebView('Privacy Policy', utm.webUrl + '/Home/RulesOfUse');
		utm.navController.open(webView);
	});
	
	
	
	
	var StandardButton = require('/ui/common/baseui/StandardButton');
	var createButton = new StandardButton({title:'Create account'});
	createButton.addEventListener('click',function(e){
		validateForm();
	});
	self.add(createButton);
	
	
	
	function isUserNameUnique(_username){
		var checkUserNameRquest = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (response) {
					alert('This username is already in use');
				} else {
					register();
				}
				checkUserNameRquest = null;
			},
			onerror:  function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				checkUserNameRquest = null;
			},
			timeout : utm.netTimeout
		});
		Ti.API.info(utm.serviceUrl + "Account/IsUserNameFound?userName="+_username);
		checkUserNameRquest.open("GET", utm.serviceUrl + "Account/IsUserNameFound?userName="+_username);
		checkUserNameRquest.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		checkUserNameRquest.send();
	}
	
	function isValidEmail(_emailAddress) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;   
	  	if(reg.test(_emailAddress) == true) {	
	    	return true;
	    } else {
	    	return false;
	    }		
	}
	
	function isValidPhone(_phone){
		if (_phone === '') {
			return true;
		} else {
			var phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
		  	var digits = _phone.replace(/\D/g, "");
		  	return (digits.match(phoneRe) !== null);
		}
	}
	
	function isPasswordConfirmed(_password, _confirmPassword){
		if (_password !=+ _confirmPassword) {			
			return false;
		} else {	
			return true;
		}
	}
	
	function validateForm() {
		var pwStrengthCheck = pwMeter.checkPW(password.getValue());
		if (pwStrengthCheck !== '') {
			alert(pwStrengthCheck);
		} else if (!isValidEmail(email.getValue())) {
			alert('This email entered is not valid');
		} else if (password.getValue() !== passwordConfirm.getValue()) {
			alert('The entered passwords do not match');
		} else if (!isValidPhone(phone.getValue())) {
			alert('The phone number entered is not valid');
		} else if (!rulesSwitch.getValue()) {
			alert('You must accept the rules of use');
		} else {
			isUserNameUnique(username.getValue());
		}
	}

	function register() {
		var curReg = {
			UserName: username.getValue(),
			Password: password.getValue(),
			ConfirmPassword: passwordConfirm.getValue(),
			Email: email.getValue(),
			Mobile: (phone.getValue() === '' ? null : phone.getValue()),
			AcceptTerms: rulesSwitch.getValue(),
			RegistrationMethod: (utm.Android ? 'android' : 'ios'),
			Avatar: avatarHolder.selectedAvatar
		};
		
		var getSignUpReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					if (this.responseData) {
						if (response.Status ==='Error'){
							if (response.Message === "DuplicateEmail") {
								alert('This email is already registered.');
							}else{
								alert(response.Message);
							}
						} else {
							var dialog = Ti.UI.createAlertDialog({
							    message: 'Thank you for registering. Please check your email for a confirmation request with a link that will confirm your account. Once you click the link, your registration will be complete.',
							    ok:'OK'
							});
							dialog.addEventListener('click', function(e){    
								if (e.index === 0) {
							  		self.close();
							    }
						  	});
							dialog.show();
						}
					}
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
			},
			onerror : function(e) {
				if (this.responseData) {
					var error = eval('(' + this.responseData + ')');
					var errorString='';
					for (e=0;e<error.Data.length;e++){
						errorString+=error.Data[e];
					}
					alert(errorString);
				} else {
					utm.handleHttpError(e, this.status, this.responseText);
				}
			},
			timeout : utm.netTimeout
		});
		
		Ti.API.info(curReg);
		Ti.API.info(utm.serviceUrl + "Account/Create?returnUrl=/Account/Verify");
		
		getSignUpReq.open("POST", utm.serviceUrl + "Account/Create?returnUrl=/Account/Verify");
		getSignUpReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		getSignUpReq.send(JSON.stringify(curReg));
	}

	return self;
};

module.exports = CreateAccountWin;

