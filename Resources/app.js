

//utm is the js namespace for this app
utm = {};
utm.iPhone = false;
utm.iPad = false;
utm.Android = false;
utm.setEnvModePrefix = function (env){
	utm.envModePrefix = env;
	if (env === 'dev' || env === 'test') {
		utm.serviceUrl = 'https://' + env + '.youthisme.com/api/v1/';
		utm.webUrl = 'https://' + env + '.youthisme.com';
	} else if(env === 'prod') {
		utm.serviceUrl = 'https://prod.youthisme.com/api/v1/';
		utm.webUrl ='https://www.youthisme.com';
	}	
};
if (Ti.Platform.osname == 'iphone') {
	utm.iPhone = true;
	utm.viewableArea = Ti.Platform.displayCaps.platformHeight - 114;
} else if(Ti.Platform.osname == 'ipad') {
	utm.iPad = true;
	utm.viewableArea = Ti.Platform.displayCaps.platformHeight - 114;
} else if(Ti.Platform.osname == 'android') {
	utm.Android = true;
};
if (Ti.Platform.model === 'Simulator' || Ti.Platform.model ===  'google_sdk' || Ti.Platform.model ===  'sdk') { 
	utm.setEnvModePrefix("dev");
	utm.validatesSecureCertificate = false;
} else {
	utm.setEnvModePrefix("prod");
	utm.validatesSecureCertificate = true;
}	
utm.netTimeout = 18000;
utm.screenLockTime = 5000;

utm.color_org = '#F29737';
utm.barColor = '#22ACF5';
utm.androidBarColor = '#22ACF5';
utm.backgroundColor = '#F2F2F2';
utm.textColor = '#000000';
utm.secondaryTextColor = '#858585';
utm.textFieldColor='#000000';
utm.textErrorColor='#800000';
utm.buttonColor = '#F27100';
utm.androidTitleFontSize = 25;
utm.androidTitleFontWeight = 'bold';
utm.androidLabelFontSize = 25;
if (utm.Android) {
	utm.fontFamily = 'Titillium-Light';
} else {
	utm.fontFamily = 'Titillium';
}

//Note 2 diff controllers based on platform folders
var NavigationController = require('NavigationController');
utm.navController = new NavigationController(utm);

utm.twitterConsumerKey = ""; //'8qiy2PJv3MpVyzuhfNXkOw';
utm.twitterConsumerSecret = ""; //'Qq0rth4MHGB70nh20nSzov2zz6GbVxuVndCh2IxkRWI';
utm.facebookAppId = '494625050591800';

utm.showSplashScreenOnPause = true;
utm.inSubscriptionMode = false;
utm.loggedIn = false;
utm.isInPinLock = false;
utm.appPauseTime = new Date();

var unpinLockScreen = require('/lib/com.qbset.unlockscreen');
if(utm.iPhone || utm.iPad ){
	var keychain = require("com.0x82.key.chain");
} else {
	var keychain = require("/lib/androidkeychain");
}




(function() {
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	var Login = require('ui/common/login');
	var loginView = new Login();
	utm.navController.open(loginView);

})();

// handle login
Ti.App.addEventListener('app:loginSuccess', handleLoginSuccess);
function handleLoginSuccess(event) {
	var msg = 'Login Success';
	utm.loggedIn = true;
	var d = new Date();
	var n = d.getTime();
	utm.activityActive = n;
	
	if (utm.User) {
		utm.User.MyHorts =[];
	}
	utm.User = event.userData;
	utm.AuthToken = event.userData.UserProfile.AuthToken;
	utm.twitterConsumerKey = event.userData.TwitterInfo.TwitterConsumerKey;
	utm.twitterConsumerSecret = event.userData.TwitterInfo.TwitterConsumerSecret;
	utm.products = event.userData.AppleInAppProducts;
	
	utm.User.MyHorts = event.userData.MyHorts;

	//utm.recordAnalytics('login succes', utm.User.UserProfile.UserName );
	utm.enableSendMessageButton=true;
	
	isSubscriptionValid(utm.User.UserProfile.SubscriptionEnds);
	//Ti.App.fireEvent('App:startTransactionListener');
	openTabGroup();
}

// check if the user's subscription is up to date
function isSubscriptionValid(subscriptionEnds) {
	if (subscriptionEnds !== null) {
		var d = subscriptionEnds;
		var theYear = d.split('-')[0];
		var theMonth = d.split('-')[1];
		var theDay = d.split('-')[2].split('T')[0];
		var theHour = d.split('-')[2].split('T')[1].split(':')[0];
		var theMinute = d.split(':')[1];
		var theSecond = d.split(':')[2].split('.')[0];
		var theMilli = d.split('.')[1];
		var expiresUtmDT = new Date(theYear, theMonth-1, theDay, theHour, theMinute, theSecond, theMilli);
		var deviceDT = new Date();
		var deviceUtmDT = new Date(deviceDT.getFullYear(), deviceDT.getMonth(), deviceDT.getDate(), deviceDT.getHours(), deviceDT.getMinutes(), 0, 0);
		
		if (expiresUtmDT < deviceUtmDT && utm.User.UserProfile.HasSubscription) {
			// expired subscription
			utm.User.UserProfile.SubscriptionEnds = null;
			utm.User.UserProfile.MessagesRemaining = 0;
			return false;
		} else {
			// valid subscription
			return true;
		}
	} else {
		// no subscription
		return false;
	}
}

