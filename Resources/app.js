//utm is the js namespace for this app
var utm = {};
utm.loggedIn = false;
utm.serviceUrl = 'http://dev.youthisme.com/api/v1/';
utm.color = '#007EAD';
utm.appVersion = 'version 0.18T Alpha';
utm.netTimeout=3000;
utm.sentToContactListString = '';
utm.networkIsOnline = false;
var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;
utm.SCREEN_WIDTH = (pWidth > pHeight) ? pHeight : pWidth;
utm.SCREEN_HEIGHT = (pWidth > pHeight) ? pWidth : pHeight;

Ti.UI.setBackgroundColor('#fff');

utm.Login = require('screens/login');
utm.loginView = new utm.Login();

utm.mainWindow = Ti.UI.createWindow();

utm.navGroup = Ti.UI.iPhone.createNavigationGroup({
	window : utm.loginView
});

utm.mainWindow.add(utm.navGroup);
utm.mainWindow.barColor = '#007EAD';
utm.mainWindow.open();

//############### Require in Modules for app ###############
utm.LandingScreen = require('screens/landing');
utm.landingView = new utm.LandingScreen();

utm.MessageScreen = require('screens/Messages');
utm.messageWindow = new utm.MessageScreen();

utm.ChooseMyHortView = require('/ui/handheld/ChooseMyHort');
utm.chooseMyHortView = new utm.ChooseMyHortView();

utm.ChooseContactsView = require('/ui/handheld/ChooseContacts');
utm.chooseContactsView = new utm.ChooseContactsView();

utm.WriteMessageView = require('/ui/handheld/WriteMessage');
utm.writeMessageView = new utm.WriteMessageView();

utm.PreviewMessageView = require('/ui/handheld/PreviewMessage');
utm.previewMessageView = new utm.PreviewMessageView();

//############### Application Event Handlers ###############

Ti.App.addEventListener('app:loginSuccess', handleLoginSuccess);
function handleLoginSuccess(event) {
	var msg = 'Login Success';
	//TODO rework as callback...
	//Ti.App.removeEventListener('app:loginSuccess', handleLoginSuccess);

	utm.loggedIn = true;
	utm.User = event.userData;
	utm.AuthToken = event.userData.UserProfile.AuthToken;
	utm.myHorts = event.userData.MyHorts;
	showLandingView();
}

Ti.App.addEventListener('app:showLandingView', showLandingView);
function showLandingView() {		
	utm.navGroup.open(utm.landingView);
}

Ti.App.addEventListener('app:showMessages', showMessageWindow);
function showMessageWindow() {
	utm.navGroup.open(utm.messageWindow);
}

Ti.App.addEventListener('app:showChooseMyHortWindow', showChooseMyHortWindow);
function showChooseMyHortWindow() {
	utm.navGroup.open(utm.chooseMyHortView);
	Ti.App.fireEvent('app:populateMyHortPicker');
}

Ti.App.addEventListener('app:myHortChoosen', setMyHort);
function setMyHort(e) {
	log('setMyHort() fired myHortId=' + e.myHortId);
	utm.targetMyHortID = e.myHortId
	utm.navGroup.open(utm.chooseContactsView);

	//Fire event to trigger call to get contacts
	Ti.App.fireEvent('app:getContacts');
}

Ti.App.addEventListener('app:contactsChoosen', setContactsChoosen);
function setContactsChoosen(e) {
	log('setContactsChoosen() fired sentToContactList=' + e.sentToContactList);
	utm.sentToContactList = e.sentToContactList;
	/*utm.sentToContactListString='To:';

	 for (var x=0;x<utm.sentToContactList.length;x++)
	 {
	 utm.sentToContactListString+= utm.sentToContactList[x] +',';
	 }
	 previewMessageView.sentToContactListString=utm.sentToContactListString;
	 utm.sentToContactListString=utm.sentToContactListString.slice(0, - 1);
	 */

	utm.navGroup.open(utm.writeMessageView);

}

Ti.App.addEventListener('app:showWriteMessageView', showWriteMessageView);
function showWriteMessageView(e) {
	log('showWriteMessageView() fired' );
	utm.writeMessageView.setMode(e.mode)
	utm.writeMessageView.setMessageData(e.messageData);
	
	//originalMessageId:_messageData.Id, replyTo:_messageData.FromUserId
	utm.navGroup.open(utm.writeMessageView);	
}

Ti.App.addEventListener('app:showPreview', showPreview);
function showPreview(e) {
	log('showPreview() fired message=' + e.messageText);
	utm.originalTextMessage = e.messageText;
	
	utm.previewMessageView.setMode(e.mode)
	utm.previewMessageView.setMessageData(e.messageData);
	
	utm.navGroup.open(utm.previewMessageView)
	Ti.App.fireEvent('app:getMessagePreview', {
		messageText : e.messageText
	});
}

