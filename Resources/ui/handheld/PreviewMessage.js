var PreviewMessage_window =function() {
	
	var curUtmText='';
	var curRjCrypt='';
	
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
	previewMessageView.add(toLabel);
	var toValue = Ti.UI.createLabel({
		text:utm.sentToContactListString,
		font: {fontSize:12},
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(toValue);
	
	
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
	  color: '#888',
	  font: {fontSize:12},
	  textAlign: 'left',
	  top: 10,
	  width: utm.SCREEN_WIDTH-10, height : 'auto'
	}); //todo get the screen width so we can make this wider if possible
	previewMessageView.add(customUtmMessage);
	
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
		customUtmMessage.blur();			
		var params = {
			MyHortId: utm.targetMyHortID,
			PlainText: yourOrgMessageValue.text,
			UtmText:customUtmMessage.value,
			DeleteOnRead:'false',
			RjCrypt:curRjCrypt,
			MessageType:'sms',
			FromUserId:1004,
			ToUserId:1004					
		};
		
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
				log('Preview Error');
				messageArea.test="error";
				setMessageArea("Error in Service");
			}		
			
		},
		onError:function(e){
			log('Preview Message Service Error:'+e.error);
         	alert('Preview Message Service Error:'+e.error);			
		}
	});	
	
	var sendMessageReq = Ti.Network.createHTTPClient({
		//{timeout:25000,
		onload : function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);

			if(this.status ==200){
				log('Send Successful');
				
				//pop a dialog and on close go back to landing screen
				var opts = {options: ['Ok'], title: 'Your Message was sent'};
				var dialog = Ti.UI.createOptionDialog(opts).show();
				
				dialog.addEventListener('click', function(e){
					resetScreen();
					Ti.App.fireEvent("app:showMessages", {});
				});
				
		
			}else{
				log('Send Error');
				messageArea.test="error";
				setMessageArea("Error in Service");
			}		
			
		},
		onError:function(e){
			log('Send Message Service Error:'+e.error);
         	alert('Send Message Service Error:'+e.error);			
		}
	});	
	
	
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
	

	
	
	
	return previewMessageView;
	
	
}
module.exports = PreviewMessage_window;
