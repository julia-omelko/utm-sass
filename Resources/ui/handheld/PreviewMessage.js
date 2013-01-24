var PreviewMessage_window =function() {
	
	var curUtmText='';
	var curRjCrypt='';
	
	var TEXT=0;
	var EMAIL=1;
	var FACE_BOOK=2;
	var TWITTER=3;
	
	var replyMode=false;
	var messageData=false;
	
	
	var previewMessageView = Titanium.UI.createWindow({
	   width:'auto'
	   ,height:'auto'
	   ,layout:'vertical'
	   ,backgroundColor:utm.backgroundColor
	   ,barColor:utm.barColor
	});	
	
	//---------------Original Message -------------------- 	
	var yourOrgMessageLabel = Ti.UI.createLabel({
		text:L('send_your_original_message')+':',
		font: {fontSize:14, fontWeight:'bold'},
		width:utm.SCREEN_WIDTH-10,
		top:2,
		textAlign:'left'
	});
	previewMessageView.add(yourOrgMessageLabel);

	var yourOrgMessageValue = Ti.UI.createTextArea({
		value:'',
		font: {fontSize:12},
		color:utm.textFieldColor,
		editable:false,
		width:utm.SCREEN_WIDTH-10,
		height : '20%',  //utm.SCREEN_HEIGHT-(utm.SCREEN_HEIGHT/1.2)
		textAlign:'left'
	});
	previewMessageView.add(yourOrgMessageValue);
	
	//------------ Preview of Encrypted --------------------------- 
	
	var encryptedLabel = Ti.UI.createLabel({
		text:L('send_preview_how_encrypted')+':',
		width:utm.SCREEN_WIDTH-10,
		top:5,
		font: {fontSize:14, fontWeight:'bold'},
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(encryptedLabel);
	var encryptedValue = Ti.UI.createTextArea({
		text:'',
		font: {fontSize:12},
		color:utm.textFieldColor,
		editable:false,
		width:utm.SCREEN_WIDTH-10,
		height : '20%',  //utm.SCREEN_HEIGHT-(utm.SCREEN_HEIGHT/1.2)
		textAlign:'left'
	});
	previewMessageView.add(encryptedValue);
	
	
	
	//------------- Customize Your Message ------------------ 
		
	var customMessageLabel = Ti.UI.createLabel({
		text:L('send_customize_message')+':',
		font: {fontSize:14, fontWeight:'bold'},
		width:utm.SCREEN_WIDTH-10,
		top:5,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(customMessageLabel);	
	
	var customUtmMessage = Ti.UI.createTextArea({
	  borderWidth: 2,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color:utm.textFieldColor,
	  font: {fontSize:12},
	  textAlign: 'left',
	  top: 5,
	  width: utm.SCREEN_WIDTH-10,
	  height : '20%',  //utm.SCREEN_HEIGHT-(utm.SCREEN_HEIGHT/1.2)
	}); //todo get the screen width so we can make this wider if possible
	previewMessageView.add(customUtmMessage);
	
	
	customUtmMessage.addEventListener('click',function()
	{//fold up to give more room to edit
		yourOrgMessageValue.height=12;
		encryptedLabel.height=0;
		encryptedValue.height=0;	
	});
	
	//------------- Send Type Button Bar------------------ 	
	
	
	
	var hView = Ti.UI.createView({layout:'horizontal', height:50, width:200});
	previewMessageView.add(hView);
	
	var CheckButton = require('ui/common/checkButton');
	var smsButton = new CheckButton('sms');
	hView.add(smsButton);	
	
	var CheckButton = require('ui/common/checkButton');
	var emailButton = new CheckButton('email');
	hView.add(emailButton);	

	var CheckButton = require('ui/common/checkButton');
	var twitterButton = new CheckButton('twitter');
	hView.add(twitterButton);	
	
	var CheckButton = require('ui/common/checkButton');
	var facebookButton = new CheckButton('facebook');
	hView.add(facebookButton);	
	
	var sendSms=false;

	
	//------------- Send Button ------------------ 
	var sendButton = Ti.UI.createButton({
		title:L('send_UTM_message_now'),
		top:10,
		width:'auto',
		height:30
	});	
	previewMessageView.add(sendButton);
	
	sendButton.addEventListener('click',function()
	{	
		var copiedToUsers=[];
		var messageType=getMessageSendTypes();
		
		yourOrgMessageValue.height='20%';
		encryptedLabel.height='auto';
		encryptedValue.height='20%';	
		
		if(messageType==''){
			alert('You must choose at least one of the message types by clicking on the icon.');
			return;
		}
		
		sendButton.enabled=false;
		if(replyMode){
			//Reply to a message
			var params = {
				MyHortId: messageData.MyHortId,
				PlainText: yourOrgMessageValue.value,
				UtmText:customUtmMessage.value,
				DeleteOnRead:'false',
				RjCrypt:curRjCrypt,
				MessageType:messageType,
				FromUserId:utm.User.UserProfile.UserId,
				ToUserId:messageData.FromUserId,
				CopiedUsers:messageData.FromUserId,
				ParrentMessageId:messageData.Id	
			};
			
			
		}else{
		
			//Sending a new message
			for(v=0; v < utm.sentToContactList.length; v++){
				copiedToUsers.push(utm.sentToContactList[v].userId);	
				log('Preparing to send message to '+utm.sentToContactList[v].userId);		
			}
				
			var params = {
				MyHortId: utm.targetMyHortID,
				PlainText: yourOrgMessageValue.value,
				UtmText:customUtmMessage.value,
				DeleteOnRead:'false',
				RjCrypt:curRjCrypt,
				MessageType:messageType,
				FromUserId:utm.User.UserProfile.UserId,
				ToUserId:utm.User.UserProfile.UserId,
				CopiedUsers:copiedToUsers	
			};
		}
		
		log(JSON.stringify(params));
		setActivityIndicator('Sending ...');
		sendMessageReq.open("POST",utm.serviceUrl+"SendMessage");
		sendMessageReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		sendMessageReq.setRequestHeader('Authorization-Token', utm.AuthToken);
			
		sendMessageReq.send(JSON.stringify(params));//NOTE: Had to add stringify here else Ti will escape the Array [] and no messages go out.	
		Titanium.Analytics.featureEvent('user.sent_message');
	});
	
	
	var getMessagesPreviewReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate 
		,onload : function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			sendButton.enabled=true;
			log('PreviewMessages Service Returned');
			if(this.status ==200){
				customUtmMessage.value=response.UtmText;				
				yourOrgMessageValue.value = response.PlainText;
				curRjCrypt=response.RjCrypt;
				encryptedValue.value=curRjCrypt;		
			}else{		
				recordError(response.Message+ ' ExceptionMessag:'+response.ExceptionMessage);
			}		
			
		},
		onerror:function(e){
			sendButton.enabled=true;
         	handleError(e,this.status,this.responseText); 			
		}
		,timeout:utm.netTimeout
	});	
	
	var sendMessageReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate 
		,onload : function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			setActivityIndicator('');
			if(this.status ==200 && response.Status =='Success'){
				log('Send Successful');
				
				
				Ti.App.fireEvent("app:showMessagesAfterSend", {}); 
				resetScreen();
				
				Titanium.Analytics.featureEvent('user.sent_message');
		
			}else if(this.status ==200 && response.Status =='Warning'){
				log('Send Successful with warning');
				
				Ti.App.fireEvent("app:showMessagesAfterSend", {});
				resetScreen();
				
				Titanium.Analytics.featureEvent('user.sent_message');
			}
			
			
			else{
				//Error:UserId: 1007 cannot accept Email messages
				setActivityIndicator('');
				recordError(response.Message+ ' ExceptionMessag:'+response.ExceptionMessage);
			}		
			
		},
		onerror:function(e){
			setActivityIndicator('');
         		handleError(e,this.status,this.responseText); 		
		}
		,timeout:utm.netTimeout
	});	
	
	
	Ti.App.addEventListener('app:getMessagePreview',getMessagePreview);
	function getMessagePreview(msg){
		sendButton.enabled=false;
		if(replyMode){
			var params = {
				MyHortId: messageData.MyHortId,
				PlainText: msg.messageText
			}	
		}else{	
			var params = {
				MyHortId: utm.targetMyHortID,
				PlainText: msg.messageText						
			};
		}
		getMessagesPreviewReq.open("POST",utm.serviceUrl+"EncryptMessage");	
		getMessagesPreviewReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMessagesPreviewReq.send(params);		
	} 
	
	function resetScreen(){
		yourOrgMessageValue.value='';
		encryptedValue.value='';
		customUtmMessage.value('');
	}
	
	Ti.App.addEventListener('app:contactsChoosen',setContactsChoosen);
	function setContactsChoosen(e){			
		log('PreviewMessage setContactsChoosen() fired sentToContactList='+e.sentToContactList);
		
		sentToContactListString='To: ';
		setButtonBarEnabled(false);

		for (var x=0;x<e.sentToContactList.length;x++)
		{
			sentToContactListString+= e.sentToContactList[x].nickName +',';	
			
			//Enable buttons if any one of the users do not have this feature.
			if(e.sentToContactList[x].userData.HasMobile){
				smsButton.setEnabled(true);
				smsButton.setChecked(true);//default at least sms ...Could save pref of the user for next time...
			}
			
			if(e.sentToContactList[x].userData.HasEmail)
				emailButton.setEnabled(true);
				
			if(e.sentToContactList[x].userData.HasTwitter)
				twitterButton.setEnabled(true);
			//if(utm.User.UserProfile.HasFaceBook
				
				
			//if(e.sentToContactList[x].userData.HasFaceBook)
			//if(utm.User.UserProfile.HasFaceBook
				facebookButton.setEnabled(false);	//todo once we have facebook working	
			
		}
	}
	
	function setButtonBarEnabled(_enable){		
		smsButton.setEnabled(_enable);
		emailButton.setEnabled(_enable);
		twitterButton.setEnabled(_enable);
		facebookButton.setEnabled(_enable);
	}
	
	function getMessageSendTypes(){
		//Set up what type of messages to be send out
		// based on selected mesage types by the user
		
		var messageType='';
		
		if(smsButton.isChecked())messageType +='sms,';
		if(emailButton.isChecked())messageType +='email,';
		if(twitterButton.isChecked())messageType +='twitter,';
		if(facebookButton.isChecked())messageType +='facebook,';
		
		//remove last comma
		messageType=messageType.slice(0, -1);
		
		return messageType;
	}
	
	previewMessageView.setMode=function(_theMode){
		if(_theMode ==='reply')
			replyMode=true;
		else
			replyMode=false;	
	}
	
	previewMessageView.setMessageData=function(_messageData){
		messageData=_messageData;
	}
	
	return previewMessageView;
	
	
}
module.exports = PreviewMessage_window;