function openTabGroup() {
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	utm.tabGroup = new ApplicationTabGroup();
	utm.tabGroup.open();
}

moment = require('lib/moment');
function getDateTimeFormat(dateSent){
	var sent = moment(dateSent);
	var hours = sent.fromNow();
	var now = moment();

	diff = now.diff(sent, 'days'); // 1
			
	if (diff > 0) {
		return sent.format("M/D/YY");
	} else {
		var sToSubtract = 0;
		if (now.milliseconds() << sent.milliseconds()) {
			var sToSubtract = 30;
		}
		return  formattedDateSent = sent.subtract('seconds', sToSubtract).fromNow();
	}
}

if (utm.iPhone || utm.iPad ) {
	Ti.include('storekit.js');
}





Ti.App.addEventListener('app:logout', callLogoutService);
function showLoginScreenLockView() {
	showLoginView();
}
function showLoginView() {
	if (utm.loggedIn) {
		utm.tabGroup.close();
		callLogoutService();
		utm.loggedIn = false;
	}	
	utm.User = null;
}

function callLogoutService(){
	var logoutReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate, 
		timeout:utm.netTimeout,
		onload : function() {
			var response = eval('('+this.responseText+')');
			logoutReq = null;
		},
		onerror : function(e) {
			utm.handleHttpError(e, this.status, this.responseText);
			logoutReq = null;
		},
		timeout:utm.netTimeout
	});

	logoutReq.open("POST", utm.serviceUrl + "Logout");
	logoutReq.setRequestHeader('Authorization-Token', utm.AuthToken);
	logoutReq.send();
	
}

// Note: this does not work in the simulator
var SplashView = require('ui/common/Splash');
var splashView = new SplashView();
Ti.App.addEventListener('pause', function(e){
	if (utm.loggedIn) {
		utm.appPauseTime = new Date();
		splashView.open();
	}
});

Ti.App.addEventListener("resumed", function(e){
	splashView.close();
		
	if (!utm.loggedIn || utm.inSubscriptionMode) {
		return;
	}
	
	var curDate = new Date();
	var curMil = curDate.valueOf() ;
	var pauseMil = utm.appPauseTime.valueOf();
	var diff = curMil - pauseMil;
	if (diff > utm.screenLockTime) {
		var pass = keychain.getPasswordForService('utm', 'lockscreen');
		if (pass == null) {
			showLoginScreenLockView();
		}else{
			showPinLockScreen(pass);		
		}
	}		
});

function showPinLockScreen(_pass) {
	if(_pass == null || utm.isInPinLock) {
		return;	
	}
	utm.isInPinLock = true;
	unlockWindow = unpinLockScreen.loadWindow({
		// main properties for the module
		configLockScreen: { // main properties for the module
			passCode: _pass, // set the passcode (string)
			attempts: 0, // zero for infinite attempts and no timeout (int)
			timeOut: 5000, // time out in miliseconds after amount of incorrect attempts. Only when attempts is bigger then zero (int)
			timeOutMultiplier: 2, // after each set of attempts the time out is multiplied with this property (int)
			vibrateOnIncorrect: true, // vibrate phone on incorrect passcode input (bool)				
		},
		// properties for the messageBox
		messageBox: {
			text: 'Enter Unlock Code',
			textCorrect: 'Unlock Code Accepted',
			textIncorrect: 'Wrong Unlock Code',
			textColorCorrect: '#ffffff',
			textColorIncorrect: '#ffffff',
			vibrateOnIncorrect: true,
			borderColor: '#ffffff',
			backgroundColor: '#F66F00'				
			},
		correct: function() {  	
			var d = new Date();
			var n = d.getTime();
			utm.activityActive = n;
			utm.isInPinLock = false;			      	
	    }
	});	
}

