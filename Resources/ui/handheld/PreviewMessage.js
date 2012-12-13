var PreviewMessage_window =function() {
	
	var curUtmText='';
	var curRjCrypt='';
	
	var TEXT=0;
	var EMAIL=1;
	var FACE_BOOK=2;
	var	TWITTER=3;
	
	var previewMessageView = Titanium.UI.createView({
	   width:'auto',
	   height:'auto',
	   layout:'vertical',
	   visible:false
	});	
	
	//-----------------TO  ----------------------
	var toLabel = Ti.UI.createLabel({
		text:'To:',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14, fontWeight:'bold'},
		height:'auto',
		textAlign:'left'
	});
		
	
	//---------------Original Message -------------------- 
	
	var yourOrgMessageLabel = Ti.UI.createLabel({
		text:'Your Original Message:',
		font: {fontSize:14, fontWeight:'bold'},
		width:utm.SCREEN_WIDTH-10,
		top:10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(yourOrgMessageLabel);

	var yourOrgMessageValue = Ti.UI.createLabel({
		text:'',
		font: {fontSize:12},
		color: '#888',
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(yourOrgMessageValue);
	
	//------------ Preview of Encrypted --------------------------- 
	
	var encryptedLabel = Ti.UI.createLabel({
		text:'Preview of how your message is encrypted:',
		width:utm.SCREEN_WIDTH-10,
		top:10,
		font: {fontSize:14, fontWeight:'bold'},
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(encryptedLabel);
	var encryptedValue = Ti.UI.createLabel({
		text:'',
		font: {fontSize:12},
		color: '#888',
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(encryptedValue);
	
	
	
	//------------- Customize Your Message ------------------ 
		
	var customMessageLabel = Ti.UI.createLabel({
		text:'Customize the UTM Message:',
		font: {fontSize:14, fontWeight:'bold'},
		width:utm.SCREEN_WIDTH-10,
		top:10,
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
	  top: 10,
	  width: utm.SCREEN_WIDTH-10, height : 'auto'
	}); //todo get the screen width so we can make this wider if possible
	previewMessageView.add(customUtmMessage);
	
	//------------- Send Type Button Bar------------------ 	
	var sendTypesButtonObjects = [
		{title:'Text', width:110, enabled:true},
		{title:'Email', width:110, enabled:true},
		{title:'FaceBook', width:110, enabled:true},
		{title:'Twitter', width:110, enabled:true}
	];
	var sendTypesButtonBar = Titanium.UI.iOS.createTabbedBar({
		labels:sendTypesButtonObjects,
		backgroundColor:utm.color,
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		width:60,
		top:3,
		left:0
	});
	
	
	//previewMessageView.add(sendTypesButtonBar);
	
	//------------- Send Button ------------------ 
	var sendButton = Ti.UI.createButton({
		title:'Send Message Now',
		top:34,
		width:'auto',
		height:30
	});	
	previewMessageView.add(sendButton);
	
	sendButton.addEventListener('click',function()
	{	
		var copiedToUsers=[];

		for(v=0; v < utm.sentToContactList.length; v++){
			copiedToUsers.push(utm.sentToContactList[v].userId);	
			log('Preparing to send message to '+utm.sentToContactList[v].userId);		
		}
		
		// customUtmMessage.blur();			
		var params = {
			MyHortId: utm.targetMyHortID,
			PlainText: yourOrgMessageValue.text,
			UtmText:customUtmMessage.value,
			DeleteOnRead:'false',
			RjCrypt:curRjCrypt,
			MessageType:'sms,email',
			FromUserId:utm.User.UserProfile.UserId,
			ToUserId:utm.User.UserProfile.UserId,
			CopiedUsers: ''+copiedToUsers.join(",")					
		};
		setActivityIndicator('Sending ...');
		sendMessageReq.open("POST",utm.serviceUrl+"SendMessage");	
		sendMessageReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		sendMessageReq.send(params);	
	});
	
	
	var getMessagesPreviewReq = Ti.Network.createHTTPClient({
		onload : function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			log('PreviewMessages Service Returned');
			if(this.status ==200){
				customUtmMessage.value=response.UtmText;				
				yourOrgMessageValue.text = response.PlainText;
				curRjCrypt=response.RjCrypt;
				encryptedValue.text=curRjCrypt;
				//toValue.text=utm.utm.sentToContactList;
		
			}else{		
				recordError(response.Message+ ' ExceptionMessag:'+response.ExceptionMessage);
			}		
			
		},
		onError:function(e){
         	recordError('Preview Message Service Error:'+e.error);			
		}
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
				var opts = {options: ['Ok'], title: 'Your Message was sent'};
				var dialog = Ti.UI.createOptionDialog(opts).show();
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
		onError:function(e){
			setActivityIndicator('');
         	recordError('Send Message Service Error:'+e.error);			
		}
	});	
	
	Ti.App.addEventListener('app:showMessagesAfterSend',showMessageWindow);
	function showMessageWindow(){	
		log('showMessagesAfterSend()  333 fired ');
	} 
	
	
	Ti.App.addEventListener('app:showPreview',getMessagePreview);
	function getMessagePreview(msg){
		log('THE MyHort is utm.targetMyHortID='+utm.targetMyHortID);
		
		var params = {
			MyHortId: utm.targetMyHortID,
			PlainText: msg.messageText						
		};
		
		getMessagesPreviewReq.open("POST",utm.serviceUrl+"EncryptMessage");	
		getMessagesPreviewReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMessagesPreviewReq.send(params);		
	} 
	
	function resetScreen(){
		toValue.text='';
		yourOrgMessageValue.text='';
		encryptedValue.text='';
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
				
				//Enable disable buttons
				sendTypesButtonObjects[TEXT].enabled=e.sentToContactList[x].userData.HasMobile;
				sendTypesButtonObjects[EMAIL].enabled=e.sentToContactList[x].userData.HasEmail;
				sendTypesButtonObjects[FACE_BOOK].enabled=e.sentToContactList[x].userData.HasFaceBook;
				sendTypesButtonObjects[TWITTER].enabled=e.sentToContactList[x].userData.HasTwitter;
				
				//sendTypesButtonObjects[0].enabled = (sendTypesButtonObjects[0].enabled === false)?true:false;
			}

			
			//previewMessageView.sentToContactListString=utm.sentToContactListString;
			sentToContactListString=sentToContactListString.slice(0, - 1);
			toLabel.text=sentToContactListString;
			toLabel.width='100%';	
			
	}
	
	function setButtonBarEnabled(enable){
		sendTypesButtonObjects[TEXT].enabled=enable;
		sendTypesButtonObjects[EMAIL].enabled=enable;
		sendTypesButtonObjects[FACE_BOOK].enabled=enable;
		sendTypesButtonObjects[TWITTER].enabled=enable;
	}

	
	
	
	return previewMessageView;
	
	
}
module.exports = PreviewMessage_window;
