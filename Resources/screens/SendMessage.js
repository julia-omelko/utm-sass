function sendMessage_window() {
	var win = Ti.UI.createWindow({backgroundColor:'#fff'}); //,visable:false
	utm.sentToContactList=[];
	utm.targetMyHortID=0;
	utm.originalTextMessage='';
	
	var messageArea = Ti.UI.createLabel({
	  color: '#900',
	  text: '',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  width: 'auto', height: 30
	});
	win.add(messageArea);
	
	var ChooseMyHortView = require('/ui/handheld/ChooseMyHort');
	var chooseMyHortView = new ChooseMyHortView();
	win.add(chooseMyHortView);
			
	var ChooseContactsView = require('/ui/handheld/ChooseContacts');
	var chooseContactsView = new ChooseContactsView();
	chooseContactsView.height=0;
	win.add(chooseContactsView);		

	var WriteMessageView = require('/ui/handheld/WriteMessage');
	var writeMessageView = new WriteMessageView();
	writeMessageView.height=0;
	win.add(writeMessageView);		
	
	var PreviewMessageView = require('/ui/handheld/PreviewMessage');
	var previewMessageView = new PreviewMessageView();
	previewMessageView.height=0;
	win.add(previewMessageView);	
	

	Ti.App.addEventListener('app:myHortChoosen',setMyHort);
	function setMyHort(e){			
			log('setMyHort() fired myHortId='+e.myHortId);
			utm.targetMyHortID=e.myHortId
			chooseMyHortView.hide();
			chooseMyHortView.height=0;
			chooseContactsView.show();
			chooseContactsView.height='auto';			
			//messageArea.text='MyHort Set:'+e.myHortId;
	} 
	
	Ti.App.addEventListener('app:contactsChoosen',setContactsChoosen);
	function setContactsChoosen(e){			
			log('setContactsChoosen() fired sentToContactList='+e.sentToContactList);
			utm.sentToContactList=e.sentToContactList;
			utm.sentToContactListString='';
			
			for (var x=0;x<utm.sentToContactList.length;x++)
			{
				utm.sentToContactListString+= utm.sentToContactList[x] +',';	
			}
			
			utm.sentToContactListString=utm.sentToContactListString.slice(0, - 1);
			
			showWriteMessageView();
	}
	
	Ti.App.addEventListener('app:showWriteMessageView',showWriteMessageView);
	function showWriteMessageView(){			
			log('showWriteMessageView() fired ');
			chooseContactsView.hide();
			writeMessageView.show();
			writeMessageView.height='auto';
	}  
	
	Ti.App.addEventListener('app:showPreview',showPreview);
	function showPreview(e){			
			log('showPreview() fired message='+e.messageText);
			//sentToContactList=e.sentToContactList;
			utm.originalTextMessage=e.messageText;
			chooseContactsView.hide();
			chooseContactsView.height=0;
			writeMessageView.hide();
			writeMessageView.height=0;
			previewMessageView.show();
			previewMessageView.height='auto';
	} 
	
	Ti.App.addEventListener('app:showChooseMyHortView',showChooseMyHortView);
	function showChooseMyHortView(e){			
			log('showChooseMyHortView() fired ');
			chooseContactsView.hide();
			chooseContactsView.height=0;
			writeMessageView.hide();
			writeMessageView.height=0;
			previewMessageView.hide();
			previewMessageView.height=0;
			chooseMyHortView.show();
			chooseMyHortView.height='auto';
	}
	

	Ti.App.addEventListener('app:showMessagesAfterSend',showMessageWindow);
	function showMessageWindow(){	
		log('showMessagesAfterSend()  222 fired ');
		chooseContactsView.hide();
		chooseContactsView.height=0;
		writeMessageView.hide();
		writeMessageView.height=0;
		previewMessageView.hide();
		previewMessageView.height=0;
		
		chooseMyHortView.show();
		chooseMyHortView.height='auto';
		
		
		Ti.App.fireEvent("app:showLandingView", {});
	
		
	} 
	
	
	return win;
};

module.exports = sendMessage_window;