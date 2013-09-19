var WriteMessage_window =function(utm) {

	var replyMode=false;
	var messageData=false;
	
	if(utm.iPhone || utm.iPad ){
		var writeMessageWindow = Titanium.UI.createWindow({
			layout:'vertical'
			,title:'Write Message'
			,backgroundColor:utm.backgroundColor
		   ,barColor:utm.barColor
		});
	}
	
	if(utm.Android){
		//create the base screen and hide the Android navbar
		var writeMessageWindow = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
	    });

 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text:'Write Message',
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
		
 		//add the navbar to the screen
		writeMessageWindow.add(my_navbar);
		
		//add activityIndicator to window
		writeMessageWindow.add(utm.activityIndicator)		
	}	

	var scrollableView = Ti.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'auto',
		layout:'vertical'
	});
	writeMessageWindow.add(scrollableView);
	
	var toLabel = Ti.UI.createLabel({
		text:utm.sentToContactListString,
		width:Ti.UI.SIZE,
		wordWrap:false,
		font: { fontSize:'20dp' },
		height:'30dp',
		color : '#000',
		textAlign:'left'
	});
	scrollableView.add(toLabel);
	
	var yourMessageLabel = Ti.UI.createLabel({
		text:L('send_your_message'),
		width:'auto',
		font: { fontSize:'20dp' },
		height:'auto',
		color : '#000',
		textAlign:'left'
	});
	scrollableView.add(yourMessageLabel);
	
	var textArea = Ti.UI.createTextArea({
	  borderWidth: 2, 
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color:  utm.textFieldColor,
	  font: {fontSize:'16dp'},
	  hintText:L('send_start_your_message_here'),
	  suppressReturn:false,
	  textAlign: 'left',
	  top: 5,
	  width: '90%',
	  height :  utm.iPad ? '60%' : 100
	}); 
	scrollableView.add(textArea);
	
	
	var previewButton = Ti.UI.createButton({
		title:L('send_preview_your_message'),
		top:20,
		width:'auto',
		font: { fontSize:'20dp' },
		enabled :false
	});	
	scrollableView.add(previewButton);
	
	textArea.addEventListener('change',function(){
		if(textArea.value.length >0)
		{	
			previewButton.enabled =true;
		}else{
			utm.log('disable it');
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
		utm.log('PreviewMessage setContactsChoosen() fired sentToContactList='+e.sentToContactList);
		
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
	
	writeMessageWindow.restForm=function(){		
		textArea.value='';
		replyMode=false;
		previewButton.enabled=false;
	}
	
	writeMessageWindow.setMode=function(_theMode){
		if(_theMode ==='reply')
			replyMode=true;
		else
			replyMode=false;	
	}
	
	writeMessageWindow.setMessageData=function(_messageData){
		messageData=_messageData;
		toLabel.text ='Reply to: '+  messageData.FromUserName;
	}
	
	Ti.App.addEventListener('app:showChooseMyHortWindow', showChooseMyHortWindow);
	function showChooseMyHortWindow() {
		//Clear out the types message when user presses the Send Message button
		textArea.value='';	
		previewButton.enabled=false;	
	}
	
	
	return writeMessageWindow;
	
	
}
module.exports = WriteMessage_window;
