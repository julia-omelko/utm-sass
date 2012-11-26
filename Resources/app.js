	
//utm is the js namespace for this app
var utm = {};
utm.loggedIn=false;
utm.serviceUrl='http://dev.youthisme.com/api/v1/';
utm.color='#007EAD';
utm.appVersion='version 0.14T Alpha';

var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;
utm.SCREEN_WIDTH = (pWidth > pHeight) ? pHeight : pWidth;
utm.SCREEN_HEIGHT = (pWidth > pHeight) ? pWidth : pHeight;


Ti.UI.setBackgroundColor('#fff');

utm.containerWindow= Ti.UI.createWindow({		
	backgroundColor: 'transparent'
});

utm.navGroup = Ti.UI.iPhone.createNavigationGroup(
{
	window:utm.containerWindow
});

utm.Login = require('screens/login');
utm.loginView =  new utm.Login();

utm.containerWindow.add(utm.loginView);
utm.navGroup.open(utm.containerWindow);

utm.mainWindow = Ti.UI.createWindow();
utm.mainWindow.add(utm.navGroup);
utm.mainWindow.open();


utm.networkIsOnline=false; 
Ti.Network.addEventListener('change', function(e) {
	log('Network Status Changed:'+e.online);
	log('Network Status Changed:'+Titanium.Network.networkType);
  	utm.networkIsOnline = e.online;
  	Ti.App.fireEvent("app:networkChange", {online:e.online});
});


Ti.App.addEventListener('app:loginSuccess',handleLoginSuccess);
function handleLoginSuccess(event){
	var msg ='Login Success';
	//TODO rework as callback...
	//Ti.App.removeEventListener('app:loginSuccess', handleLoginSuccess);
	
	utm.loggedIn=true;
	utm.User = event.userData;
	utm.AuthToken=event.userData.UserProfile.AuthToken;
	utm.myHorts = event.userData.MyHorts;	
	showLandingView();		
} 

utm.LandingScreen = require('screens/landing');
utm.landingView = new utm.LandingScreen();
utm.landingView.hide();
utm.landingView.height=0;
utm.containerWindow.add(utm.landingView);

utm.MessageScreen = require('screens/Messages');
utm.messageWindow = new utm.MessageScreen();
utm.messageWindow.hide();
utm.messageWindow.height=0;
utm.containerWindow.barColor='#007EAD';
utm.containerWindow.add(utm.messageWindow);

/*
var SendMessageScreen = require('screens/SendMessage');
var sendMessageWindow = new SendMessageScreen();
utm.containerWindow(sendMessageWindow);
*/

Ti.App.addEventListener('app:showLandingView',showLandingView);
function showLandingView(){	
	utm.containerWindow.leftNavButton = utm.logoutButton;
	utm.loginView.hide();
	utm.loginView.height=0;
	utm.logoutButton.hide();
	utm.messageWindow.height=0;
	utm.messageWindow.hide();
	utm.landingView.show();
	utm.landingView.height='auto';
} 


Ti.App.addEventListener('app:showMessages',showMessageWindow);
function showMessageWindow(){	
	utm.containerWindow.leftNavButton = utm.backButton;
	utm.loginView.hide();
	utm.loginView.height=0;
	utm.logoutButton.hide();
	utm.landingView.hide();
	utm.landingView.height=0;
	utm.messageWindow.height='auto';
	utm.messageWindow.show();
} 

Ti.App.addEventListener('app:logout',showLoginView);
function showLoginView(){	
	utm.containerWindow.leftNavButton = utm.emptyView;
	utm.logoutButton.hide();
	utm.loginView.show();
	utm.loginView.height='auto';
	utm.landingView.hide();
	utm.landingView.height=0;
	utm.logoutButton.hide();
	
	//call logout service
	utm.logoutReq.open("POST",utm.serviceUrl+"Logout");
	utm.logoutReq.setRequestHeader('Authorization-Token',utm.AuthToken);	
	utm.logoutReq.send();		
} 

Ti.App.addEventListener('app:showSendMessage',showSendMessageWindow);
function showSendMessageWindow(){	
	var SendMessageScreen = require('screens/SendMessage');
	var sendMessageWindow = new SendMessageScreen();
	utm.containerWindow.leftNavButton = utm.backButton;
	utm.loginView.hide();
	utm.loginView.height=0;
	sendMessageWindow.open();
} 

//Left Nav Buttons

utm.logoutButton = Ti.UI.createButton({title:'Logout'});
utm.logoutButton.hide();
utm.logoutButton.addEventListener('click', function()
{
   Ti.App.fireEvent("app:logout", {});
	utm.landingView.hide();
});

utm.backButton = Ti.UI.createButton({title:'Back'});
utm.backButton.hide();
utm.backButton.addEventListener('click', function()
{	log('Backbutton fired');
  	Ti.App.fireEvent("app:showLandingView", {});
	//utm.landingView.hide();
});

//Used to remove the leftNavButton
utm.emptyView = Ti.UI.createView({});


utm.logoutReq = Ti.Network.createHTTPClient({
	onload : function(){
		var json = this.responseData;
		var response = JSON.parse(json);
		log('Logout Service Returned');
		if(this.status != 200){
			log('Logout Error');
			messageArea.test="Logout error";
		}		
	},
	onError:function(e){
		log('Logout Service Error:'+e.error);
     	alert('Logout Error');			
	}
});


function log(message){		
	Ti.API.info(message);		
}

