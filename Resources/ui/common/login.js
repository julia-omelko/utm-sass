var LoginWin = function() {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('', '');
	self.setNavBarHidden(true);
	
	var scrollView = Ti.UI.createScrollView({
		scrollType : 'vertical',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		height: Ti.Platform.displayCaps.platformHeight
	});
	self.add(scrollView);
	var view = Ti.UI.createView({
		layout: 'vertical'
	});
	scrollView.add(view);
		
	var utmLogo = Ti.UI.createImageView({
		image: '/images/ytm_Narrow.png',
		width: '275dp',
		height: '71dp',
		top: Math.round(Ti.Platform.displayCaps.platformHeight*0.095)
	});
	view.add(utmLogo);
	
	var username = Ti.UI.createTextField({
		color: utm.textFieldColor,		
		width: Math.min(235,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: 40,
		hintText: L('label_user_name'),
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
		paddingLeft: 7
	});
	var usernameFocued = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	username.addEventListener('focus', function() {
		username.add(usernameFocued);
	});
	username.addEventListener('blur', function() { 
		username.remove(usernameFocued);
	});
	view.add(username);
	
	var password = Ti.UI.createTextField({
		color: utm.textFieldColor,
		top: 15,
		width: Math.min(235,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: 40,
		hintText: L('label_password'),
		passwordMask: true,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_GO,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
		paddingLeft: 7
	});
	var passwordFocued = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	password.addEventListener('focus', function() {
		password.add(passwordFocued);
	});
	password.addEventListener('blur', function() { 
		password.remove(passwordFocued);
	});
	password.addEventListener('return', function () {
		loginBtn.fireEvent('click');  
	});
	view.add(password);
	
	
	var loginBtn = Ti.UI.createButton({
		title: L('login'),
		top: 15,
		width: Math.min(235,Math.round(Ti.Platform.displayCaps.platformWidth*0.82)),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});
	view.add(loginBtn);
	
	
	var forgotPassword = Ti.UI.createLabel({
	  color: utm.secondaryTextColor,		
	  text: L('login_forgot_password'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  top: 15,
	  width: Ti.UI.SIZE,
	  height: Ti.UI.SIZE,
	  font: {fontFamily: utm.fontFamily, fontSize:'14dp' }
	});
	
	forgotPassword.addEventListener('click', function(e) {
	    //Ti.Platform.openURL(utm.webUrl + '/Account/PasswordReset');
		var WebView = require('/ui/common/WebView');
		var webView = new WebView('Password Reset', utm.webUrl + '/Account/PasswordReset');
		utm.navController.open(webView);
	});
	view.add(forgotPassword);
	
	var versionLabel = Ti.UI.createLabel({
		color: utm.textColor,	
		font: {fontFamily: utm.fontFamily, fontSize:'14dp' },
		text: Ti.App.version,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		top: 10,
		width: Ti.UI.SIZE, 
	  	height: Ti.UI.SIZE
	});
	view.add(versionLabel);
	versionLabel.addEventListener('longpress',function(e) {	
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Local','Dev', 'Test','Prod', L('cancel')],
			title : 'Choose The Environment'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				utm.setEnvModePrefix("local");					
			} else if (e.index === 1) {
				utm.setEnvModePrefix("dev");
			} else if (e.index === 2) {
				utm.setEnvModePrefix("test");
			}else if (e.index === 3) {
				utm.setEnvModePrefix("prod");
			}
		});
		dialog.show();
	});
	
	
	
	
	var tableData = [];
	tableData[0] = Ti.UI.createTableViewRow({
		title: 'New to UTM? Create an account',
		height: 35,
		backgroundColor: 'white',
		hasChild: true,
		color: 'black',
		font: {fontFamily: utm.fontFamily, fontSize:'14dp' }
	});
	tableData[0].addEventListener('click', function(e){
		var CreateAccount = require('/ui/common/CreateAccount');
		var createAccount = new CreateAccount();
		utm.navController.open(createAccount);
	});
	tableData[1] = Ti.UI.createTableViewRow({
		title: 'About YouThisMe & Our Promise',
		height: 35,
		backgroundColor: 'white',
		hasChild: true,
		color: 'black',
		font: {fontFamily: utm.fontFamily, fontSize:'14dp' }
	});
	tableData[1].addEventListener('click', function(e){
		var WebView = require('/ui/common/WebView');
		//var webView = new WebView('Who We Are', 'about');
		var webView = new WebView('Who We Are', utm.webUrl + '/Home/WhoWeAre');
		utm.navController.open(webView);
	});
	tableData[2] = Ti.UI.createTableViewRow({
		title: 'Privacy Policy',
		height: 35,
		backgroundColor: 'white',
		hasChild: true,
		color: 'black',
		font: {fontFamily: utm.fontFamily, fontSize:'14dp' }
	});
	tableData[2].addEventListener('click', function(e){
		var WebView = require('/ui/common/WebView');
		//var webView = new WebView('Privacy Policy', 'privacy');
		var webView = new WebView('Privacy Policy', utm.webUrl + '/Home/Privacy');
		utm.navController.open(webView);
	});
	tableData[3] = Ti.UI.createTableViewRow({
		title: 'Rules of Use',
		height: 35,
		backgroundColor: 'white',
		hasChild: true,
		color: 'black',
		font: {fontFamily: utm.fontFamily, fontSize:'14dp' }
	});
	tableData[3].addEventListener('click', function(e){
		var WebView = require('/ui/common/WebView');
		//var webView = new WebView('Rules of Use', 'rules');
		var webView = new WebView('Rules of Use', utm.webUrl + '/Home/RulesOfUse');
		utm.navController.open(webView);
	});
	
	var linkTable = Ti.UI.createTableView({
		data: tableData,
		bottom: 0,
		height: Ti.UI.SIZE
	});
	scrollView.add(linkTable);
	

	loginBtn.addEventListener('click',function(e) {
		username.blur();
		password.blur();

		if (username.value !== '' && password.value !== '') {	
			var shortVersionNum = Ti.App.version;
			var shortVersionNumArray = shortVersionNum.split('.');
			shortVersionNum = shortVersionNumArray[0] + '.' + shortVersionNumArray[1];
				
			var params = {
				UserName: username.value,
				Password: password.value,
				RememberMe: true,
				Version: shortVersionNum								
			};

			sendLogin(params);
		} else {
			alert(L('user_name_password_req'));			
		}
	});

	function sendLogin(params) {
		var loginReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate: utm.validatesSecureCertificate, 
			tlsVersion: Ti.Network.TLS_VERSION_1_2,
			onload : function() {
				var response = eval('('+this.responseText+')');
				if (this.status === 200) {
					password.setValue('');
					Ti.App.fireEvent("app:loginSuccess", {
				        userData: response
				    });
				} else {
					utm.handleHttpError({},this.status,this.responseText);
				}
				loginReq = null;
			},
			onerror:function(e) {
				password.setValue('');
				if (this.status === 401) {
					var err = JSON.parse(this.responseText);
					alert(err.Message);
				} else {
				  	utm.handleHttpError(e,this.status,this.responseText);
				}
				loginReq = null;
			},
			timeout:utm.netTimeout
		});
		
		loginReq.open("POST",utm.serviceUrl+"Login");	
		loginReq.send(params);
	};



	
