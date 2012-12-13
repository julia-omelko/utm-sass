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
		text:'Your Message',
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
	  hintText:'Start your message here...',
	  textAlign: 'left',
	  top: 10,
	  width: utm.SCREEN_WIDTH-10, height : 'auto'
	}); //todo get the screen width so we can make this wider if possible
	writeMessageView.add(textArea);
	
	
	var previewButton = Ti.UI.createButton({
		title:'Preview Your Message...',
		top:34,
		width:'auto',
		height:30
	});	
	writeMessageView.add(previewButton);
	
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
