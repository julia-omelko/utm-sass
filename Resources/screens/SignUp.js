function signUp_window(utm) {

	var InputField = require('ui/common/baseui/InputField');
	var isFormValid = false;
	var isUserNameValid=false;
	
	var win = Ti.UI.createWindow({
		layout : 'vertical',
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor,
		title : 'Sign Up',
		backButtonTitle:'Cancel'
	});

	var scrollingView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
	});
	win.add(scrollingView);

	var view = Ti.UI.createView({
		height : 2000,
		layout : 'vertical'
	});

	scrollingView.add(view);

	//-----------------User Name  ----------------------
	var userName = new InputField('User Name', 80, '', 210, Ti.UI.KEYBOARD_DEFAULT,'',true);
	view.add(userName);

	//-----------------Password  ----------------------
	var password = new InputField('Password', 80, '', 210, Ti.UI.KEYBOARD_DEFAULT,'',true,'password');
	view.add(password);
	//password.setValue('testtest1');

	//-----------------Confirm  ----------------------
	var confirm = new InputField('Confirm Password', 80, '', 210, Ti.UI.KEYBOARD_DEFAULT,'',true, 'password');
	view.add(confirm);
	//confirm.setValue('testtest1');

	//----------Mobile # --------------------
	var mobile = new InputField('Mobile Number', 80, '', 210, Ti.UI.KEYBOARD_DECIMAL_PAD,'',true);
	view.add(mobile);

	//----------Email--------------------
	var email = new InputField('Email', 80, '', 210, Ti.UI.KEYBOARD_EMAIL,'',true);
	view.add(email);



	var saveButton = Ti.UI.createButton({
		title :'Signup',
		top : 3,
		enabled : false
	});
	saveButton.addEventListener('click', function() {
		utm.log('saveButton fired');
		register();
	});
	view.add(saveButton);
	
	
	function register() {
		saveButton.enabled = false;
		utm.setActivityIndicator('Signup in progress...');
		utm.curReg={};
		utm.curReg.UserName=userName.getValue();
		utm.curReg.Password=password.getValue();
		utm.curReg.ConfirmPassword=confirm.getValue();
		utm.curReg.Email = email.getValue();
		utm.curReg.Mobile = mobile.getValue();
		
		getSignUpReq.open("POST", utm.serviceUrl + "Account/Create?returnUrl=/Account/Verify");
		getSignUpReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		getSignUpReq.send(JSON.stringify(utm.curReg));
	}

	var getSignUpReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {

			
			var response = eval('(' + this.responseText + ')');
			utm.signUps = response;
			utm.setActivityIndicator('');
			if (this.status == 200) {
				
				if(this.responseData){
					
					var error = eval('(' + this.responseData + ')');
					
					if(error.Status ==='Error'){
						saveButton.enabled = true;
						if(error.Message ==="DuplicateEmail"){

							var dialog = Ti.UI.createAlertDialog({
								cancel : 1,
								buttonNames : [L('login'), L('cancel')],
								message : 'Your email is already registered would you like to login now?',
								title : 'Email Found' });
								
								dialog.addEventListener('click', function(e) {
									if (e.index !== e.source.cancel) {
										Ti.App.fireEvent('app:logout');
									}
								});
							dialog.show();
							
						}else{
							alert(error.Message);	
						}
						
					}else{
						//Success
						saveButton.enabled = false;
						alert('Thank you for registering. Please check your email for a confirmation request with a link that will confirm your account. Once you click the link, your registration will be complete.'); 
						utm.navController.close(utm.signupView);	
					}				
				}

			} else if (this.status == 400) {
				saveButton.enabled = true;
				utm.recordError('Error')
			} else {
				saveButton.enabled = true;
				utm.recordError('Error')
			}

			
		},
		onerror : function(e) {
			utm.setActivityIndicator('');
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

	userName.addEventListenerEvent('blur', function checkUserName(){		
		checkExistingUserName();
	});
	
	password.addEventListenerEvent('blur', function checkUserName(){		
		validateForm();
	});
	
	confirm.addEventListenerEvent('blur', function checkUserName(){		
		validateForm();
	});
	
	confirm.addEventListenerEvent('change', function checkUserName(){		
		validateForm();
	});
	
	mobile.addEventListenerEvent('blur', function checkUserName(){		
		validateForm();
	});

	email.addEventListenerEvent('blur', function checkUserName(){		
		validateForm();
	});
	
	email.addEventListenerEvent('change', function checkUserName(){		
		validateForm();
	});		
	
	var checkUserNameRquest = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			var response = eval('(' + this.responseText + ')');
			
			if(response){
				userName.setMessage('This user name is aready used');
				saveButton.enabled=false;
				isUserNameValid=false;
			}else{
				userName.setMessage('');
				isUserNameValid=true;
				validateForm();
			}
			
		},
		onerror:  function(e) {
			utm.setActivityIndicator('');
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
			&& checkConfirmPassword(password.getValue(),confirm.getValue())
		 	&& isValidEmail(email.getValue())
		 	&& isValidPhone(mobile.getValue())
		){
			//Form is valid
			saveButton.enabled=true;	
			isFormValid=true;
		}else{
			//Form is INValid
			saveButton.enabled=false;	
			isFormValid=false;
		}		
		// hard to deal with this one checkExistingUserName		
	}
	
	function checkExistingUserName(){
		checkUserNameRquest.open("GET", utm.serviceUrl + "Account/IsUserNameFound?userName="+userName.getValue());
		checkUserNameRquest.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		checkUserNameRquest.send();
	}
	
	function checkConfirmPassword(_password, _confirmPassword){
		if(_password!= _confirmPassword){
			confirm.setMessage('Passwords do not match');			
			return false;
		}else{
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
		if(_phone && _phone.length > 0){
			return true;
		}else{
			return false;
		}		
	}

	return win;
};

module.exports = signUp_window;
