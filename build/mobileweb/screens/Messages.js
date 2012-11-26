function message_window() {
	var win = Ti.UI.createWindow({backgroundColor:'#fff',layout:'vertical'});
	
	var messageArea = Ti.UI.createLabel({
	  color: '#900',
	  text: '',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  width: 'auto', height: 30
	});
	win.add(messageArea);
	
	// create table view data object
	var data = [
		{title:'Row 1', hasChild:true, color:'red', selectedColor:'#fff'},
		{title:'Row 2', hasDetail:true, color:'green', selectedColor:'#fff'},
		{title:'Row 3', hasCheck:true, color:'blue', selectedColor:'#fff'},
		{title:'Row 4', color:'orange', selectedColor:'#fff'}
		
	
	];
	
	// create table view
	for (var i = 0; i < data.length; i++ ) { data[i].color = '#000'; data[i].font = {fontWeight:'bold'} };
	var tableview = Titanium.UI.createTableView({
		data:data
	});
	
	function showClickEventInfo(e, islongclick) {
		// event data
		var index = e.index;
		var section = e.section;
		var row = e.row;
		var rowdata = e.rowData;
		Ti.API.info('detail ' + e.detail);
		var msg = 'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata;
		if (islongclick) {
			msg = "LONGCLICK " + msg;
		}
		Titanium.UI.createAlertDialog({title:'Table View',message:msg}).show();
	}
	
	// create table view event listener
	tableview.addEventListener('click', function(e)
	{
		showClickEventInfo(e);
	});
	tableview.addEventListener('longclick', function(e)
	{
		showClickEventInfo(e, true);
	});
	
	// add table view to the window
	win.add(tableview);	
	

	var getMessagesReq = Ti.Network.createHTTPClient();	
	getMessagesReq.open("GET",utm.serviceUrl+"Messages");
	getMessagesReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	

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
	
	
	return win;
};

module.exports = message_window;