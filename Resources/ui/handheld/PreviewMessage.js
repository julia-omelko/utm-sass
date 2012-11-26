var PreviewMessage_window =function() {
	
	var previewMessageView = Titanium.UI.createView({
	   width:'auto',
	   height:'auto',
	   layout:'vertical',
	   visible:false
	});	
	
	var toLabel = Ti.UI.createLabel({
		text:'To:',
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(toLabel);
	
	var yourOrgMessageLabel = Ti.UI.createLabel({
		text:'Your Original Message:',
		font: {fontSize:20, fontWeight:'bold'},
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(yourOrgMessageLabel);

	var yourOrgMessageValue = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(yourOrgMessageValue);
	
	
	//--------------------------------------- 
	
	
	var previewEnryptionLabel = Ti.UI.createLabel({
		text:'Preview of how your message is encrypted:',
		font: {fontSize:20, fontWeight:'bold'},
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(previewEnryptionLabel);
	
	var previewEnryptionValue = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(previewEnryptionValue);
	
	
	//--------------------------------------- 
		
	var customMessageLabel = Ti.UI.createLabel({
		text:'Customize the UTM Message:',
		font: {fontSize:20, fontWeight:'bold'},
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(customMessageLabel);	
	
	var customMessageValue = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		height:'auto',
		textAlign:'left'
	});
	previewMessageView.add(customMessageValue);
	
	
	//--------------------------------------- 
	
	var textArea = Ti.UI.createTextArea({
	  borderWidth: 2,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color: '#888',
	  font: {fontSize:20, fontWeight:'bold'},
	  textAlign: 'left',
	  top: 10,
	  width: utm.SCREEN_WIDTH-10, height : 'auto'
	}); //todo get the screen width so we can make this wider if possible
	previewMessageView.add(textArea);
	
	/*
	var previewButton = Ti.UI.createButton({
		title:'Preview Your Message...',
		top:34,
		width:'auto',
		height:30
	});	
	previewMessageView.add(previewButton);
	
	previewButton.addEventListener('click',function()
	{		
		Ti.App.fireEvent("app:showPreview", {
	        messageText: textArea.value;
	    });	
	});
	*/
	
	var getMessagesPreviewReq = Ti.Network.createHTTPClient({
		//{timeout:25000,
		onload : function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			log('Login Service Returned');
			if(this.status ==200){
				//username.value('Login Successfull');
				//Ti.App.fireEvent("app:loginSuccess", {
			   //     userData: response
			   // });	
			}else{
				log('Login Error');
				messageArea.test="error";
				setMessageArea("Error in Service");
			}		
			
		},
		onError:function(e){
			log('Preview Message Service Error:'+e.error);
         	alert('Preview Message Service Error:'+e.error);			
		}
	});	
	
	Ti.App.addEventListener('app:showPreview',getMessagePreview);
	function getMessagePreview(msg){
		log('THE MyHort is utm.targetMyHortID='+utm.targetMyHortID);
		var params = {
			MyHortId: utm.targetMyHortID,
			message: msg						
		};
		
		getMessagesPreviewReq.open("POST",utm.serviceUrl+"Messages");	
		getMessagesPreviewReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMessagesPreviewReq.send();		
	} 
	
	

	
	
	
	return previewMessageView;
	
	
}
module.exports = PreviewMessage_window;
