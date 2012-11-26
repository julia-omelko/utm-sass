function sendMessage_window() {
	var win = Ti.UI.createWindow({backgroundColor:'#fff'}); //,visable:false
	var sentToContactList=[];
	
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
	win.add(chooseContactsView);		

	var WriteMessageView = require('/ui/handheld/WriteMessage');
	var writeMessageView = new WriteMessageView();
	win.add(writeMessageView);		
	

	Ti.App.addEventListener('app:myHortChoosen',setMyHort);
	function setMyHort(e){			
			log('setMyHort() fired myHortId='+e.myHortId);

			chooseMyHortView.hide();
			chooseContactsView.show();
			chooseContactsView.height='auto';
			
			messageArea.text='MyHort Set:'+e.myHortId;			
		
	} 
	
	Ti.App.addEventListener('app:contactsChoosen',setContactsChoosen);
	function setContactsChoosen(e){			
			log('setMyHort() fired myHortId='+e.sentToContactList);
			sentToContactList=e.sentToContactList;
			
			chooseContactsView.hide();
			writeMessageView.show();
			
			//messageArea.text='MyHort Set:'+e.myHortId;			
		
	} 
	
	

	
/*
	
	var data = [];
	
	for (var i=0;i<utm.myHorts.length;i++)
	{
		var row = Ti.UI.createTableViewRow();
		
		var l = Ti.UI.createLabel({
			left:5,
			font:{fontSize:20, fontWeight:'bold'},
			color:'#000',
			text:utm.myHorts[i].FriendlyName
		});
		
		//FriendlyName
		//MyHortId
		row.add(l);
		data[i] = row;
	}
	
	// create table view
	var tableview = Titanium.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
	});
	
	
	win.add(tableview);
	*/
	
	
	
	
	/*
	
	
	myHortPicker.setSelectedRow(0,1,true);
	
	
	
	var writeYourMessageButton = Ti.UI.createButton({
		title:'Write Your Message',
		top:34,
		width:120,
		height:30
	});
	win.add(writeYourMessageButton);
	
	writeYourMessageButton.addEventListener('click',function()
	{
		// column, row, animated (optional)
		myHortPicker.setSelectedRow(0,3,true);
	});
	
	*/
	
/*
	var getMessagesReq = Ti.Network.createHTTPClient();	
	getMessagesReq.open("GET",utm.serviceUrl+"Messages");
	getMessagesReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	
	//getMessagesReq.setRequestHeader("Content-Type", "text/html; charset=utf-8");

	getMessagesReq.send();
	
	getMessagesReq.onload = function()
	{
		var json = this.responseData;
		var response = JSON.parse(json);
		
		if(this.status ==200){
				
			messageArea.setText("data returned");
		}else if(this.status == 400){
			
			messageArea.setText("Error:"+this.responseText);
			
		}else{
			messageArea.test="error";
			
		}		
		
	};
	*/
	
	return win;
};

module.exports = sendMessage_window;