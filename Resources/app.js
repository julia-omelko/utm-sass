//utm is the js namespace for this app
var utm = {};
utm.loggedIn = false;
utm.serviceUrl = 'https://dev.youthisme.com/api/v1/';
utm.validatesSecureCertificate=false;
utm.color = '#F66F00';
utm.barColor = '#F66F00';
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


Ti.UI.setBackgroundColor('#fff');

utm.Login = require('screens/login');
utm.loginView = new utm.Login();

utm.mainWindow = Ti.UI.createWindow();

utm.navGroup = Ti.UI.iPhone.createNavigationGroup({
	window : utm.loginView
});

utm.mainWindow.add(utm.navGroup);
utm.mainWindow.open();

//############### Require in Modules for app ###############
utm.LandingScreen = require('screens/landing');
utm.landingView = new utm.LandingScreen();

utm.MessageScreen = require('screens/Messages');
utm.messageWindow = new utm.MessageScreen();

utm.MyAccountWindow = require('/ui/handheld/MyAccount');
utm.myAccountWindow = new utm.MyAccountWindow();

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
//utm.User.userProfile.
	utm.loggedIn = true;
	utm.User = event.userData;
	utm.AuthToken = event.userData.UserProfile.AuthToken;
	
	utm.myHorts = event.userData.MyHorts;
	if(utm.myHorts.length ===0 ){
		utm.enableSendMessageButton=false;
		var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
			    buttonNames: [L('ok_button')],
			    message: 'You have not setup any MyHorts to group the people you wish to communicate with, please create at least one MyHort',
			    title: 'No MyHorts Available'
			  });	//TODO add option to link to website to create MyHort
			  dialog.show();
	}else{
		utm.enableSendMessageButton=true;
	}
	
	showLandingView();
}

Ti.App.addEventListener('app:showLandingView', showLandingView);
function showLandingView() {		
	utm.landingView.setEnableSendMessageButton(utm.enableSendMessageButton);
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

Ti.App.addEventListener('app:showMyAccountWindow', showMyAccountWindow);
function showMyAccountWindow() {
	utm.navGroup.open(utm.myAccountWindow);
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
	closeAllScreens();
	utm.navGroup.open(utm.loginView);
	
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
		log('Logout Service Returned');
		if (this.status != 200) {
			log('Logout Error');
			messageArea.test = "Logout error";
		}
	},
	onerror : function(e) {
		//handleError(e,this.status,this.responseText); 
		//Note it logout fails its probable auth token does not exist and nothing we can do but record error
		recordError("Status="+this.status + "   Message:"+this.responseText);
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
	if(utm.myAccountWindow != undefined){
		utm.navGroup.close(utm.myAccountWindow);
	}
	
}

function handleError(e,status,responseText) {			
	setActivityIndicator('');
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

function recordError(message) {
	log('Error:' + message);
}

function log(message) {
	Ti.API.info(message);
}