/*
	
	//Forgot Your Password?
	var forgotPWLabel = createLink(L('login_forgot_password'), '/Account/PasswordReset');
	view.add(forgotPWLabel);

		
	//Want to sign up?
	var signUpLabel = createLink(L('login_signup'), '/Account/Register');
	var signUpLabel = Ti.UI.createLabel({
		 text:L('login_signup'),
		 color: utm.textColor,		
		 textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		 top:utm.Android ? '10dp' : 15,
		 width:'auto',
		 font: { fontSize:'20dp' }
		 //height: 20
	});
	 
	view.add(signUpLabel);

	signUpLabel.addEventListener('click',function(){
		Ti.App.fireEvent('app:signup');
	});
	
	//About UTM
	var tosLabel = createLink(L('login_about'), '/Home/WhoWeAre');
	view.add(tosLabel);

	//Version 0.12 Alpha	
	var versionLabel = Ti.UI.createLabel({
		  color: utm.textColor,	
		  font: { fontSize:'14dp' },
		  text: utm.appVersion,
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top:utm.Android ? '10dp' : 15,
		  width: 220//, 
		  //height: 50
		});
	
	view.add(versionLabel);
	
	function sendLogin(params) {
		var loginReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate:utm.validatesSecureCertificate 
			,tlsVersion:Ti.Network.TLS_VERSION_1_2
			,onload : function()
			{
	
				var response = eval('('+this.responseText+')');
				utm.log('success');
				utm.setActivityIndicator(win , '');
				//clear out the password
				
				utm.log('Login Service Returned');
				if(this.status ==200){
					//username.value('Login Successfull');
					Ti.App.fireEvent("app:loginSuccess", {
				        userData: response
				    });		
				    
				    Titanium.Analytics.featureEvent('user.logged_in');
				    password.value='';
					username.value='';
					
				}else{
					utm.log('Login Error');
					messageArea.test="error";
					setMessageArea("Error in Service");
				}
				loginReq = null;
				
			},
			onerror:function(e){
				//clear out the password   //FIXME  e.error   needs to be 
				utm.setActivityIndicator(win , '');
				password.value='';
				//username.value="";
				utm.log('errro');
				if(this.status==401){
				  	utm.setActivityIndicator(win , '');
					
					var err = JSON.parse(this.responseText);
					alert(err.Message);
					//TODO come up with error number system so we can internationalize errors
					//setMessageArea(L("invalid_login"));
					//Too many tries - Account is locked for 1 hour.
					//Invalid UserName/Password
					Titanium.Analytics.featureEvent('user.logged_in_invalid');
				}else{
				  	utm.handleError(e,this.status,this.responseText);
				}
				loginReq = null;
	 	         	
			}		
			,timeout:utm.netTimeout
			}
		);
		
		loginReq.open("POST",utm.serviceUrl+"Login");	
		loginReq.send(params);
		
		
	};
	
	//check this - may hold memory listening for events at this level.
	Ti.App.addEventListener('app:networkChange',check_network);

	
	loginBtn.addEventListener('click',function(e)
	{
		username.blur();
		password.blur();
		utm.setActivityIndicator(win , 'Logging in...');
		setMessageArea("");
		utm.log('Logging on using '+ utm.serviceUrl);
		if (username.value != '' && password.value != '')
		{	
			utm.log(username.value +' is logging in to UTM');
			//loginReq.open("POST",utm.serviceUrl+"Login");			
			
			var shortVersionNum = Ti.App.version;
			var shortVersionNumArray = shortVersionNum.split('.');
			shortVersionNum= shortVersionNumArray[0]+'.'+shortVersionNumArray[1];
				
			var params = {
				UserName: username.value,
				Password: password.value,
				RememberMe: true,
				Version:shortVersionNum								
			};
			//loginReq.send(params);
			sendLogin(params);
		}
		else
		{
			utm.setActivityIndicator(win , '');
			alert(L('user_name_password_req'));			
		}
	});
	
	function createLink(lbl,url){
		
		var newLinkButton = Ti.UI.createLabel({
		  color: utm.textColor,		
		  text: lbl,
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top:utm.Android ? '10dp' : 15,
		  width:'auto',
		  font: { fontSize:'20dp' }
		  //height: 20
		});
		
		newLinkButton.addEventListener('click', function(e) {
		    Ti.Platform.openURL(webUrl +url);
		});
		
		return newLinkButton;
	}
	
	function setMessageArea(msg){
		if(msg.length){
			messageArea.text=msg;
			messageArea.height='auto';
			messageArea.show();	
		}else{
			messageArea.text='';
			//messageArea.height=0;
			//messageArea.hide();
		}
	}
	function fillInTestLogin(){
		
		utm.log('Ti.Platform.model = ' +Ti.Platform.model );
		if (Ti.Platform.model === 'Simulator'  || Ti.Platform.model ===  'google_sdk' || Ti.Platform.model ===  'sdk') { 
 			username.value='tim';
 			password.value='*Arthur21';
		}
	}
	
	versionLabel.addEventListener('longpress',function(e)
	{	
		var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Local','Dev', 'Test','Prod', L('cancel')],
				title : 'Choose The Environment'
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					utm.setEnvModePrefix("local");					
				} else if (e.index === 1) {
					utm.setEnvModePrefix("dev");
				} else if (e.index === 2) {
					utm.setEnvModePrefix("test");
				}else if (e.index === 3) {
					utm.setEnvModePrefix("prod");
				}
				versionLabel.text=utm.appVersion ;//+ '  ('+utm.envModePrefix +' DB)';
				
			});
			dialog.show();
	});
	
	win.setVersionLabel =function(){
		versionLabel.text=utm.appVersion;// + '  ('+utm.envModePrefix +' DB)';
	}
	
	win.enableLoginButton =function(_enabled){
		loginBtn.enabled=_enabled;
	}
	
	win.setWebUrl = function(_webUrl){
		webUrl=_webUrl;
	}
	
	
	fillInTestLogin();
	
	check_network();
	
	view.addEventListener('click', function(e) { 
		var element = e.source.toString();
		
		if ( element == "[object TiUIWindow]" || element == "[object TiUIImageView]" ) {
			if ( username._hasFocus ) {
				username.blur();
			}
			
			if ( password._hasFocus ) {
				password.blur();
			}
		}
		
	});

	win.backButtonTitle = '';
	
	
	win.addEventListener('android:back',function(){
		
		var closeDialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Yes','No', L('cancel')],
				title : 'Do you want to close the UTM Application?'
			});
			closeDialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					//win.exitOnClose = true;
					utm.navController.close(win,{animated:false});			
					var activity = Titanium.Android.currentActivity;
        				activity.finish();
				} else {
					return false;
				}
				
			});
			closeDialog.show();
	});
	*/

	return self;
};
module.exports = LoginWin;

