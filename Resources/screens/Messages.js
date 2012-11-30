function message_window() {
	var win = Ti.UI.createWindow({backgroundColor:'#fff',visible:false });
	
	var messageArea = Ti.UI.createLabel({
	  color: '#900',
	  text: '',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  width: 'auto', height: 0
	});
	win.add(messageArea);
	
	
	// create table view
	var tableview = Titanium.UI.createTableView();
	tableview.addEventListener('click', function(e)
	{

		var messageData = e.rowData.messageData;
		
		//e.source.clickName
		utm.MessageDetailWindow = require('screens/MessageDetail');
		utm.messageDetailWindow =  new utm.MessageDetailWindow(messageData);
		utm.messageDetailWindow.title='Message';
		utm.messageDetailWindow.open();
		
		//utm.messageDetailWindowsetMessageData(messageData);
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
		
	// add table view to the window
	win.add(tableview);	
	
	
	Ti.App.addEventListener('app:showMessages',showMessageWindow);
	function showMessageWindow(){
		getMessages();
	} 
	
	Ti.App.addEventListener('app:backToMessageWindow',backToMessageWindow);
	function backToMessageWindow(){
		getMessages();			
	} 
	
	function getMessages(){
		utm.containerWindow.leftNavButton = utm.backButton;
		getMessagesReq.open("GET",utm.serviceUrl+"ReceivedMessages?$orderby=DateSent desc");	
		getMessagesReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMessagesReq.send();	
		
		if(utm.messageDetailWindow != undefined){
			utm.messageDetailWindow.close();
		}	
	}
		
	var getMessagesReq = Ti.Network.createHTTPClient({
		
		onError:function(e){
			log('Get Message Service Error:'+e.error);
         	alert('Get Message Service Error:'+e.error);			
		}
		
	});	
	
	getMessagesReq.onload = function()
	{
		/*if(!isJSON(this.responseData)){
			messageArea.test="Data service returned error:"+this.responseData;
			return;
		}*/
		
		
		var json = this.responseData;
		var response = JSON.parse(json);
		var tableData = [];
		
		if(this.status ==200){
				
			log("message data returned:"+response);
			
			for (var i=0;i<response.length;i++)
			{
			  var row = Ti.UI.createTableViewRow({ className: 'row', row:clickName = 'row', objName: 'row', touchEnabled: true, height: 55,hasChild:true, messageData: response[i]});
			  
			  
			  
			  var enabledWrapperView = Ti.UI.createView({
			  	layout:'vertical',
			    backgroundColor:'#fff',
			    objName: 'enabledWrapperView',
			    rowID: i, width: Ti.UI.FILL, height: '45'
			  });
			  
			  if(response[i].WasRead){
			  	var fromMessage = Ti.UI.createLabel({
				    backgroundColor:'#fff',
				    color: '#000',
				    font: {fontSize:14},
				    objName: 'fromMessage',
				    text: response[i].FromUserName,
				    touchEnabled: true,
				    left: 2,
				    width: '100%'
				  });			  	
			  }else{
			  	var fromMessage = Ti.UI.createLabel({
				    backgroundColor:'#fff',
				    color: '#000',
				    font: {fontSize:14, fontWeight:'bold'},
				    objName: 'fromMessage',
				    text: response[i].FromUserName,
				    touchEnabled: true,
				    left: 2,
				    width: '100%'
				  });			  	
			  }
			  
			   
			  enabledWrapperView.add(fromMessage);
			  
			  var utmMessage = Ti.UI.createLabel({
			    backgroundColor:'#fff',
			    color: '#000',
			    font: {fontSize:14},
			    objName: 'utmMessage',
			    text: response[i].UtmText,
			    touchEnabled: true,
			    top:2,
			    left: 2,
			    height:16,
			    width: '100%'
			  });
			  enabledWrapperView.add(utmMessage);
			  
			  row.add(enabledWrapperView);
			  tableData.push(row);
			}
			
			tableview.setData(tableData);			
						
		}else if(this.status == 400){
			
			messageArea.setText("Error:"+this.responseText);
			
		}else{
			messageArea.test="error";
			
		}	
	};
		
	return win;
};



function isJSON(data) {
    var isJson = false
    try {
        // this works with JSON string and JSON object, not sure about others
       var json = $.parseJSON(data);
       isJson = typeof json === 'object' ;
    } catch (ex) {
        log('data is not JSON:'+data);
    }
    return isJson;
}

module.exports = message_window;