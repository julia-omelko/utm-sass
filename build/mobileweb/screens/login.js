

var TheLoginScreen_view = function() {
	
	var loginView = Ti.UI.createView({		
		backgroundColor: 'transparent',
		layout:'vertical'
	});
	
	var messageArea = Ti.UI.createLabel({
	  color: '#900',
	  text: '',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  width: 'auto', height: 30
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
		value : 'anthony@troyweb.com',
		hintText:L('label_user_name'),
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
		value : '10mary03',
		hintText:L('label_password'),
		passwordMask:true,
		keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	loginView.add(password);
	
	var loginBtn = Ti.UI.createButton({
		title:'Login',
		top:20,
		width:90,
		height:35,
		borderRadius:1,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	loginView.add(loginBtn);
	
	var loginReq = Ti.Network.createHTTPClient();
	loginBtn.addEventListener('click',function(e)
	{
		username.blur();
		password.blur();
		
		if (username.value != '' && password.value != '')
		{
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
			alert(L('user_name_password_req'));
		}
	});

	loginReq.onload = function()
	{
		var json = this.responseData;
		var response = JSON.parse(json);
		
		if(this.status ==200){
			Ti.App.fireEvent("app:loginSuccess", {
		        userData: response,
		        token: '34235235423452435'
		    });		
			
		}else if(this.status == 400){
			
			messageArea.setText("invalid_login");
			
		}else{
			messageArea.test="error";
			
		}		
		
	};
	
	return loginView;
};
module.exports = TheLoginScreen_view;

