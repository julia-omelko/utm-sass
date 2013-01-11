var TheLoginScreen_view = function() {
	
	var loginView = Ti.UI.createWindow({		
		backgroundColor: 'transparent',
		layout:'vertical'
	});
	
	var messageArea = Ti.UI.createLabel({
	  color: '#900',
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
		color:'#336699',		
		width:300,
		height:40,
		//value : 'ad',
		hintText:L('label_user_name'),
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	loginView.add(username);
	
	var password = Ti.UI.createTextField({
		color:'#336699',
		top:20,
		width:300,
		height:40,
	//	value : 't',
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
	var forgotPWLabel = createLink(L('login_forgot_password'), 'http://dev.youthisme.com/Account/PasswordReset')
	loginView.add(forgotPWLabel);
		
	//Want to sign up?
	var signUpLabel = createLink(L('login_signup'), 'http://dev.youthisme.com/Account/Register')
	loginView.add(signUpLabel);
	
	//Terms of Service
	var tosLabel = createLink(L('login_toc'), 'http://dev.youthisme.com/Home/About')
	loginView.add(tosLabel);
	
	//Privacy
	var privacyLabel = createLink(L('login_privacy'), 'http://dev.youthisme.com/Home/About')
	loginView.add(privacyLabel);
	
	//Version 0.12 Alpha	
	var versionLabel = Ti.UI.createLabel({
		  color: '#000',
		  font: { fontSize:14 },
		  text: utm.appVersion,
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top: 20,
		  width: 200, 
		  height: 50
		});
	
	loginView.add(versionLabel);
	
	
	var loginReq = Ti.Network.createHTTPClient({
		onload : function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			setActivityIndicator('');
			log('Login Service Returned');
			if(this.status ==200){
				//username.value('Login Successfull');
				Ti.App.fireEvent("app:loginSuccess", {
			        userData: response
			    });		
			    
			    Titanium.Analytics.featureEvent('user.logged_in');
			    
				
			}else if(this.status == 400){
				
				setMessageArea(L("invalid_login"));
				
			}else{
				log('Login Error');
				messageArea.test="error";
				setMessageArea("Error in Service");
			}		
			
		},
		onerror:function(e){
         	handleError(e);         	
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
		
		if (username.value != '' && password.value != '')
		{	
			log(username.value +' is logging in to UTM');
			//if(!utm.loggedIn){
				loginReq.open("POST",utm.serviceUrl+"Login");				
			//}
			
			//loginReq.setTimeout([25000]);
			var params = {
				UserName: username.value,
				Password: password.value,
				RememberMe: true								
			};
			loginReq.send(params);
			//clear out the password
			password.value='';
		}
		else
		{
			setActivityIndicator('');
			alert(L('user_name_password_req'));			
		}
	});
	
	function createLink(lbl,url){
		
		var newLinkButton = Ti.UI.createLabel({
		  color: utm.color,
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
	

	return loginView;
};
module.exports = TheLoginScreen_view;