Ti.App.addEventListener('app:showMessagesAfterSend', showMessagesAfterSend);
function showMessagesAfterSend() {
	log('showMessagesAfterSend() fired');
	
	if(utm.writeMessageView !=undefined){
		utm.writeMessageView.restForm();
		utm.navGroup.close(utm.writeMessageView,{animated:false});
	}	
		
	if(utm.chooseContactsView != undefined){
		utm.chooseContactsView.restForm();
		utm.navGroup.close(utm.chooseContactsView,{animated:false});	
	}
	
	if(utm.chooseMyHortView !=undefined){
		//utm.chooseMyHortView.restForm();
		utm.navGroup.close(utm.chooseMyHortView,{animated:false});
	}
	
	if(utm.MessageDetailWindow !=undefined ){
		utm.navGroup.close(utm.messageDetailWindow,{animated:false}); 
	}
	if(utm.messageWindow  !=undefined ){
		utm.navGroup.close(utm.messageWindow ,{animated:false}); 
	}
	
	if(utm.writeMessageView !=undefined){
		utm.writeMessageView.restForm();
		utm.navGroup.close(utm.writeMessageView,{animated:false});
	}	
	
	if(utm.previewMessageView != undefined){
		utm.navGroup.close(utm.previewMessageView);		
	}
	//showLandingView();
}

Ti.App.addEventListener('app:logout', showLoginView);
function showLoginView() {
	//utm.navGroup.leftNavButton = utm.emptyView;
	utm.navGroup.open(utm.loginView);
	callLogoutService();
}

//Left Nav Buttons

utm.logoutButton = Ti.UI.createButton({
	title : L('logout')
});
//utm.logoutButton.hide();
utm.logoutButton.addEventListener('click', function() {
	Ti.App.fireEvent("app:logout", {});
	utm.landingView.hide();
	//utm.mainWindow.leftNavButton = utm.emptyView;
});

utm.backToLandingScreenButton = Ti.UI.createButton({
	title : L('button_back')
});
utm.backToLandingScreenButton.addEventListener('click', function() {
	log('backToLandingScreenButton fired');
	Ti.App.fireEvent("app:showLandingView", {});
});

utm.backToChooseMyHortScreenButton = Ti.UI.createButton({
	title : 'Choose Myhort'
});
utm.backToChooseMyHortScreenButton.addEventListener('click', function() {
	log('backToChooseMyHortScreenButton fired');
	Ti.App.fireEvent("app:showChooseMyHortWindow", {});
});
utm.backToChooseContactsScreenButton = Ti.UI.createButton({
	title : 'Choose Contacts'
});
utm.backToChooseContactsScreenButton.addEventListener('click', function() {
	log('backToChooseContactsScreenButton fired');
	Ti.App.fireEvent("app:myHortChoosen", {});
});

//Used to remove the leftNavButton
utm.emptyView = Ti.UI.createView({});

utm.logoutReq = Ti.Network.createHTTPClient({
	timeout:utm.netTimeout,
	onload : function() {
		var json = this.responseData;
		var response = JSON.parse(json);
		log('Logout Service Returned');
		if (this.status != 200) {
			log('Logout Error');
			messageArea.test = "Logout error";
		}
	},
	onerror : function(e) {
		handleError(e);   
	}
	,timeout:utm.netTimeout
});

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

function callLogoutService(){
	//call logout service
	utm.logoutReq.open("POST", utm.serviceUrl + "Logout");
	utm.logoutReq.setRequestHeader('Authorization-Token', utm.AuthToken);
	utm.logoutReq.send();
	Titanium.Analytics.featureEvent('user.logged_out');	
}

function setActivityIndicator(_message) {
	if (_message != '') {
		utm.activityIndicator.show();
	} else {
		utm.activityIndicator.hide();
	}
	utm.activityIndicator.setMessage(_message);
}


Ti.Network.addEventListener('change', function(e) {
	log('Network Status Changed:' + e.online);
	log('Network Status Changed:' + Titanium.Network.networkType);
	utm.networkIsOnline = e.online;
	Ti.App.fireEvent("app:networkChange", {
		online : e.online
	});
});


function closeAllScreens(){
	if(utm.writeMessageView !=undefined){
		utm.navGroup.close(utm.writeMessageView,{animated:false});
	}	
		
	if(utm.chooseContactsView != undefined){
		utm.navGroup.close(utm.chooseContactsView,{animated:false});	
	}
	
	if(utm.chooseMyHortView !=undefined){
		utm.navGroup.close(utm.chooseMyHortView,{animated:false});
	}
	
	if(utm.MessageDetailWindow !=undefined ){
		utm.navGroup.close(utm.messageDetailWindow,{animated:false}); 
	}
	
	if(utm.messageWindow  !=undefined ){
		utm.navGroup.close(utm.messageWindow ,{animated:false}); 
	}
	
	if(utm.writeMessageView !=undefined){
		utm.writeMessageView.restForm();
		utm.navGroup.close(utm.writeMessageView,{animated:false});
	}	
	
	if(utm.previewMessageView != undefined){
		utm.navGroup.close(utm.previewMessageView);		
	}
	
	if(utm.landingView != undefined){
		utm.navGroup.close(utm.landingView);		
	}
	
}

function log(message) {
	Ti.API.info(message);
}

function handleError(e) {			
 	if(e.error.indexOf('timed out') > 0){
 		//"Error Domain=ASIHTTPRequestErrorDomain Code=2 "The request timed out" UserInfo=0xb2b10e0 {NSLocalizedDescription=The request timed out}"
 		//TODO improve to handle time vs an invalid session due to session timeout....
		alert('Your session has timed out you must log backin');
		setActivityIndicator('');
		closeAllScreens();
		showLoginView();	
 	}else{
		alert('Error:' + e.error);
 	}         
}

function recordError(message) {
	log('Error:' + message);

}

