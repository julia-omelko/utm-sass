//utm is the js namespace for this app

var iPhone = false;
var Android = false;
if(Ti.Platform.osname == 'iphone'){
	iPhone = true
};
if(Ti.Platform.osname == 'android'){
	Android = true
};


var gaModule = require('Ti.Google.Analytics');
var analytics = new gaModule('UA-38943374-1');

var utm = {};
utm.loggedIn = false;
utm.envModePrefix = "";
utm.validatesSecureCertificate=false;
utm.color_org = '#F66F00';
utm.backgroundColor='#fff';
utm.textColor='#000';
utm.textFieldColor='#336699';
utm.appVersion = 'Version:'+Ti.App.version;
utm.netTimeout=6000;
utm.sentToContactListString = '';
utm.networkIsOnline = false;
var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;
utm.SCREEN_WIDTH = (pWidth > pHeight) ? pHeight : pWidth;
utm.SCREEN_HEIGHT = (pWidth > pHeight) ? pWidth : pHeight;
utm.enableSendMessageButton=false;
utm.appPauseTime=0;

//***************************************************************************
function NavigationController(a){
	// this is to avoid errors
	a = a || {};
	a.window = a.window || Ti.UI.createWindow();
	// this is to handle the iPhone Nav functionality
	if(iPhone){
		var win = Ti.UI.createWindow({
			barColor:utm.barColor
		});
		var nav = Ti.UI.iPhone.createNavigationGroup({
		   window: a.window
		});
		win.add(nav);
		win.push = function(b){
			nav.open(b);
		};
		win.close = function(b){
			//nav.close(b);
		};
		return win;
	}
	// there is no Nav in Android, so let's return the window
	if(Android){
		a.window.push = function(b){
			b.open({
				fullscreen:false
			});
		}
		a.window.close = function(b){
			b.close();
		}
		return a.window;
	}
}
//***************************************************************************




Ti.UI.setBackgroundColor('#fff');

utm.Login = require('screens/login');
utm.loginView = new utm.Login(utm);

utm.mainWindow = Ti.UI.createWindow();
utm.mainWindow.barColor=utm.barColor;

// let's call our custom navigation function
utm.navigation = NavigationController({
	window:utm.mainWindow 
});
// open it
utm.navigation.open();

appInit();

/*utm.navGroup = Ti.UI.iPhone.createNavigationGroup({
	window : utm.loginView
});
*/
//utm.mainWindow.add(utm.navGroup);
//utm.mainWindow.open();

//############### Require in Modules for app ###############
utm.LandingScreen = require('screens/landing');
utm.landingView = new utm.LandingScreen(utm);

utm.MessageScreen = require('screens/Messages');
utm.messageWindow = new utm.MessageScreen(utm);

utm.MyAccountWindow = require('/ui/handheld/MyAccount');
utm.myAccountWindow = new utm.MyAccountWindow(utm);

utm.ChooseMyHortView = require('/ui/handheld/ChooseMyHort');
utm.chooseMyHortView = new utm.ChooseMyHortView(utm);

utm.ChooseContactsView = require('/ui/handheld/ChooseContacts');
utm.chooseContactsView = new utm.ChooseContactsView(utm);

utm.WriteMessageView = require('/ui/handheld/WriteMessage');
utm.writeMessageView = new utm.WriteMessageView(utm);

utm.PreviewMessageView = require('/ui/handheld/PreviewMessage');
utm.previewMessageView = new utm.PreviewMessageView(utm);

utm.MyHortView = require('screens/MyHorts');
utm.myHortView = new utm.MyHortView(utm);


function appInit(){	
	
	analytics.start(10,true);
	
	if (Ti.Platform.model === 'Simulator') { 
		setEnvModePrefix("local");
		setAppMainColor('test');
	}else{
		setEnvModePrefix("test.");
		setAppMainColor('test');
	}	
	setEnvModePrefix(utm.envModePrefix);
	
	utm.navigation.push(utm.loginView);
}

 function setEnvModePrefix(env){
	utm.envModePrefix =env;
	if (env==='local') { 
		utm.serviceUrl = 'http://192.168.244.194/api/v1/';
	}else if(env==='dev' || env === 'test'){
		utm.serviceUrl = 'https://'+env +'youthisme.com/api/v1/';
	}	
}

