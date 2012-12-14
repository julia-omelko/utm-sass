var WriteMessage_window =function() {

	var writeMessageView = Titanium.UI.createView({
	   width:'auto',
	   height:'auto',
	   layout:'vertical',
	   visible:false
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
		height:30,
		textAlign:'left'
	});
	writeMessageView.add(yourMessageLabel);
	
	var textArea = Ti.UI.createTextArea({
	  borderWidth: 2,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color: '#888',
	  hintText:L('send_start_your_message_here'),
	  textAlign: 'left',
	  top: 10,
	  width: utm.SCREEN_WIDTH-10, height : 'auto'
	}); //todo get the screen width so we can make this wider if possible
	writeMessageView.add(textArea);
	
	
	var previewButton = Ti.UI.createButton({
		title:L('send_preview_your_message'),
		top:34,
		width:'auto',
		height:30,
		enabled :false
	});	
	writeMessageView.add(previewButton);
	
	textArea.addEventListener('change',function(){
		log('xxxxxxxxxxx '+textArea.value.length);
		if(textArea.value.length >0)
		{	log('enable it');
			previewButton.enabled =true;
		}else{
			log('disable it');
			previewButton.enabled =false;
		}
	})
	
	previewButton.addEventListener('click',function()
	{	textArea.blur();	
		Ti.App.fireEvent("app:showPreview", {
	        messageText: textArea.value
	    });	
	     textArea.value='';
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
	
	
	return writeMessageView;
	
	
}
module.exports = WriteMessage_window;
