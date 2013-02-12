var TheLoginScreen_view = function() {
	
	var loginView = Ti.UI.createWindow({		
		layout:'vertical'
		,backgroundColor:utm.backgroundColor
		,barColor:utm.barColor
	});
	
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
		top:20
	});
	loginView.add(utmLogo);
	
	var username = Ti.UI.createTextField({
		color:utm.textFieldColor,		
		width:300,
		height:40,
		hintText:L('label_user_name'),
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	loginView.add(username);
	
	var password = Ti.UI.createTextField({
		color:utm.textFieldColor,
		top:20,
		width:300,
		height:40,
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
		top:20,
		width:100,
		height:35,
		borderRadius:1,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	loginView.add(loginBtn);
	
	
	fillInTestLogin();
	
	check_network();
	
	
	function check_network() {
		log('Check network: '+Titanium.Network.networkType == Titanium.Network.NETWORK_NONE);
		
		if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
			log('Check Connection');
		  	setMessageArea('No Internet Connection Available- the UTM Application requires that you have a Internet Connection.');
		  	loginBtn.enabled=false;
		} else {
			loginBtn.enabled=true;
		   	setMessageArea('');
		}
			
	 	return Titanium.Network.online;
	}
	
	//Forgot Your Password?
	var forgotPWLabel = createLink(L('login_forgot_password'), 'https://'+utm.envModePrefix +'youthisme.com/Account/PasswordReset')
	loginView.add(forgotPWLabel);
		
	//Want to sign up?
	var signUpLabel = createLink(L('login_signup'), 'https://'+utm.envModePrefix +'youthisme.com/Account/Register')
	loginView.add(signUpLabel);
	
	//About UTM
	var tosLabel = createLink(L('login_about'), 'http://'+utm.envModePrefix +'youthisme.com/Home/About')
	loginView.add(tosLabel);

	//Version 0.12 Alpha	
	var versionLabel = Ti.UI.createLabel({
		  color: '#000',
		  font: { fontSize:14 },
		  text: utm.appVersion + '  ('+utm.envModePrefix +' DB)',
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
			var json = this.responseData;
			var response = JSON.parse(json);

			setActivityIndicator('');
			//clear out the password
			password.value='';
			username.value='';
			log('Login Service Returned');
			if(this.status ==200){
				//username.value('Login Successfull');
				Ti.App.fireEvent("app:loginSuccess", {
			        userData: response
			    });		
			    
			    Titanium.Analytics.featureEvent('user.logged_in');
			    
				
			}else{
				log('Login Error');
				messageArea.test="error";
				setMessageArea("Error in Service");
			}		
			
		},
		onerror:function(e){
			//clear out the password
			password.value='';
			username.value="";
			if(this.status==401){
			  	setActivityIndicator('');
				
				var err = JSON.parse(this.responseText);
				setMessageArea(err.Message);
				//TODO come up with error number system so we can internationalize errors
				//setMessageArea(L("invalid_login"));
				//Too many tries - Account is locked for 1 hour.
				//Invalid UserName/Password
				Titanium.Analytics.featureEvent('user.logged_in_invalid');
			}else{
			  	handleError(e,this.status,this.responseText);
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
		setActivityIndicator('Logging in');
		setMessageArea("");
		
		if (username.value != '' && password.value != '')
		{	
			log(username.value +' is logging in to UTM');
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
			setActivityIndicator('');
			alert(L('user_name_password_req'));			
		}
	});
	
	function createLink(lbl,url){
		
		var newLinkButton = Ti.UI.createLabel({
		  color: utm.textColor,
		  font: { fontSize:14 },
		  text: lbl,
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top: 20,
		  width:'auto', 
		  height: 20
		});
		
		newLinkButton.addEventListener('click', function(e) {
	    Ti.Platform.openURL(url);
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
		if (Ti.Platform.model == 'Simulator') { 
 			username.value='ad';
 			password.value='testtest1';
		}
	}

	return loginView;
};
module.exports = TheLoginScreen_view;