//############### Application Event Handlers ###############

Ti.App.addEventListener('app:loginSuccess', handleLoginSuccess);
function handleLoginSuccess(event) {
	var msg = 'Login Success';
	//TODO rework as callback...
	//Ti.App.removeEventListener('app:loginSuccess', handleLoginSuccess);
//utm.User.userProfile.
	utm.loggedIn = true;
	utm.User = event.userData;
	utm.AuthToken = event.userData.UserProfile.AuthToken;
	
	analytics.trackPageview('/login');
	
	utm.myHorts = event.userData.MyHorts;
	if(utm.myHorts.length ===0 ){
		utm.enableSendMessageButton=false;
		utm.recordAnalytics('login failed', utm.User.UserProfile.UserName );
		var dialog = Ti.UI.createAlertDiautm.log({
		    cancel: 1,
			    buttonNames: [L('ok_button')],
			    message: 'You have not setup any MyHorts to group the people you wish to communicate with, please create at least one MyHort',
			    title: 'No MyHorts Available'
			  });	//TODO add option to link to website to create MyHort
			  dialog.show();
	}else{
		utm.recordAnalytics('login succes', utm.User.UserProfile.UserName );
		utm.enableSendMessageButton=true;
	}
	
	showLandingView();
}

Ti.App.addEventListener('app:showLandingView', showLandingView);
function showLandingView() {		
	utm.landingView.setEnableSendMessageButton(utm.enableSendMessageButton);
	utm.navigation.push(utm.landingView);
}

Ti.App.addEventListener('app:showMessages', showMessageWindow);
function showMessageWindow() {
	utm.navigation.push(utm.messageWindow);
	utm.recordAnalytics('show messages', '' );
}

Ti.App.addEventListener('app:showChooseMyHortWindow', showChooseMyHortWindow);
function showChooseMyHortWindow() {
	Ti.App.fireEvent('app:populateMyHortPicker');
	//Re #237 moved to ChooseMyHort.js
	//utm.navigation.push(utm.chooseMyHortView);	
	utm.recordAnalytics('Start Send Message', '' );
}

Ti.App.addEventListener('app:showMyAccountWindow', showMyAccountWindow);
function showMyAccountWindow() {
	utm.navigation.push(utm.myAccountWindow);
	utm.recordAnalytics('Show Account Window', '' );
}

Ti.App.addEventListener('app:showMyHortWindow', showMyHortWindow);
function showMyHortWindow() {
	utm.navigation.push(utm.myHortView);
	utm.recordAnalytics('Show MyHort Window', '' );
}

Ti.App.addEventListener('app:myHortChoosen', setMyHort);
function setMyHort(e) {
	utm.log('setMyHort() fired myHortId=' + e.myHortId);
	utm.targetMyHortID = e.myHortId
	utm.navigation.push(utm.chooseContactsView);

	//Fire event to trigger call to get contacts
	Ti.App.fireEvent('app:getContacts');
}

Ti.App.addEventListener('app:contactsChoosen', setContactsChoosen);
function setContactsChoosen(e) {
	utm.log('setContactsChoosen() fired sentToContactList=' + e.sentToContactList);
	utm.sentToContactList = e.sentToContactList;
	/*utm.sentToContactListString='To:';

	 for (var x=0;x<utm.sentToContactList.length;x++)
	 {
	 utm.sentToContactListString+= utm.sentToContactList[x] +',';
	 }
	 previewMessageView.sentToContactListString=utm.sentToContactListString;
	 utm.sentToContactListString=utm.sentToContactListString.slice(0, - 1);
	 */

	utm.navigation.push(utm.writeMessageView);

}

Ti.App.addEventListener('app:showWriteMessageView', showWriteMessageView);
function showWriteMessageView(e) {
	utm.log('showWriteMessageView() fired' );
	utm.writeMessageView.setMode(e.mode)
	utm.writeMessageView.setMessageData(e.messageData);
	
	//originalMessageId:_messageData.Id, replyTo:_messageData.FromUserId
	utm.navigation.push(utm.writeMessageView);	
}