// this event fires when a user clicks to compose or reply to a message.
Ti.App.addEventListener('app:getSubscriptionInfo', function (e){
	var subscriptionInfoReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate, 
		timeout:utm.netTimeout,
		onload : function() {
			var response = eval('('+this.responseText+')');
			if (this.status == 200) {		
				utm.User.UserProfile.MessagesRemaining = response.MessagesRemaining;
				utm.User.UserProfile.SubscriptionEnds = response.SubscriptionEnds;
				utm.User.UserProfile.HasSubscription = response.HasSubscription;
				if (utm.User.UserProfile.HasSubscription === false) {
					utm.User.UserProfile.SubscriptionEnds = null;
				}
				
				if (!isSubscriptionValid(utm.User.UserProfile.SubscriptionEnds) && utm.User.UserProfile.MessagesRemaining < 1) { 
					// user must subscribe
					SubscribeInfoWin = require('/ui/common/Subscribe');
					subscribeInfoWin = new SubscribeInfoWin(utm.tabGroup);
					utm.tabGroup.getActiveTab().open(subscribeInfoWin);
					alert('You have no more messages available.');
				} else {
					//Subscription is ok so fire the callback
					Ti.App.fireEvent(e.callBack);
				}
			} else {
				utm.handleHttpError({}, this.status, this.responseText);
			}
			subscriptionInfoReq = null;
		},
		onerror : function(e) {		
			utm.handleHttpError(e, this.status, this.responseText);
			subscriptionInfoReq = null;
		}
	});
	
	subscriptionInfoReq.open("GET", utm.serviceUrl + "SubscriptionInfo");
	subscriptionInfoReq.setRequestHeader('Authorization-Token', utm.AuthToken);
	subscriptionInfoReq.send();
});


utm.handleHttpError = function (e,status,responseText) {	
	var err = JSON.parse(responseText);
	var message = 'Error Unknown';
	
	if (status == 403) {
		message = 'Your session is no longer valid. Please log back in.';		
		utm.tabGroup.close();
		showLoginView();	
	} else if (err  != 'undefined' & err !=null ) {
		message = err.Message;	
 	} else if (e.error != 'undefined' & e.error.indexOf('timed out') > 0) {
		message = 'Your connection may be slow. Please try again.';	
 	} else if (e.error != undefined || err.Message != undefined) {
		message = 'Error:';
		message += e.error != undefined ? e.error : err.Message;
		if ( message.indexOf("ASIHTTPRequestErrorDomain Code=1") !== 0 ) {
			message = "Your network has had an error. Please try again.";	
		}
 	}
 	
 	alert(message);         
};


