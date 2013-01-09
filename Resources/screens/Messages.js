function message_window() {
	//Ti.include('lib/date.format.js');
	var moment = require('lib/moment');
	var navGroup=false;
	//utm.easyDateFormat = require('lib/date.format');
	
	var win = Ti.UI.createWindow({backgroundColor:'#fff',layout:'vertical', title:'Messages', backButtonTitle:L('button_back') });
	var curMode='recieved';
	
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
			curMode="recieved";
			getMessages('recieved');
		}else{
			curMode="sent";
			getMessages('sent');
		}
	});
	
	// create table view
	var tableview = Titanium.UI.createTableView({
		left:2
		,editable:true
		,allowsSelectionDuringEditing:true
	 });
	
	//Add Click to Details for drilldown
	tableview.addEventListener('click', function(e)
	{
		var messageData = e.rowData.messageData;
		utm.MessageDetailWindow = require('screens/MessageDetail');
		utm.messageDetailWindow =  new utm.MessageDetailWindow(messageData,curMode);
		utm.messageDetailWindow.title='Message';
		utm.navGroup.open(utm.messageDetailWindow);
	});
	
	//Add Swipe event to delete messages
	/*tableview.addEventListener('swipe', function(eventObject){
	 	
		deleteMessage(eventObject.row.messageData.Id,false);
	});*/
	
	// add delete event listener
	tableview.addEventListener('delete',function(e){
		var s = e.section;
		deleteMessage(e.rowData.Id,false)
	});
	
	function deleteMessage(messageId,isSuperDelete){
		log("About to delete message:"+messageId +'  isSuperDelete:'+isSuperDelete);
		deleteMessagesReq.open('delete',utm.serviceUrl+'Messages/DeleteMessage/'+messageId+'?isSuperDelete='+isSuperDelete);
		deleteMessagesReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		deleteMessagesReq.send()
	}
	
	//
	//  create edit/cancel buttons for nav bar
	//
	var edit = Titanium.UI.createButton({
		title:'Edit'
	});
	
	edit.addEventListener('click', function()
	{
		win.setRightNavButton(cancel);
		tableview.editing = true;
	});
	
	var cancel = Titanium.UI.createButton({
		title:L('cancel'),
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	cancel.addEventListener('click', function()
	{
		win.setRightNavButton(edit);
		tableview.editing = false;
	});
	
	win.setRightNavButton(edit);
	
	
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
		getMessages('recieved');
	} 
	
	Ti.App.addEventListener('app:backToMessageWindow',backToMessageWindow);
	function backToMessageWindow(){
		//Ti.App.fireEvent('app:showMessages');
		utm.navGroup.open(utm.messageWindow);
		getMessages(curMode);			
	} 
	
	Ti.App.addEventListener('app:refreshMessages',refreshMessages);
	function refreshMessages(){
		getMessages(curMode);			
	} 
	
	function getMessages(mode){
		
		setActivityIndicator('Getting your messages...');
		
		if(mode =='recieved'){
			getMessagesReq.open("GET",utm.serviceUrl+"ReceivedMessages?$orderby=DateSent desc");	
		}else{
			getMessagesReq.open("GET",utm.serviceUrl+"SentMessages?$orderby=DateSent desc");
		}
			
		getMessagesReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMessagesReq.send();	
		
	//	if(utm.messageDetailWindow != undefined){
	//		utm.messageDetailWindow.close();
	//	}	
	}
		
	var getMessagesReq = Ti.Network.createHTTPClient({
		onerror:function(e){
			handleError(e);         				
		}
		,timeout:utm.netTimeout
	});	
	
	getMessagesReq.onload = function()
	{
		var json = this.responseData;
		var response = JSON.parse(json);
		var tableData = [];
		setActivityIndicator('');
		Titanium.Analytics.featureEvent('user.viewed_messages');
		if(this.status ==200){
				
			log("message data returned:"+response);
			
			for (var i=0;i<response.length;i++)
			{
			  var row = Ti.UI.createTableViewRow({ className: 'row', row:clickName = 'row', objName: 'row', touchEnabled: true, height: 55,hasChild:true, messageData: response[i]});
			  
			   var hView = Ti.UI.createView({
			  	layout:'composite',
			    backgroundColor:'#fff',
			    objName: 'hView'
			  });	
			  			  
			  if(response[i].WasRead){
			  	var fromMessage = Ti.UI.createLabel({
				    backgroundColor:'#fff',
				    color: '#000',
				    font: {fontSize:14},
				    objName: 'fromMessage',
				    text: (curMode=='sent' ? response[i].ToHeader : response[i].FromUserName),
				    touchEnabled: true,
				    top:2,
				    left: 17,
				    width: '100%'
				  });			  	
			  }else{
			  	
		  		var unreadImage = Ti.UI.createImageView({
					image:'/images/circle_blue.png',
					width:12,
					height:12,
					top:20,
					left:2
				});
				hView.add(unreadImage);
			  	
			  	var fromMessage = Ti.UI.createLabel({
				    backgroundColor:'#fff',
				    color: '#000',
				    font: {fontSize:14, fontWeight:'bold'},
				    objName: 'fromMessage',
				    text: response[i].FromUserName,
				    touchEnabled: true,
				    top:2,
				    left: 17,
				    width: '100%'
				  });			  	
			  }
			   
			  hView.add(fromMessage);
			  
			  var utmMessage = Ti.UI.createLabel({
			    backgroundColor:'#fff',
			    color: '#000',
			    font: {fontSize:14},
			    objName: 'utmMessage',
			    text: response[i].UtmText,
			    touchEnabled: true,
			    top:30,
			    left: 15,
			    height:16,
			    width: '100%'
			  });
			  hView.add(utmMessage);
			  
			  var timeLabel = Ti.UI.createLabel({
				    backgroundColor:'#fff',
				    color: '#000',
				    font: {fontSize:10},
				    objName: 'timeLabel',
				    //text: String.formatDate(new Date(response[i].DateSent,'short')),
				    
					text: moment(response[i].DateSent).fromNow(),
				    //text: easyFormat(new Date(response[i].DateSent)),//response[i].DateSent,
				    touchEnabled: true,
				    top:2,
				    right: 2,
				    width: 'auto'
				  });			
			  hView.add(timeLabel);
			 
			  row.add(hView);
			  tableData.push(row);
			}
			
			tableview.setData(tableData);			
						
		}else if(this.status == 400){
			
			recordError("Error:"+this.responseText);
			setActivityIndicator('');
			
		}else{
			recordError("error");
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
	
	var deleteMessagesReq = Ti.Network.createHTTPClient({
			
		onload:function(e){
				log('Message was deleted');
					
				/*var opts = {options: [L('send_ok_button')], title:L('messages_message_deleted')};
				var dialog = Ti.UI.createOptionDialog(opts).show();
				dialog.addEventListener('click', function(e){
					getMessages(curMode);
				});*/
			}	,
			onerror:function(e){
					handleError(e);   
			}
			,timeout:utm.netTimeout
		});		
	
	return win;
};

module.exports = message_window;