Ti.App.addEventListener('app:showPreview', showPreview);
function showPreview(e) {
	utm.log('showPreview() fired message=' + e.messageText);
	utm.originalTextMessage = e.messageText;
	
	utm.previewMessageView.setMode(e.mode)
	utm.previewMessageView.setMessageData(e.messageData);
	
	utm.navigation.push(utm.previewMessageView)
	Ti.App.fireEvent('app:getMessagePreview', {
		messageText : e.messageText
	});
}

Ti.App.addEventListener('app:showMessagesAfterSend', showMessagesAfterSend);
function showMessagesAfterSend() {
	utm.log('showMessagesAfterSend() fired');
	
	if(utm.writeMessageView !=undefined){
		utm.writeMessageView.restForm();
		utm.navigation.close(utm.writeMessageView,{animated:false});
	}	
		
	if(utm.chooseContactsView != undefined){
		utm.chooseContactsView.restForm();
		utm.navigation.close(utm.chooseContactsView,{animated:false});	
	}
	
	if(utm.chooseMyHortView !=undefined){
		//utm.chooseMyHortView.restForm();
		utm.navigation.close(utm.chooseMyHortView,{animated:false});
	}
	
	if(utm.MessageDetailWindow !=undefined ){
		utm.navigation.close(utm.messageDetailWindow,{animated:false}); 
	}
	if(utm.messageWindow  !=undefined ){
		utm.navigation.close(utm.messageWindow ,{animated:false}); 
	}
	
	if(utm.writeMessageView !=undefined){
		utm.writeMessageView.restForm();
		utm.navigation.close(utm.writeMessageView,{animated:false});
	}	
	
	if(utm.previewMessageView != undefined){
		utm.navigation.close(utm.previewMessageView);		
	}
	showLandingView();
}

Ti.App.addEventListener('app:logout', showLoginView);
function showLoginView() {
	closeAllScreens();
	utm.navigation.push(utm.loginView);
	
	callLogoutService();
}

//Left Nav Buttons

utm.logoutButton = Ti.UI.createButton({
	title : L('logout')
});

utm.logoutButton.addEventListener('click', function() {
	Ti.App.fireEvent("app:logout", {});
	utm.landingView.hide();
});

utm.backToLandingScreenButton = Ti.UI.createButton({
	title : L('button_back')
});
utm.backToLandingScreenButton.addEventListener('click', function() {
	utm.log('backToLandingScreenButton fired');
	Ti.App.fireEvent("app:showLandingView", {});
});

utm.backToChooseMyHortScreenButton = Ti.UI.createButton({
	title : 'Choose Myhort'
});
utm.backToChooseMyHortScreenButton.addEventListener('click', function() {
	utm.log('backToChooseMyHortScreenButton fired');
	Ti.App.fireEvent("app:showChooseMyHortWindow", {});
});
utm.backToChooseContactsScreenButton = Ti.UI.createButton({
	title : 'Choose Contacts'
});
utm.backToChooseContactsScreenButton.addEventListener('click', function() {
	utm.log('backToChooseContactsScreenButton fired');
	Ti.App.fireEvent("app:myHortChoosen", {});
});

//Used to remove the leftNavButton
utm.emptyView = Ti.UI.createView({});

utm.activityIndicator = Ti.UI.createActivityIndicator({
	color : utm.color,
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : 18,
		fontWeight : 'bold'
	},
	style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
	height : 'auto',
	width : 'auto'
});
utm.mainWindow.add(utm.activityIndicator);
utm.activityIndicator.hide();

utm.logoutReq = Ti.Network.createHTTPClient({
	validatesSecureCertificate:utm.validatesSecureCertificate 
	,timeout:utm.netTimeout,
	onload : function() {
		var json = this.responseData;
		var response = JSON.parse(json);
		utm.log('Logout Service Returned');
		if (this.status != 200) {
			utm.log('Logout Error');
			messageArea.test = "Logout error";
		}
	},
	onerror : function(e) {
		//handleError(e,this.status,this.responseText); 
		//Note it logout fails its probable auth token does not exist and nothing we can do but record error
		utm.recordError("Status="+this.status + "   Message:"+this.responseText);
	}
	,timeout:utm.netTimeout
});

function callLogoutService(){
	//call logout service
	utm.logoutReq.open("POST", utm.serviceUrl + "Logout");
	utm.logoutReq.setRequestHeader('Authorization-Token', utm.AuthToken);
	utm.logoutReq.send();
	Titanium.Analytics.featureEvent('user.logged_out');	
}

