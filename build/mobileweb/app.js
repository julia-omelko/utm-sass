	
//js namespace for this app
var utm = {};

utm.serviceUrl='http://dev.youthisme.com/api/v1/';

Titanium.UI.setBackgroundColor('#fff');

utm.containerWindow= Ti.UI.createWindow({		
	backgroundColor: 'transparent',
	layout:'vertical'
});

utm.navGroup = Titanium.UI.iPhone.createNavigationGroup(
{
	window:utm.containerWindow
});

utm.Login = require('screens/login');
utm.loginView =  new utm.Login();

utm.containerWindow.add(utm.loginView);
utm.navGroup.open(utm.containerWindow);

var main = Titanium.UI.createWindow();
main.add(utm.navGroup);
main.open();


Ti.App.addEventListener('app:loginSuccess',handleLoginSuccess);
function handleLoginSuccess(event){
	var msg ='Login Success';
	//TIM ?? 
	//Ti.App.removeEvent('app:loginSuccess', handleLoginSuccess);
	
	utm.User = event.userData;
	utm.AuthToken=event.userData.AuthToken;
	utm.myHorts = event.userData.MyHorts;
	
	utm.loginView.hide();
	utm.loginView.height=0;
	
	utm.LandingScreen = require('screens/Landing');
	utm.landingView = new utm.LandingScreen();
	utm.containerWindow.add(utm.landingView);
	utm.landingView.show();
	
	utm.logoutButton = Titanium.UI.createButton({title:'Logout'});
 	utm.containerWindow.leftNavButton = utm.logoutButton;
 	utm.logoutButton.show();
    utm.logoutButton.addEventListener('click', function()
    {
       Ti.App.fireEvent("app:logout", {});
		utm.landingView.hide();
  	});
	
	
} 

utm.MessageScreen = require('screens/Messages');
utm.messageWindow = new MessageScreen();

Ti.App.addEventListener('app:showMessages',showMessageWindow);
function showMessageWindow(){	

	utm.messageWindow.open();
} 

Ti.App.addEventListener('app:logout',showLoginView);
function showLoginView(){	
	//utm.loginView.open();
	utm.loginView.show();
	utm.loginView.height='auto';
	utm.landingView.hide();
	utm.landingView.height=0;
	utm.logoutButton.hide();
	
} 

Ti.App.addEventListener('app:showSendMessage',showSendMessageWindow);
function showSendMessageWindow(){	
	var SendMessageScreen = require('screens/SendMessage');
	var sendMessageWindow = new SendMessageScreen();
	sendMessageWindow.open();
} 


