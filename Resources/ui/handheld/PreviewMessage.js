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
	   width:'auto',
	   height:'auto',
	   layout:'vertical'
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
		color: '#888',
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
		color: '#888',
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
	  color: '#000',
	  font: {fontSize:12},
	  textAlign: 'left',
	  top: 5,
	  width: utm.SCREEN_WIDTH-10,
	  height : '20%',  //utm.SCREEN_HEIGHT-(utm.SCREEN_HEIGHT/1.2)
	}); //todo get the screen width so we can make this wider if possible
	previewMessageView.add(customUtmMessage);
	
	//------------- Send Type Button Bar------------------ 	
	
	
	
	var vView = Ti.UI.createView({layout:'horizontal', height:32, width:150});
	previewMessageView.add(vView);
	
	var smsButton = Ti.UI.createButton({		
		height:30, width:30,
		backgroundImage:'/images/sms.png',
		backgroundDisabledImage:'/images/sms_disabled.png',
		backgroundSelectedImage:'/images/sms_selected.png'			
	});		
	vView.add(smsButton);
	
	var emailButton = Ti.UI.createButton({		
		height:30, width:30,
		backgroundImage:'/images/email.png',
		backgroundDisabledImage:'/images/email_disabled.png',
		backgroundSelectedImage:'/images/email_selected.png'		
	});		
	vView.add(emailButton);
	
	
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
		
		if(replyMode){
			//Reply to a message
			var params = {
				MyHortId: messageData.MyHortId,
				PlainText: yourOrgMessageValue.value,
				UtmText:customUtmMessage.value,
				DeleteOnRead:'false',
				RjCrypt:curRjCrypt,
				MessageType:'twitter',
				//MessageType:'sms,email,twitter',
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
				MessageType:'sms,email',
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
		onload : function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			log('PreviewMessages Service Returned');
			if(this.status ==200){
				customUtmMessage.value=response.UtmText;				
				yourOrgMessageValue.value = response.PlainText;
				curRjCrypt=response.RjCrypt;
				encryptedValue.value=curRjCrypt;
				//toValue.text=utm.utm.sentToContactList;
		
			}else{		
				recordError(response.Message+ ' ExceptionMessag:'+response.ExceptionMessage);
			}		
			
		},
		onerror:function(e){
         	recordError('Preview Message Service Error:'+e.error);			
		}
		,timeout:utm.netTimeout
	});	
	
	var sendMessageReq = Ti.Network.createHTTPClient({
		//{timeout:25000,
		onload : function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			setActivityIndicator('');
			if(this.status ==200 && response.Status =='Success'){
				log('Send Successful');
				
				//pop a dialog and on close go back to landing screen
				var opts = {options: [L('send_ok_button')], title:L('send_our_message_was_sent')};
				//var dialog = Ti.UI.createOptionDialog(opts).show();
				Ti.App.fireEvent("app:showMessagesAfterSend", {});
				dialog.addEventListener('click', function(e){
					resetScreen();
					
				});
				Titanium.Analytics.featureEvent('user.sent_message');
		
			}else{
				setActivityIndicator('');
				recordError(response.Message+ ' ExceptionMessag:'+response.ExceptionMessage);
			}		
			
		},
		onerror:function(e){
			setActivityIndicator('');
         	recordError('Send Message Service Error:'+e.error);			
		}
		,timeout:utm.netTimeout
	});	
	
	
	Ti.App.addEventListener('app:getMessagePreview',getMessagePreview);
	function getMessagePreview(msg){
		
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
		toValue.text='';
		yourOrgMessageValue.value='';
		encryptedValue.value='';
		customUtmMessage.value('');
	}
	
	Ti.App.addEventListener('app:contactsChoosen',setContactsChoosen);
	function setContactsChoosen(e){			
		log('PreviewMessage setContactsChoosen() fired sentToContactList='+e.sentToContactList);
		
		sentToContactListString='To: ';
		setButtonBarEnabled(true);
		for (var x=0;x<e.sentToContactList.length;x++)
		{
			sentToContactListString+= e.sentToContactList[x].nickName +',';	
			
			//Disable buttons if any one of the users do not have this feature.
			if(!e.sentToContactList[x].userData.HasMobile)
				smsButton.enabled=false;
			
			if(!e.sentToContactList[x].userData.HasEmail)
				emailButton.enabled=false;
			/*
			if(!e.sentToContactList[x].userData.HasFaceBook)
				sendTypesButtonObjects[FACE_BOOK].enabled=false;
			
			if(e.sentToContactList[x].userData.HasTwitter)
				sendTypesButtonObjects[TWITTER].enabled=false;
			*/
		}
	}
	
	function setButtonBarEnabled(enable){
	/*	sendTypesButtonObjects[TEXT].enabled=enable;
		sendTypesButtonObjects[EMAIL].enabled=enable;
		sendTypesButtonObjects[FACE_BOOK].enabled=enable;
		sendTypesButtonObjects[TWITTER].enabled=enable;*/
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