/*




//utm is the js namespace for this app
var utm = {};
utm.loggedIn = false;
utm.isInPinLock=false;
utm.envModePrefix = "";
utm.validatesSecureCertificate=true;
utm.color_org = '#F66F00';
utm.barColor= '#F66F00';
utm.androidBarColor = '#CD8C52';
utm.backgroundColor='#fff';
utm.textColor='#000';
utm.textFieldColor='#336699';
utm.textErrorColor='#800000';
utm.androidTitleFontSize = 25;
utm.androidTitleFontWeight = 'bold';
utm.androidLabelFontSize = 25;
utm.appVersion = 'Version:' + Ti.App.version;
utm.netTimeout = 18000;
utm.screenLockTime = 5000;
utm.sentToContactListString = '';
utm.networkIsOnline = false;
var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;
utm.SCREEN_WIDTH = (pWidth > pHeight) ? pHeight : pWidth;
utm.SCREEN_HEIGHT = (pWidth > pHeight) ? pWidth : pHeight;
utm.showSplashScreenOnPause = true;
utm.enableSendMessageButton = false;
utm.appPauseTime = 0;
utm.inSubscriptionMode = false;

// Android lock screen timout
utm.activityActive = 0;
utm.androidTimeout = (5*60*1000); // 5 minutes

//var gaModule = require('Ti.Google.Analytics');
//var analytics = new gaModule('UA-38943374-1');

//These are set when the app:loginSuccess Event is handled
utm.twitterConsumerKey = ""; //'8qiy2PJv3MpVyzuhfNXkOw';
utm.twitterConsumerSecret = ""; //'Qq0rth4MHGB70nh20nSzov2zz6GbVxuVndCh2IxkRWI';
utm.facebookAppId = '494625050591800';
utm.currentOpenWindow='';

var unlockWindow = null;

utm.iPhone = false;
utm.iPad = false;
utm.Android = false;
if(Ti.Platform.osname == 'iphone'){
	utm.iPhone = true;
}else if(Ti.Platform.osname == 'ipad'){
	utm.iPad = true;
}else if(Ti.Platform.osname == 'android'){
	utm.Android = true;
};

var unpinLockScreen = require('/lib/com.qbset.unlockscreen');
if(utm.iPhone || utm.iPad ){
	var keychain = require("com.0x82.key.chain");
} else {
	var keychain = require("/lib/androidkeychain");
}

utm.log = function (message) {
	Ti.API.info(message);
};

Ti.UI.setBackgroundColor('#fff');

//Note 2 diff controllers based on platform folders
var NavigationController = require('NavigationController');
//MainWindow = require('/screens/MainWindow').MainWindow;
utm.navController = new NavigationController(utm);

utm.activityIndicatorStyle;
if (utm.iPhone || utm.iPad){
  
	  utm.activityIndicator = Ti.UI.createActivityIndicator({
		color : utm.color_org,
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 18,
			fontWeight : 'bold'
		},
		style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
		height : 'auto',
		width : 'auto'
	});
	
} else {
 	//Android handled in NavigationController.js
}

//open initial window
utm.Login = require('screens/login');
utm.loginView = new utm.Login(utm);
utm.navController.open(utm.loginView );
utm.currentOpenWindow=utm.loginView;

utm.setEnvModePrefix= function (env){
	utm.envModePrefix =env;
	if (env==='local') { 
		
		//Local Developer ID if you have .Net projects local
		//utm.serviceUrl = 'http://192.168.244.194/api/v1/';
		//utm.webUrl ='http://192.168.244.194'; 
		
		
		//utm.webUrl ='http://209.240.110.5'; 	//NEW PROD
		//utm.serviceUrl = 'https://209.240.110.5/api/v1/';	
		
		utm.serviceUrl = 'https://dev.youthisme.com/api/v1/';
		utm.webUrl = 'https://dev.youthisme.com';
	}else if(env==='dev' || env === 'test'){
		utm.serviceUrl = 'https://'+env +'.youthisme.com/api/v1/';
		utm.webUrl = 'https://'+env +'.youthisme.com';
	}else if(env === 'prod'){
		utm.serviceUrl = 'https://prod.youthisme.com/api/v1/';
		utm.webUrl ='https://www.youthisme.com';
	}	
	utm.log('env='+env);
	utm.log('utm.seviceUrl='+utm.serviceUrl);
	utm.loginView.setWebUrl(utm.webUrl );
};

appInit();


//utm.mainWindow.add(utm.navGroup);
//utm.mainWindow.open();

//############### Require in Modules for app ###############
utm.LandingScreen = require('screens/landing');
utm.landingView = new utm.LandingScreen(utm);

//utm.MessageScreen = require('screens/Messages');
//utm.messageWindow = new utm.MessageScreen(utm);

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

utm.SplashView = require('screens/Splash');
utm.splashView = new utm.SplashView(utm);

function appInit(){	
	
//	analytics.start(10,true);
	
	if (Ti.Platform.model === 'Simulator' || Ti.Platform.model ===  'google_sdk') { 
		utm.setEnvModePrefix("dev");
		utm.validatesSecureCertificate=false;
	}else{
		utm.setEnvModePrefix("prod");
		utm.validatesSecureCertificate=true;
	}	
	
	utm.loginView.setVersionLabel();

}


//############### Application Event Handlers ###############

Ti.App.addEventListener('app:loginSuccess', handleLoginSuccess);
function handleLoginSuccess(event) {
	var msg = 'Login Success';
	//TODO rework as callback...
	//Ti.App.removeEventListener('app:loginSuccess', handleLoginSuccess);
//utm.User.userProfile.
	utm.loggedIn = true;
	var d = new Date();
	var n = d.getTime();
	utm.activityActive = n;
	
			
	if(utm.User)
		utm.User.MyHorts =[];

	utm.User = event.userData;
	utm.AuthToken = event.userData.UserProfile.AuthToken;
	utm.twitterConsumerKey = event.userData.TwitterInfo.TwitterConsumerKey;
	utm.twitterConsumerSecret = event.userData.TwitterInfo.TwitterConsumerSecret;
	//Product list is supplied as part of login return query form products table
	utm.products = event.userData.AppleInAppProducts;
	//Example  ['com.youthisme.20for99', 'com.youthisme.500for1999'];
	//analytics.trackPageview('/login');
	
	utm.User.MyHorts = event.userData.MyHorts;
	if(utm.User.MyHorts.length ===0 ){
		utm.enableSendMessageButton=false;
		utm.recordAnalytics('login failed', utm.User.UserProfile.UserName );
		var dialog = Ti.UI.createAlertDialog({
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
	
	isSubscriptionValid(utm.User.UserProfile.SubscriptionEnds);
	Ti.App.fireEvent('App:startTransactionListener');
	showLandingView();
}

Ti.App.addEventListener('app:showLandingView', showLandingView);
function showLandingView() {		
	utm.currentOpenWindow=utm.landingView;
	utm.navController.open(utm.landingView);
}

Ti.App.addEventListener('app:showMessages', showMessageWindow);
function showMessageWindow() {
	utm.MessageScreen = require('screens/Messages');
	utm.messageWindow = new utm.MessageScreen(utm);
	utm.currentOpenWindow=utm.messageWindow;
	utm.navController.open(utm.messageWindow);
	utm.messageWindow.showMessageWindow();
	utm.recordAnalytics('show messages', '' );
}

Ti.App.addEventListener('app:showChooseMyHortWindow', showChooseMyHortWindow);
function showChooseMyHortWindow() {
	Ti.App.fireEvent('app:populateMyHortPicker');
	//Re #237 moved to ChooseMyHort.js
	//utm.navController.open(utm.chooseMyHortView);	
	utm.recordAnalytics('Start Send Message', '' );
}

Ti.App.addEventListener('app:showMyAccountWindow', showMyAccountWindow);
function showMyAccountWindow() {
	utm.currentOpenWindow=utm.myAccountWindow;
	utm.navController.open(utm.myAccountWindow);
	utm.recordAnalytics('Show Account Window', '' );
}

Ti.App.addEventListener('app:showMyHortWindow', showMyHortWindow);
function showMyHortWindow() {
	utm.currentOpenWindow=utm.myHortView;
	utm.navController.open(utm.myHortView);
	utm.recordAnalytics('Show MyHort Window', '' );
}

Ti.App.addEventListener('app:myHortChoosen', setMyHort);
function setMyHort(e) {
	utm.log('setMyHort() fired myHortId=' + e.myHortId);
	utm.targetMyHortID = e.myHortId;
	utm.currentOpenWindow=utm.chooseContactsView;
	utm.navController.open(utm.chooseContactsView);
	if(e.direct && !utm.Android) utm.chooseContactsView.setBackButtonTitle(L('back')); 

	//Fire event to trigger call to get contacts
	//Ti.App.fireEvent('app:getContacts');
}

Ti.App.addEventListener('app:contactsChoosen', setContactsChoosen);
function setContactsChoosen(e) {
	utm.log('setContactsChoosen() fired sentToContactList=' + e.sentToContactList);
	utm.sentToContactList = e.sentToContactList;

	utm.currentOpenWindow=utm.writeMessageView;
	utm.navController.open(utm.writeMessageView);

}

Ti.App.addEventListener('app:showWriteMessageView', showWriteMessageView);
function showWriteMessageView(e) {
	utm.log('showWriteMessageView() fired' );
	utm.writeMessageView.setMode(e.mode);
	utm.writeMessageView.setMessageData(e.messageData);
	
	//originalMessageId:_messageData.Id, replyTo:_messageData.FromUserId
	utm.currentOpenWindow=utm.writeMessageView;
	utm.navController.open(utm.writeMessageView);	
}

Ti.App.addEventListener('app:showPreview', showPreview);
function showPreview(e) {
	utm.log('showPreview() fired message=' + e.messageText);
	utm.originalTextMessage = e.messageText;
	
	utm.previewMessageView.setMode(e.mode);
	utm.previewMessageView.setMessageData(e.messageData);
	
	utm.navController.open(utm.previewMessageView);
	Ti.App.fireEvent('app:getMessagePreview', {
		messageText : e.messageText
	});
}

Ti.App.addEventListener('app:showMessagesAfterSend', showMessagesAfterSend);
function showMessagesAfterSend() {
	utm.log('showMessagesAfterSend() fired');
	
	if(utm.MessageDetailWindow !=undefined ){
		utm.navController.close(utm.messageDetailWindow,{animated:false}); 
		utm.MessageDetailWindow=null;
	}
	if(utm.messageWindow  !=undefined ){
		utm.navController.close(utm.messageWindow ,{animated:false}); 
		utm.messageWindow =null;
	}	
		
	if(utm.chooseContactsView != undefined){
		utm.chooseContactsView.restForm();
		utm.navController.close(utm.chooseContactsView,{animated:false});	
	}
	
	if(utm.chooseMyHortView !=undefined){
		//utm.chooseMyHortView.restForm();
		utm.navController.close(utm.chooseMyHortView,{animated:false});
	}	
		
	if(utm.writeMessageView !=undefined){
		utm.writeMessageView.restForm();
		utm.navController.close(utm.writeMessageView,{animated:false});
	}	
	
	if(utm.previewMessageView != undefined){
		utm.navController.close(utm.previewMessageView,{animated:false});
	}
	
	showLandingView();			
}

Ti.App.addEventListener('app:showMessagesAfterReply', showMessagesAfterReply);
function showMessagesAfterReply() {
	utm.log('showMessagesAfterReply() fired');
	
	if(utm.MessageDetailWindow !=undefined ){
		utm.navController.close(utm.messageDetailWindow,{animated:false}); 
		utm.MessageDetailWindow=null;
	}
			
	if(utm.writeMessageView !=undefined){
		utm.writeMessageView.restForm();
		utm.navController.close(utm.writeMessageView,{animated:false});
	}	
	
	if(utm.previewMessageView != undefined){
		utm.navController.close(utm.previewMessageView,{animated:false});
	}

}





Ti.App.addEventListener('app:logout', showLoginView);
function showLoginView() {
	
	if(utm.loggedIn){
		callLogoutService();
		utm.loggedIn=false;
	}	
	utm.User =null;
		
	closeAllScreens(false);
	//utm.navController.open(utm.loginView);	
	//#421 - Ti App - Screen Blank on force login
	//Due to internal IOS issue causing NavController is closing a proxy. Delaying this close call 
	// we now have a 1 second timer that is used to bring the login screen to front/open
	// else the screen goes blank 
	setTimer(1, 'delayShowLoginView');
	
}

Ti.App.addEventListener("delayShowLoginView", function() {
	utm.navController.open(utm.loginView);	
});



function isAllowedSendMessage(){	
	if(!utm.User) return;
	


	
	if( utm.User.UserProfile.MessagesRemaining > 0){
		return true;
	}else{
		return false;
	}
}

function showLoginScreenLockView() {	
	//TODO figure out how to NOT have to close all the windows to open the login window
	//Maybe a model popup 100% x 100%
	utm.loggedIn = false;
	//closeAllScreens(false);
	//utm.navController.open(utm.loginView);	
	showLoginView();
}

//Left Nav Buttons

utm.logoutButton = Ti.UI.createButton({
	title : L('logout')
});

utm.logoutButton.addEventListener('click', function() {
	Ti.App.fireEvent("app:logout", {});
	//utm.landingView.hide();
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



utm.logoutReq = Ti.Network.createHTTPClient({
	validatesSecureCertificate:utm.validatesSecureCertificate 
	,timeout:utm.netTimeout,
	onload : function() {
		var response = eval('('+this.responseText+')');
		utm.log('Logout Service Returned');
		if (this.status != 200) {
			utm.log('Logout Error');
			messageArea.test = "Logout error";
		}
	},
	onerror : function(e) {
		//utm.handleError(e,this.status,this.responseText); 
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



utm.setActivityIndicator =function (_curWindow, _message) {
	
	if(utm.iPhone || utm.iPad ){
		if (_message != '') {
			utm.activityIndicator.show();
		} else {
			utm.activityIndicator.hide();
		}
		utm.activityIndicator.setMessage(_message);
	}else{

		if(_curWindow==null) return;
		 var isActivityIndicatorFound=false;
		 var children = _curWindow.children;
		 
		 for( i=0; i< children.length; i++ ){
			var obj = children[i];
		 	
		 	if ( isProgressIndicator(obj)){
		 		isActivityIndicatorFound=true;
		 		obj.setMessage(_message);
		 		if (_message != '') {
					obj.show();
				} else {
					obj.hide();
				}
		 	}
		 }
	}
};

function isProgressIndicator(input) {
    return Object.prototype.toString.call(input) === '[object ProgressIndicator]';
}

 // Function to test if device is iOS 7 or later
function isiOS7Plus() {
	// iOS-specific test
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);

		// Can only test this support on a 3.2+ device
		if (major >= 7)
		{
			return true;
		}
	}
	return false;
};

utm.iOS7 = isiOS7Plus();

Ti.Network.addEventListener('change', function(e) {
	utm.log('Network Status Changed:' + e.online);
	utm.log('Network Status Changed:' + Titanium.Network.networkType);
	utm.networkIsOnline = e.online;
	
	if( e.online){
		utm.setActivityIndicator(utm.currentOpenWindow , '');
	}else{
		utm.setActivityIndicator(utm.currentOpenWindow , 'No Internet Connection Available');// TODO come up with a way to display more text - UTM Application requires an Internet Connection');		
	}
		
	Ti.App.fireEvent("app:networkChange", {
		online : e.online
	});
});

function checkNetworkOnInit(){
	if ( !Titanium.Network.online ){
		utm.setActivityIndicator(utm.currentOpenWindow , 'No Internet Connection Available');// TODO come up with a way to display more text - UTM Application requires an Internet Connection');		
	}else{
		utm.setActivityIndicator(utm.currentOpenWindow , '');
	}
	
}


function closeAllScreens(leaveLanding){
	
	
	try{
		//Close any open window in the opposite order opened - on slow devices you can sometime see them close
		if(!leaveLanding)
			if(utm.landingView != undefined){utm.navController.close(utm.landingView,{animated:false});	}
	
		
		if(utm.MessageDetailWindow !=undefined ){
			utm.navController.close(utm.messageDetailWindow,{animated:false});
			utm.MessageDetailWindow=null;
		}
	
		
		if(utm.messageWindow  !=undefined ){
			utm.navController.close(utm.messageWindow ,{animated:false});
			utm.messageWindow =null; 
		}	
		
		if(utm.chooseMyHortView !=undefined){utm.navController.close(utm.chooseMyHortView,{animated:false});}	
		if(utm.chooseContactsView != undefined){utm.navController.close(utm.chooseContactsView,{animated:false});}
		if(utm.writeMessageView !=undefined){utm.writeMessageView.restForm();utm.navController.close(utm.writeMessageView,{animated:false});}	
		if(utm.previewMessageView != undefined){utm.navController.close(utm.previewMessageView,{animated:false});}	
	
	
		if(utm.myAccountWindow != undefined){	utm.navController.close(utm.myAccountWindow,{animated:false});}	
		if(utm.setPinWindow != undefined){	utm.navController.close(utm.setPinWindow,{animated:false});}	
		if(utm.myHortView != undefined){utm.navController.close(utm.myHortView,{animated:false});}
		if(utm.myHortDetailWindow != undefined){utm.navController.close(utm.myHortDetailWindow,{animated:false});}
		//RE ##421 - Ti App - Screen Blank on force login - some odd reason on close an error occures only in trace window only in DeBug mode
		//close( ? "Invalid type passed to function. expected": TiWindowProxy, was: KrollCallback
		//Added Try Catch fixes this issue
		
		if(utm.MemberDetailsWindow != undefined){utm.navController.close(utm.MemberDetailsWindow,{animated:false});}

		if(utm.myHortInviteWindow != undefined){utm.navController.close(utm.myHortInviteWindow,{animated:false});}
		if(utm.myHortMembersWindow != undefined){utm.navController.close(utm.myHortMembersWindow,{animated:false});}
		if(utm.myHortPendingWindow != undefined){utm.navController.close(utm.myHortPendingWindow,{animated:false});}

	
		if(utm.signupView != undefined){utm.navController.close(utm.signupView,{animated:false});	}
		if(utm.subscribeInfoView != undefined){
			utm.navController.close(utm.subscribeInfoView,{animated:false});
			utm.subscribeInfoView=null;
		}	
		
		if(utm.splashView != undefined){	utm.splashView.close(),{animated:false}}		
		
		//#421 - Ti App - Screen Blank on force login  - added loginView to help fix this issue
		if(utm.loginView != undefined){	utm.loginView.close(),{animated:false}}		
	}catch(e) {}
	
}

utm.handleError = function (e,status,responseText) {	
	utm.setActivityIndicator(utm.currentOpenWindow , '');
	var err = JSON.parse(responseText);
	var message = 'Error Unknown';
	
	if (status == 403) {
		message = 'Your session is no longer valid - please log back in.';		
	//	closeAllScreens(false);	
		showLoginView();	
	} else if (err  != 'undefined' & err !=null ) {
		message = err.Message;	
 	} else if (e.error != 'undefined' & e.error.indexOf('timed out') > 0) {
 		//"Error Domain=ASIHTTPRequestErrorDomain Code=2 "The request timed out" UserInfo=0xb2b10e0 {NSLocalizedDescription=The request timed out}"
		message = 'Your connection may be slow - please retry.';	
 	} else {
 		if (e.error != undefined || err.Message != undefined) {
 			message = 'Error:';
 			message += e.error != undefined ? e.error : err.Message;
 		
			if ( message.indexOf("ASIHTTPRequestErrorDomain Code=1") !== 0 ) {
				message = "Your network has had an error - please try again.";	
			}
 		}
 	}
 	
 	alert(message);         
};

Ti.App.addEventListener('app:signup', function(){
	utm.SignupView = require('screens/SignUp');
	utm.signupView = new utm.SignupView(utm);
	utm.currentOpenWindow=utm.signupView;
	utm.navController.open(utm.signupView);
});

Ti.App.addEventListener("paused", function(e){
	utm.log('-------  APP Paused ------');
	appPauseTime= new Date();
	utm.log('-------  APP Paused appPauseTime='+appPauseTime.valueOf());
});




//IF the app is left for more then one minute force login
Ti.App.addEventListener("resumed", function(e){
	utm.splashView.close();	
	//RE #391 - Stop Screenshot when App Looses Focus - close the splash screen
	utm.log(' **********************  -------  APP resumed ------ **********************    ');
		
	if(!utm.loggedIn) return;
	if(utm.inSubscriptionMode) return; 
	
	var curDate = new Date();
	var curMil = curDate.valueOf() ;
	var pauseMil = utm.appPauseTime.valueOf();
	var diff = curMil - pauseMil;
	
	if( diff  > utm.screenLockTime){
			utm.log('-------  APP resumed  FORCE LOGIN');
			
			//if(utm.iPhone || utm.iPad ){
				var pass = keychain.getPasswordForService('utm', 'lockscreen');
				if(pass == null){
					showLoginScreenLockView();
				}else{
					showPinLockScreen(pass);		
				}
				
			//}else if(utm.Android){
			//	showLoginScreenLockView();
			//}
				
	}else{
		utm.log('-------  APP resumed  NO FORCE LOGIN');
	}		
});

//if(utm.iPhone || utm.iPad ){
	function showPinLockScreen(_pass){
		
		if(_pass == null || utm.isInPinLock){
			return;	
		}
		 utm.isInPinLock=true;
		//if(unlockWindow == null){
			unlockWindow = unpinLockScreen.loadWindow({
			// main properties for the module
				configLockScreen: { // main properties for the module
					passCode: _pass, // set the passcode (string)
					attempts: 0, // zero for infinite attempts and no timeout (int)
					timeOut: 5000, // time out in miliseconds after amount of incorrect attempts. Only when attempts is bigger then zero (int)
					timeOutMultiplier: 2, // after each set of attempts the time out is multiplied with this property (int)
					vibrateOnIncorrect: true, // vibrate phone on incorrect passcode input (bool)				
				},
					// properties for the messageBox
				messageBox: {
					text: 'Enter Unlock Code',
					textCorrect: 'Unlock Code Accepted',
					textIncorrect: 'Wrong Unlock Code',
					textColorCorrect: '#ffffff',
					textColorIncorrect: '#ffffff',
					vibrateOnIncorrect: true,
					borderColor: '#ffffff',
					backgroundColor: '#F66F00'				
				},
				correct: function() {  	
					var d = new Date();
					var n = d.getTime();
					utm.activityActive = n;
					utm.isInPinLock=false;			      	
			    }
			});	
		
	}
//}

//RE #391 - Stop Screenshot when App Looses Focus - put up the splash screen
 Ti.App.addEventListener('pause', function(e){
	
	if(!utm.inSubscriptionMode || !utm.showSplashScreenOnPause) {
		utm.splashView.open();
	}
	//Note: Splash is closed in resumed event
});




function getDateTimeFormat(dateSent){
	var sent =  moment(dateSent);
	var hours = sent.fromNow();
	var now = moment();

	diff = now.diff(sent, 'days'); // 1
			
	if(diff > 0){
		return sent.format("M/D/YY");
	}else{
		var sToSubtract = 0;
		
		if(now.milliseconds() << sent.milliseconds())
		{
			var sToSubtract = 30;
		}
		
		return  formattedDateSent = sent.subtract('seconds', sToSubtract).fromNow();
	}
}

Titanium.App.addEventListener('close', function(e){
	//analytics.stop();
});


utm.recordError = function (message) {
	utm.log('Error:' + message);
};


utm.recordAnalytics = function (theEvent,theData){
	//	category, action, label, value
	//TODO Replace Google analytics.trackEvent('Usage',theEvent,'Lbl1',theData );	
};

function setTimer(timetowait,context) {
	mt=0;
	mtimer = setInterval(function() {
	    	mt++;
	    if(mt==timetowait) {
			clearInterval(mtimer);
	 		Ti.App.fireEvent(context);
		}
	 
	},1000);
};

function isSubscriptionValid(subscriptionEnds) {
	if (subscriptionEnds !== null) {
		var d = subscriptionEnds;
		var theYear = d.split('-')[0];
		var theMonth = d.split('-')[1];
		var theDay = d.split('-')[2].split('T')[0];
		var theHour = d.split('-')[2].split('T')[1].split(':')[0];
		var theMinute = d.split(':')[1];
		var theSecond = d.split(':')[2].split('.')[0];
		var theMilli = d.split('.')[1];
		var expiresUtmDT = new Date(theYear, theMonth-1, theDay, theHour, theMinute, theSecond, theMilli);
		var deviceDT = new Date();
		var deviceUtmDT = new Date(deviceDT.getFullYear(), deviceDT.getMonth(), deviceDT.getDate(), deviceDT.getHours(), deviceDT.getMinutes(), 0, 0);
		
		if (expiresUtmDT < deviceUtmDT && utm.User.UserProfile.HasSubscription) {
			// expired subscription
			utm.User.UserProfile.SubscriptionEnds = null;
			utm.User.UserProfile.MessagesRemaining = 0;
			return false;
		} else {
			// valid subscription
			return true;
		}
	} else {
		// no subscription
		return false;
	}
}


//After everything is loaded check if device is online.
checkNetworkOnInit();





//	App.js is wicked long already and the StoreKit functionality has to be in the root context.  I'm just making
//	an include to isolate it a little and make it easier to maintain. - TV


if(utm.iPhone || utm.iPad ){
	Ti.include('storekit.js');
}

<<<<<<< HEAD
*/


//SOASTA TOUCHTEST CODE
//Un-comment this code block as well as 2 locations in tiapp.xml to make application "TouchTestable"

//SOASTA TOUCHTEST CODE Block 1 of 1.  Uncomment this 1 block of code in this module and 4 blocks in tiapp.xml


/*
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad')
{
  var touchTestModule = undefined;
  try
  {
    touchTestModule = require("com.soasta.touchtest");
  }
  catch (tt_exception)
  {
    Ti.API.error("com.soasta.touchest module is required");
  }

  var cloudTestURL = Ti.App.getArguments().url;
  if (cloudTestURL != null)
  {
    // The URL will be null if we don't launch through TouchTest.
    touchTestModule && touchTestModule.initTouchTest(cloudTestURL);
  }

  Ti.App.addEventListener('resumed',function(e)
  {
    // Hook the resumed from background
    var cloudTestURL = Ti.App.getArguments().url;
    if (cloudTestURL != null)
    {
      touchTestModule && touchTestModule.initTouchTest(cloudTestURL);
    }
  });
}
*/