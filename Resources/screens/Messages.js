function message_window() {
	var win = Ti.UI.createWindow({backgroundColor:'#fff',visible:false, layout:'vertical' });
	
	var messageArea = Ti.UI.createLabel({
	  color: '#900',
	  text: '',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  width: 'auto', height: 0
	});
	win.add(messageArea);
	
	var tabBar = Titanium.UI.iOS.createTabbedBar({
	    labels:[L('messages_recieved'), L('messages_sent')],
	    backgroundColor:utm.color,
	    top:2,
	    index:0,
	    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	    height:35,
	    width:250
	});
	win.add(tabBar);
	
	tabBar.addEventListener('click', function(e){
		if(tabBar.index ==0){
			getMessages('rec');
		}else{
			getMessages('sent');
		}
	});
	
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
		getMessages('rec');
	} 
	
	Ti.App.addEventListener('app:backToMessageWindow',backToMessageWindow);
	function backToMessageWindow(){
		getMessages('rec');			
	} 
	
	function getMessages(mode){
		setActivityIndicator('Getting your messages...');
		utm.containerWindow.leftNavButton = utm.backButton;
		
		if(mode =='rec'){
			getMessagesReq.open("GET",utm.serviceUrl+"ReceivedMessages?$orderby=DateSent desc");	
		}else{
			getMessagesReq.open("GET",utm.serviceUrl+"SentMessages?$orderby=DateSent desc");
		}
			
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
		setActivityIndicator('');
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
			setActivityIndicator('');
			
		}else{
			messageArea.test="error";
			setActivityIndicator('');
			
		}
		/*
			
			
		//Add in Scrolling support
		var border = Ti.UI.createView({
			backgroundColor:"#576c89",
			height:2,
			bottom:0
		})
		 
		var tableHeader = Ti.UI.createView({
			backgroundColor:"#e2e7ed",
			width:320,
			height:60
		});
		tableHeader.add(border);
		
		tableView.headerPullView = tableHeader;
		
		var arrow = Ti.UI.createView({
			//backgroundImage:"../images/whiteArrow.png",
			width:23,
			height:60,
			bottom:10,
			left:20
		});
		 
		var statusLabel = Ti.UI.createLabel({
			text:"Pull to reload",
			left:55,
			width:200,
			bottom:30,
			height:"auto",
			color:"#576c89",
			textAlign:"center",
			font:{fontSize:13,fontWeight:"bold"},
			shadowColor:"#999",
			shadowOffset:{x:0,y:1}
		});
		 
		var lastUpdatedLabel = Ti.UI.createLabel({
			text:"Last Updated: "+formatDate(),
			left:55,
			width:200,
			bottom:15,
			height:"auto",
			color:"#576c89",
			textAlign:"center",
			font:{fontSize:12},
			shadowColor:"#999",
			shadowOffset:{x:0,y:1}
		});
		var actInd = Titanium.UI.createActivityIndicator({
			left:20,
			bottom:13,
			width:30,
			height:30
		});
		
		function formatDate()
		{
			var d = new Date;
			var datestr = d.getMonth()+'/'+d.getDate()+'/'+d.getFullYear();
			if (d.getHours()>=12)
			{
		           datestr+=' '+(d.getHours()==12 ? 
		              d.getHours() : d.getHours()-12)+':'+
		              d.getMinutes()+' PM';
			}
			else
			{
				datestr+=' '+date.getHours()+':'+date.getMinutes()+' AM';
			}
			return datestr;
		}
		
		//tableView.headerPullView = tableHeader;
		log('before add ev list');
		
		
		
		tableView.addEventListener('scroll',function(e)
		{	log('Scroll Started');
			var offset = e.contentOffset.y;
			if (offset <= -65.0 && !pulling)
			{
				var t = Ti.UI.create2DMatrix();
				t = t.rotate(-180);
				pulling = true;
				arrow.animate({transform:t,duration:180});
				statusLabel.text = "Release to refresh...";
			}
			else if (pulling && offset > -65.0 && offset < 0)
			{
				pulling = false;
				var t = Ti.UI.create2DMatrix();
				arrow.animate({transform:t,duration:180});
				statusLabel.text = "Pull down to refresh...";
			}
		});
		tableView.addEventListener('scrollEnd',function(e)
		{
			if (pulling && !reloading && e.contentOffset.y <= -65.0)
			{
				reloading = true;
				pulling = false;
				arrow.hide();
				actInd.show();
				statusLabel.text = "Reloading...";
				tableView.setContentInsets({top:60},{animated:true});
				arrow.transform=Ti.UI.create2DMatrix();
				beginReloading();
			}
		});
				
		var pulling = false;
		var reloading = false;
		 
		function beginReloading()
		{log('begin loading');
			// just mock out the reload
			setTimeout(endReloading,2000);
		}
		 
		function endReloading()
		{
			// // simulate loading 
			// for (var c=lastRow;c<lastRow+10;c++)
			// {
				// tableView.appendRow({title:"Row "+c});
			// }
			// lastRow += 10;
// 		 
		log('Scroll end');
			// when you're done, just reset
			tableView.setContentInsets({top:0},{animated:true});
			reloading = false;
			lastUpdatedLabel.text = "Last Updated: "+formatDate();
			statusLabel.text = "Pull down to refresh...";
			actInd.hide();
			arrow.show();
		}		
			
			*/	
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