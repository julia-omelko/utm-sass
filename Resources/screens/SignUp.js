function signUp_window(utm) {

	var InputField = require('ui/common/baseui/InputField');
	var CheckBoxField = require('ui/common/baseui/CheckBox');
	var Header = require('ui/common/Header');
	var PasswordMeter = require("/lib/PasswordStrengthMeter");
	var isFormValid = false;
	var isUserNameValid = false;
	var confirmHaschanged=false;
	
	var win = new Header(utm,'Sign Up', 'Cancel');

	var scrollingView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		width:utm.SCREEN_WIDTH
	});
	win.add(scrollingView);

	var view = Ti.UI.createView({
		top: 10,
		height: 600,
		width:utm.SCREEN_WIDTH,
		layout: 'vertical'
	});

	scrollingView.add(view);

	//-----------------User Name  ----------------------
	var userName = new InputField(utm,'User Name', '40%', '', '50%', Ti.UI.KEYBOARD_DEFAULT,'',true);
	userName.left = 5;
	view.add(userName);

	//-----------------Password  ----------------------
	var password = new InputField(utm,'Password', '40%', '', '50%', Ti.UI.KEYBOARD_DEFAULT,'',true,'password');
	view.add(password);
	if (Ti.Platform.model === 'Simulator'  || Ti.Platform.model ===  'google_sdk') { 
		//password.setValue('Testtest1!');
	}

	var pwMeter = new PasswordMeter();
	view.add(pwMeter);
	
	var spacerView = Ti.UI.createView({
		height: 5
	});
	view.add(spacerView);
	//-----------------Confirm  ----------------------
	var confirm = new InputField(utm,'Confirm Password', '40%', '', '50%', Ti.UI.KEYBOARD_DEFAULT,'',true, 'password');
	confirm.left = 5;
	view.add(confirm);
	if (Ti.Platform.model === 'Simulator'  || Ti.Platform.model ===  'google_sdk') { 
		//confirm.setValue('Testtest1!');
	}

	//----------Email--------------------
	var email = new InputField(utm,'Email', '40%', '', '50%', Ti.UI.KEYBOARD_EMAIL,'',true);
	email.left = 5;
	view.add(email);

	//----------Mobile # --------------------
	/*var mobile = new InputField(utm,'Mobile Number', '40%', '', '50%', Ti.UI.KEYBOARD_DECIMAL_PAD,Ti.UI.RETURNKEY_NEXT,false,'',12);
	mobile.left = 5;
	view.add(mobile);
	//todo - handle international numbers some day....
	*/
	
	var mobileView = Ti.UI.createView({
		layout:'vertical',
		height:'50dp',
		left:5	
	});
	
	var mobileHView = Ti.UI.createView({
		height:'50dp',
		layout:'horizontal'
	});
	mobileView.add(mobileHView);	
	
	var mobileLbl = Ti.UI.createLabel({
		text: 'Mobile Number'	
		,top:16
		,left:'8dp'	
		,font:{fontWeight:'bold',fontSize:'14dp'}
		,width:'40%'
		,color : '#000'
	});
	mobileHView.add(mobileLbl);
	
	var flexSpace = Titanium.UI.createButton({
	    systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var btnDone = Titanium.UI.createButton({    
	    title : 'Done',
	    width : 67,
	    height : 32
	});
	btnDone.addEventListener('click',function(e){
	    mobile.blur();
	});
	
	var mobile = Ti.UI.createTextField({
		color:utm.textFieldColor,	
		width:'50%',
		top:'5dp',
		height:Ti.UI.SIZE, 
		autocorrect: false,
		keyboardType:  Ti.UI.KEYBOARD_DECIMAL_PAD,
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		enableReturnKey: true,
		borderRadius :5,
		_hasFocus: false,
		maxLength:12,
		keyboardToolbar : [flexSpace,btnDone]
	});
	mobileHView.add(mobile);
	view.add(mobileView);
	
	
	//----------Accept ROU --------------------
	var rouBox = Ti.UI.createView({
		layout : 'horizontal',
		height: '30dp',
		top:'5dp',
		left : '5dp'
	});
	view.add(rouBox);
	
	var rouCB = new CheckBoxField(false);
	rouBox.add(rouCB);
	
	var iAcceptLabel = Ti.UI.createLabel({
		text : "I accept YouThisMe's",
		left: '10dp',
		font : {
			fontWeight : 'bold',
			fontSize : '14dp'
		},
		color : '#000'
	});
	rouBox.add(iAcceptLabel);
	var rouLabel = Ti.UI.createLabel({
		text : " Rules of Use",
		font : {
			fontWeight : 'bold',
			fontSize : '14dp'
		},
		color : 'blue'
	});
	rouBox.add(rouLabel);
	
	//----------Save Button --------------------
	var saveButton = Ti.UI.createButton({
		title :'Signup',
		enabled : false
	});
	saveButton.addEventListener('click', function() {
		register();
	});
	view.add(saveButton);
	
	view.addEventListener('click', function(e) { 
		var element = e.source.toString();	
		
		if ( element == "[object TiUIView]" || element == "[object TiUILabel]" ) {
			if(userName.hasFocus()) { userName.setFocus(false); }
			if(password.hasFocus()) { password.setFocus(false); }
			if(confirm.hasFocus()) { confirm.setFocus(false); }
			if(email.hasFocus()) { email.setFocus(false); }
		//	if(mobile.hasFocus()) { mobile.setFocus(false); }
			mobile.blur();
		}	
	});
	
		
	function register() {
		saveButton.enabled = false;
		utm.setActivityIndicator(win , 'Signup in progress...');
		utm.curReg={};
		utm.curReg.UserName = userName.getValue();
		utm.curReg.Password = password.getValue();
		utm.curReg.ConfirmPassword = confirm.getValue();
		utm.curReg.Email = email.getValue();
		utm.curReg.Mobile = mobile.value == "" ? null : mobile.mobile;
		utm.curReg.AcceptTerms = true;
		utm.curReg.RegistrationMethod= utm.Android ? 'android' : 'ios';
		
		utm.setActivityIndicator(win , 'Sign Up in Progress...');
		getSignUpReq.open("POST", utm.serviceUrl + "Account/Create?returnUrl=/Account/Verify");
		getSignUpReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		getSignUpReq.send(JSON.stringify(utm.curReg));
	}

	var getSignUpReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {

			utm.setActivityIndicator(win , '');
			var response = eval('(' + this.responseText + ')');
			utm.signUps = response;

			if (this.status == 200) {
				
				if(this.responseData){
										
					if(response.Status ==='Error'){
						saveButton.enabled = true;
						if(response.Message ==="DuplicateEmail"){
							alert('This email is aready registered.');
						}else{
							alert(response.Message);	
						}
					}else{
						//Success
						saveButton.enabled = false;
						alert('Thank you for registering. Please check your email for a confirmation request with a link that will confirm your account. Once you click the link, your registration will be complete.'); 
						if(utm.iPhone || utm.iPad ){
							utm.navController.close(utm.signupView);
						}			
					}
							
				}

			} else if (this.status == 400) {
				saveButton.enabled = true;
				utm.recordError('Error');
			} else {
				saveButton.enabled = true;
				utm.recordError('Error');
			}

			utm.setActivityIndicator(win , '');
		},
		onerror : function(e) {
			utm.setActivityIndicator(win , '');
			saveButton.enabled = true;
			
			if(this.responseData){
				var error = eval('(' + this.responseData + ')');
				var errorString='';
				for (e=0;e<error.Data.length;e++){
					errorString+=error.Data[e];
				}
				alert(errorString);
			}else	if (this.status != undefined && this.status === 404) {
				alert('An error occured durring the registration.');
			} else {
				utm.handleError(e, this.status, this.responseText);
			}
		},
		timeout : utm.netTimeout
	});

	userName.addEventListenerEvent('blur', function checkForm(){		
		checkExistingUserName();
	});
	
	password.addEventListenerEvent('blur', function checkForm(){		
		validateForm();
	});
	
	password.addEventListenerEvent('change', function checkForm(){		
		validateForm();
	});
	
	confirm.addEventListenerEvent('blur', function checkForm(){		
		validateForm();
	});
	
	confirm.addEventListenerEvent('change', function checkForm(){	
		confirmHaschanged=true;	
		validateForm();
	});
	
	mobile.addEventListener('blur', function checkForm(){		
		validateForm();
	});
	
	mobile.addEventListener('change', function checkForm(e){		
		/*
		 var mobileVal = mobile.getValue();
		 var charv = mobileVal.charAt(mobileVal.length);
		 
		if(mobile.getValue().charAt(charv) == '-') return;

		if(mobile.getValue().length==3){
			mobile.setValue(mobile.getValue()+'-');
		}
		if(mobile.getValue().length==7){
			mobile.setValue(mobile.getValue()+'-');
		}*/
		validateForm();
	});

	email.addEventListenerEvent('blur', function checkForm(){		
		validateForm();
	});
	
	email.addEventListenerEvent('change', function checkForm(){		
		validateForm();
	});		
	
	rouBox.addEventListener('click', function checkForm(){		
		validateForm();
	});		
	
	
	
	var checkUserNameRquest = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			var response = eval('(' + this.responseText + ')');
			
			if(response){
				userName.setMessage('This user name is aready used');
				saveButton.enabled = false;
				isUserNameValid = false;
			}else{
				userName.setMessage('');
				isUserNameValid = true;
				validateForm();
			}
			
		},
		onerror:  function(e) {
			utm.setActivityIndicator(win , '');
			if (this.status != undefined && this.status === 404) {
				alert('An error occured checking your user name.');
			} else {
				utm.handleError(e, this.status, this.responseText);
			}
		},
		timeout : utm.netTimeout
	});
		
	function validateForm(){
		
		if( isUserNameValid
			& trimString(userName.getValue()) != ''
			& checkConfirmPassword(password.getValue(),confirm.getValue())
		 	& isValidEmail(email.getValue())
		 	& isValidPhone(mobile.value)
		 	& rouCB.isChecked()
		){
			//Form is valid
			saveButton.enabled = true;	
			isFormValid = true;
		}
		else {
			//Form is INValid
			saveButton.enabled = false;	
			isFormValid = false;
		}		
		// hard to deal with this one checkExistingUserName		
		
		var pwStrengthCheck = pwMeter.checkPW(password.getValue());
	}
	
	function checkExistingUserName(){
		checkUserNameRquest.open("GET", utm.serviceUrl + "Account/IsUserNameFound?userName="+userName.getValue());
		checkUserNameRquest.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		checkUserNameRquest.send();
	}
	
	function checkConfirmPassword(_password, _confirmPassword){
		
		if( ! confirmHaschanged) {
			confirm.setMessage('');			
			return false;
		}
		
		if(_password!= _confirmPassword){
			confirm.setMessage('Passwords do not match');			
			return false;
		} else {
			confirm.setMessage('');			
			return true;
		}
	}
	
	function isValidEmail(_emailAddress){
		 var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;   
		   if(reg.test(_emailAddress) == true) {	
		      	return true;
		    } else {
		         return false;
		    }		
	}
	
	function isValidPhone(_phone){
		if(_phone==''){
			return true;
		} else {
			var phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
		  	var digits = _phone.replace(/\D/g, "");
		  	return (digits.match(phoneRe) !== null);
		}
	}
	
	rouLabel.addEventListener('click', function(e) {
	    Ti.Platform.openURL(utm.webUrl + '/Home/RulesOfUse');
	});
	
	function trimString(str) {
        return str.replace(/^\s+|\s+$/g,"");
	}
		
	return win;
};

module.exports = signUp_window;
