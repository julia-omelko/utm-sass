var TheLoginScreen_view = function(utm) {
	
	var webUrl='';
	
	if(utm.iPhone || utm.iPad ){
		var loginView = Ti.UI.createWindow({			
			layout:'vertical',title:''
			, backgroundColor:utm.backgroundColor
			, barColor:utm.barColor
		});
	}
	
	if(utm.Android){
		//create the base screen and hid the Android navbar
		var loginView = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
		});
		
		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    color : utm.backgroundColor,
		    text:'',
		    top:0
		});
 
 		//add the navbar to the screen
		loginView.add(my_navbar);
		
		//add activityIndicator to window
		loginView.add(utm.activityIndicator)
	}
	
	var messageArea = Ti.UI.createLabel({
	  color: utm.textColor,
	  text: '',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  width: 'auto', height: 'auto'
	});
	loginView.add(messageArea);
		
	var utmLogo = Ti.UI.createImageView({
		image:'/images/ytm_Narrow.png',
		width:275,
		height:71,
		top:20,
		bottom:utm.Android ? 50 : 0
	});
	loginView.add(utmLogo);
	
	var username = Ti.UI.createTextField({
		color:utm.textFieldColor,		
		width:300,
		hintText:L('label_user_name'),
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top:utm.Android ? 30 : 5
	});
	loginView.add(username);
	
	var password = Ti.UI.createTextField({
		color:utm.textFieldColor,
		top:utm.Android ? 40 : 20,
		width:300,

		hintText:L('label_password'),
		passwordMask:true,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	loginView.add(password);
	
	var loginBtn = Ti.UI.createButton({
		title:L('login'),
		top:utm.Android ? 40 : 20,
		width:100,
		borderRadius:1,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
	});
	loginView.add(loginBtn);
	
	function check_network() {
		//utm.log('Check network: '+Titanium.Network.networkType == Titanium.Network.NETWORK_NONE);
		
		if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
			utm.log('Check Connection');
		  //	setMessageArea('No Internet Connection Available- the UTM Application requires that you have a Internet Connection.');
		  	loginBtn.enabled=false;
		} else {
			loginBtn.enabled=true;
		//   	setMessageArea('');
		}
			
	 	return Titanium.Network.online;
	}
	
	//Forgot Your Password?
	var forgotPWLabel = createLink(L('login_forgot_password'), '/Account/PasswordReset')
	loginView.add(forgotPWLabel);
		
	//Want to sign up?
	//var signUpLabel = createLink(L('login_signup'), '/Account/Register')
	/*var signUpLabel = Ti.UI.createLabel({
		 text:L('login_signup'),
		 color: utm.textColor,		
		 textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		 top: 20,
		 width:'auto',
		 font: { fontSize:'20dp' }
		 //height: 20
	}) 
	loginView.add(signUpLabel);
	signUpLabel.addEventListener('click',function(){
		Ti.App.fireEvent('app:signup');
	})
	*/
	//About UTM
	var tosLabel = createLink(L('login_about'), '/Home/WhoWeAre')
	loginView.add(tosLabel);

	//Version 0.12 Alpha	
	var versionLabel = Ti.UI.createLabel({
		  color: utm.textColor,	
		  font: { fontSize:'14dp' },
		  //text: utm.appVersion + " " + '  ('+utm.envModePrefix +' DB)',
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top: 10,
		  width: 220, 
		  height: 50
		});
	
	loginView.add(versionLabel);
		
	var loginReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate 
		,tlsVersion:Ti.Network.TLS_VERSION_1_2
		,onload : function()
		{

			var response = eval('('+this.responseText+')');
			utm.log('success');
			utm.setActivityIndicator('');
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
			
		},
		onerror:function(e){
			//clear out the password   //FIXME  e.error   needs to be 
			utm.setActivityIndicator('');
			password.value='';
			//username.value="";
			utm.log('errro');
			if(this.status==401){
			  	utm.setActivityIndicator('');
				
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
 	         	
		}		
		,timeout:utm.netTimeout
		}
	);
	
	//check this - may hold memory listening for events at this level.
	Ti.App.addEventListener('app:networkChange',check_network);

	
	loginBtn.addEventListener('click',function(e)
	{
		username.blur();
		password.blur();
		utm.setActivityIndicator('Logging in');
		setMessageArea("");
		utm.log('Logging on using '+ utm.serviceUrl);
		if (username.value != '' && password.value != '')
		{	
			utm.log(username.value +' is logging in to UTM');
			loginReq.open("POST",utm.serviceUrl+"Login");				

			var params = {
				UserName: username.value,
				Password: password.value,
				RememberMe: true								
			};
			loginReq.send(params);
			
		}
		else
		{
			utm.setActivityIndicator('');
			alert(L('user_name_password_req'));			
		}
	});
	
	function createLink(lbl,url){
		
		var newLinkButton = Ti.UI.createLabel({
		  color: utm.textColor,		
		  text: lbl,
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top: 20,
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
			messageArea.height=0;
			messageArea.hide();
		}
	}
	function fillInTestLogin(){
		utm.log('Ti.Platform.model = ' +Ti.Platform.model );
		if (Ti.Platform.model === 'Simulator'  || Ti.Platform.model ===  'google_sdk') { 
 			username.value='ad';
 			password.value='testtest1';
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
				//versionLabel.text=utm.appVersion + '  ('+utm.envModePrefix +' DB)';
				
			});
			dialog.show();
	});
	
	loginView.setVersionLabel =function(){
		//versionLabel.text=utm.appVersion + '  ('+utm.envModePrefix +' DB)';
	}
	
	loginView.enableLoginButton =function(_enabled){
		loginBtn.enabled=_enabled;
	}
	
	loginView.setWebUrl = function(_webUrl){
		webUrl=_webUrl;
	}
	
	
	fillInTestLogin();
	
	check_network();
	

	return loginView;
};
module.exports = TheLoginScreen_view;