utm.setActivityIndicator =function (_message) {
	if (_message != '') {
		utm.activityIndicator.show();
	} else {
		utm.activityIndicator.hide();
	}
	utm.activityIndicator.setMessage(_message);
}

function setAppMainColor(env){
	if(env==='dev'){
		utm.color = '#C0C0C0';
		utm.barColor = utm.color;
	}else{
		utm.color = utm.color_org; 
		utm.barColor = utm.color;
	}
	
}

Ti.Network.addEventListener('change', function(e) {
	utm.log('Network Status Changed:' + e.online);
	utm.log('Network Status Changed:' + Titanium.Network.networkType);
	utm.networkIsOnline = e.online;
	Ti.App.fireEvent("app:networkChange", {
		online : e.online
	});
});


function closeAllScreens(){
	if(utm.writeMessageView !=undefined){
		utm.navigation.close(utm.writeMessageView,{animated:false});
	}	
		
	if(utm.chooseContactsView != undefined){
		utm.navigation.close(utm.chooseContactsView,{animated:false});	
	}
	
	if(utm.chooseMyHortView !=undefined){
		utm.navigation.close(utm.chooseMyHortView,{animated:false});
	}
	
	if(utm.MessageDetailWindow !=undefined ){
		utm.navigation.close(utm.messageDetailWindow,{animated:false}); 
	}
	
	if(utm.messageWindow  !=undefined ){
		utm.navigation.close(utm.messageWindow ,{animated:false}); 
	}
	
	if(utm.writeMessageView !=undefined){
		utm.writeMessageView.restForm();
		utm.navigation.close(utm.writeMessageView,{animated:false});
	}	
	
	if(utm.previewMessageView != undefined){
		utm.navigation.close(utm.previewMessageView);		
	}
	
	if(utm.landingView != undefined){
		utm.navigation.close(utm.landingView);		
	}	
	if(utm.myAccountWindow != undefined){
		utm.navigation.close(utm.myAccountWindow);
	}
	
	if (utm.myHortView != undefined){
		utm.navigation.close(utm.myHortView);
	}
	
	if(utm.myHortDetailWindow != undefined){
		utm.navigation.close(utm.myHortDetailWindow);
	}
	
}

function handleError(e,status,responseText) {	
	utm.setActivityIndicator('');
	var err = JSON.parse(responseText);
	if(status ==403){
		alert('Your session is no longer valid, you need to log back in.');	
		closeAllScreens();	
		showLoginView();	
	}else if(e.error != 'undefined' & e.error.indexOf('timed out') > 0){
 		//"Error Domain=ASIHTTPRequestErrorDomain Code=2 "The request timed out" UserInfo=0xb2b10e0 {NSLocalizedDescription=The request timed out}"
		alert('Your connection may be slow - please retry.');	
 	}else{
 		if(e.error != undefined){
 			alert('Error:' + e.error);
 		}else if (err.Message != undefined){
 			alert('Error:' + err.Message);
 		}else{
 			alert('Error Unknown');	
 		}
 	}         
}

Ti.App.addEventListener("pause", function(e){
	utm.log('-------  APP Paused ------');
	appPauseTime= new Date();
	utm.log('-------  APP Paused appPauseTime='+appPauseTime.valueOf());
});

//IF the app is left for more then one minute force login
Ti.App.addEventListener("resumed", function(e){
	utm.log('-------  APP resumed ------');

	var curDate = new Date();
	var curMil =curDate.valueOf() ;
	var pauseMil = appPauseTime.valueOf();
	var diff = curMil-pauseMil;
	
	if( diff  > 60000){
			utm.log('-------  APP resumed  FORCE LOGIN');
			showLoginView();
	}else{
			utm.log('-------  APP resumed  NO FORCE LOGIN');
	}	
});

Titanium.App.addEventListener('close', function(e){
	analytics.stop();
});


utm.recordError = function (message) {
	utm.log('Error:' + message);
}

utm.log=function (message) {
	Ti.API.info(message);
}


utm.recordAnalytics = function (theEvent,theData){
	//	category, action, label, value
	analytics.trackEvent('Usage',theEvent,'Lbl1',theData );	
}
