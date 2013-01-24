var WriteMessage_window =function() {

	var replyMode=false;
	var messageData=false;
	
	var writeMessageView = Titanium.UI.createWindow({
	   width:'auto'
	   ,title:'Write Message'
	   ,height:'auto'
	   ,layout:'vertical'
	   ,backgroundColor:utm.backgroundColor
	   ,barColor:utm.barColor
	});		
	
	var toLabel = Ti.UI.createLabel({
		text:utm.sentToContactListString,
		width:'auto',
		height:30,
		textAlign:'left'
	});
	writeMessageView.add(toLabel);
	
	var yourMessageLabel = Ti.UI.createLabel({
		text:L('send_your_message'),
		width:'auto',
		height:'auto',
		textAlign:'left'
	});
	writeMessageView.add(yourMessageLabel);
	
	var textArea = Ti.UI.createTextArea({
	  borderWidth: 2,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color:utm.textFieldColor,
	  hintText:L('send_start_your_message_here'),
	  suppressReturn:false,
	  textAlign: 'left',
	  top: 5,
	  width: utm.SCREEN_WIDTH-10, height : utm.SCREEN_HEIGHT-(utm.SCREEN_HEIGHT/1.2)
	}); //todo get the screen width so we can make this wider if possible
	writeMessageView.add(textArea);
	
	
	var previewButton = Ti.UI.createButton({
		title:L('send_preview_your_message'),
		top:20,
		width:'auto',
		height:30,
		enabled :false
	});	
	writeMessageView.add(previewButton);
	
	textArea.addEventListener('change',function(){
		if(textArea.value.length >0)
		{	
			previewButton.enabled =true;
		}else{
			log('disable it');
			previewButton.enabled =false;
		}
	})
	
	previewButton.addEventListener('click',function()
	{	textArea.blur();	
		Ti.App.fireEvent("app:showPreview", {
	        messageText: textArea.value,
	        mode:replyMode ? 'reply':'newMessage',
	        messageData:messageData
	    });	
	});
	
	Ti.App.addEventListener('app:contactsChoosen',setContactsChoosen);
	function setContactsChoosen(e){			
		log('PreviewMessage setContactsChoosen() fired sentToContactList='+e.sentToContactList);
		
		sentToContactListString='To: ';
		
		for (var x=0;x<e.sentToContactList.length;x++)
		{
			sentToContactListString+= e.sentToContactList[x].nickName +',';	
		}
		//previewMessageView.sentToContactListString=utm.sentToContactListString;
		sentToContactListString=sentToContactListString.slice(0, - 1);
		toLabel.text=sentToContactListString;
		toLabel.width='100%';	
	}
	
	writeMessageView.restForm=function(){		
		textArea.value='';
		replyMode=false;
	}
	
	writeMessageView.setMode=function(_theMode){
		if(_theMode ==='reply')
			replyMode=true;
		else
			replyMode=false;	
	}
	
	writeMessageView.setMessageData=function(_messageData){
		messageData=_messageData;
		toLabel.text ='Reply to: '+  messageData.FromUserName;
	}
	
	Ti.App.addEventListener('app:showChooseMyHortWindow', showChooseMyHortWindow);
	function showChooseMyHortWindow() {
		//Clear out the types message when user presses the Send Message button
		textArea.value='';		
	}
	
	
	return writeMessageView;
	
	
}
module.exports = WriteMessage_window;
