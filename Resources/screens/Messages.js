function message_window(utm) {

	var moment = require('lib/moment');
	var navGroup = false;
	var curMode = 'recieved';

	var lastRow = 4;
	
	if(utm.iPhone || utm.iPad ){
		var win = Ti.UI.createWindow({
			layout : 'vertical',
			title : 'Messages',
			backButtonTitle : L('button_back'),
			backgroundColor : utm.backgroundColor,
			barColor : utm.barColor
		});
		
		
		var tabBar = Ti.UI.iOS.createTabbedBar({
			labels : [L('messages_recieved'), L('messages_sent')],
			backgroundColor : utm.color,
			top : 2,
			index : 0,
			style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
			height : 35,
			width : 250
		});
		win.add(tabBar);
	
		tabBar.addEventListener('click', function(e) {
			//get out  of edit mode.
			if(Ti.Platform.osname == 'iphone'){
				win.setRightNavButton(edit);
			}
			tableView.editing = false;
			tableView.setData([]);
			
			if (tabBar.index == 0) {
				curMode = "recieved";
				getMessages('recieved');
				tabBar.setIndex(0);
			} else {
				curMode = "sent";
				getMessages('sent');
				tabBar.setIndex(1);
			}
		});
	}	

	if(utm.Android){
		//create the base screen and hide the Android navbar
		var win = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
	    });

 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text:'Messages',
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
 
 		//add the navbar to the screen
		win.add(my_navbar);
		
		//create a view to contain Android tab buttons
		var tabBar = Titanium.UI.createView ({
   			layout : 'horizontal',
   			width : '100%',
   			height : 55
		});
		win.add(tabBar);
		
		var receivedButton = Ti.UI.createButton({
			title : 'Received',
			top : 2,
			Height : Titanium.UI.SIZE - 4,
			font:{fontFamily:'Arial',fontSize:'14dp'}
		});
		tabBar.add(receivedButton);
		
		receivedButton.addEventListener('click',function(e)
		{
			tableView.editing = false;
			tableView.setData([]);
			curMode = "recieved";
			getMessages('recieved');			
		});
		
		var sentButton = Ti.UI.createButton({
			title : 'Sent',
			top : 2,
			Height : Titanium.UI.SIZE - 4,
			font:{fontFamily:'Arial',fontSize:'14dp'}
		});
		tabBar.add(sentButton);
		
		sentButton.addEventListener('click',function(e)
		{
			tableView.editing = false;
			tableView.setData([]);
			curMode = "sent";
			getMessages('sent');
		});			
		
		//add activityIndicator to window
		win.add(utm.activityIndicator)
	}
		

	var tableView = Titanium.UI.createTableView({
		left : 2,
		editable : true,
		allowsSelectionDuringEditing : true
	});
	win.add(tableView);
	
	//Add Click to Details for drilldown
	tableView.addEventListener('click', function(e) {
		var messageData = e.rowData.messageData;
		showMessageDetail(messageData);
	});

  	function showMessageDetail(_messageData){
  		utm.MessageDetailWindow = require('screens/MessageDetail');
		utm.messageDetailWindow = new utm.MessageDetailWindow(_messageData, curMode,utm);
		utm.messageDetailWindow.title = 'Message';
		utm.navController.open(utm.messageDetailWindow);  		
  	}


	//Add Swipe event to delete messages
	/*tableView.addEventListener('swipe', function(eventObject){

	deleteMessage(eventObject.row.messageData.Id,false);
	});*/

	// add delete event listener
	tableView.addEventListener('delete', function(e) {
		var s = e.section;
		deleteMessage(e.rowData.messageData.Id, false)
	});

	function deleteMessage(messageId) {

		if (curMode == 'sent') {

			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Delete Message?', 'Super Delete Message?', L('cancel')],
				message : '“Delete Message” simply deletes this message from your  message box; “Super Delete Message” also deletes it from the message boxes of all recipients. ',
				title : 'Delete Options',
				messageId : messageId
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					callDeleteMessage(messageId, false);
				} else if (e.index === 1) {
					callDeleteMessage(messageId, true);
				} else if (e.index === 2) {
					Ti.API.info('The cancel button was clicked');
				}
			});
			dialog.show();

		} else {
			callDeleteMessage(messageId, false);
		}

	}

	function callDeleteMessage(messageId, isSuperDelete) {
		utm.log("About to delete message:" + messageId + '  isSuperDelete:' + isSuperDelete);
		deleteMessagesReq.open('delete', utm.serviceUrl + 'Messages/DeleteMessage/' + messageId + '?isSuperDelete=' + isSuperDelete);
		deleteMessagesReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMessagesReq.send();
	}

	//
	//  create edit/cancel buttons for nav bar
	//
	var edit = Titanium.UI.createButton({
		title : 'Delete'
	});

	edit.addEventListener('click', function() {
		if(Ti.Platform.osname == 'iphone'){
			win.setRightNavButton(cancel);
		}	
		tableView.editing = true;
	});

	var cancel = Titanium.UI.createButton({
		title : L('cancel'),
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	cancel.addEventListener('click', function() {
		if(Ti.Platform.osname == 'iphone'){
			win.setRightNavButton(edit);
		}
		tableView.editing = false;
	});
	if(Ti.Platform.osname == 'iphone'){
		win.setRightNavButton(edit);
	}
		

	Ti.App.addEventListener('app:showMessages', showMessageWindow);
	function showMessageWindow() {
		getMessages(curMode);
	}


	Ti.App.addEventListener('app:backToMessageWindow', backToMessageWindow);
	function backToMessageWindow() {
		//Ti.App.fireEvent('app:showMessages');
		utm.navController.open(utm.messageWindow);
		getMessages(curMode);
	}


	Ti.App.addEventListener('app:refreshMessages', refreshMessages);
	function refreshMessages(data) {
		if (data.showProgress) {
			showProgress = true;
		} else {
			showProgress = false;
		}

		getMessages(curMode, showProgress);
	}

	function getMessages(mode, showProgress) {
		if ( typeof showProgress === 'undefined')
			showProgress = true;

		if (showProgress) {
			utm.setActivityIndicator('Getting your messages...');
		}

		if (mode == 'recieved') {
			getMessagesReq.open("GET", utm.serviceUrl + "ReceivedMessages?$orderby=DateSent desc");
		} else {
			getMessagesReq.open("GET", utm.serviceUrl + "SentMessages?$orderby=DateSent desc");
		}

		getMessagesReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMessagesReq.send();

		//	if(utm.messageDetailWindow != undefined){
		//		utm.messageDetailWindow.close();
		//	}
	}

	var getMessagesReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onerror : function(e) {
			utm.handleError(e, this.status, this.responseText);
		},
		timeout : utm.netTimeout
	});

	getMessagesReq.onload = function() {
		var response = eval('('+this.responseText+')');
		var tableData = [];
		utm.setActivityIndicator('');
		Titanium.Analytics.featureEvent('user.viewed_messages');
		if (this.status == 200) {

			utm.log("message data returned " +  response.length + '  messages');

			for (var i = 0; i < response.length; i++) {
				var row = Ti.UI.createTableViewRow({
					//className : 'row',
					row : clickName = 'row',
					objName : 'row',
					touchEnabled : true,
					height : utm.Android ? '55dp':55,
					hasChild : true,
					messageData : response[i]
				});

				var hView = Ti.UI.createView({
					layout : 'composite', 
					backgroundColor : '#fff',
					objName : 'hView'
				});

				if (!response[i].WasRead) {
					var unreadImage = Ti.UI.createImageView({
						image : '/images/circle_blue.png',
						width : 12,
						//height : 12,
						top : 20,
						left : 2
					});
					hView.add(unreadImage);
				}

				var fromMessage = Ti.UI.createLabel({
					backgroundColor : '#fff',
					color : '#000',
					font : {
						fontSize : '14dp',
						fontWeight : 'bold'
					},
					objName : 'fromMessage',
					text : (curMode == 'sent' ? response[i].ToHeader : response[i].FromUserName),
					touchEnabled : true,
					top : 2,
					left : 17,
					width : utm.SCREEN_WIDTH - 100,
					height : utm.Android ? '15dp':15,
					ellipsize : true
				});
				hView.add(fromMessage);

				var utmMessage = Ti.UI.createLabel({
					backgroundColor : '#fff',
					color : '#666',
					font : {
						fontSize : '14dp'
					},
					objName : 'utmMessage',
					text : response[i].UtmText,
					touchEnabled : true,
					top : 30,
					left : 15,
					height : utm.Android ? '20dp':'20',
					width : '100%'
				});
				hView.add(utmMessage);

				var timeLabel = Ti.UI.createLabel({
					backgroundColor : '#fff',
					color : '#0066ff',
					font : {
						fontSize : '10dp'
					},
					objName : 'timeLabel',
					//text: String.formatDate(new Date(response[i].DateSent,'short')),

					text : getDateTimeFormat(response[i].DateSent), // moment(response[i].DateSent).fromNow(),
					//text: easyFormat(new Date(response[i].DateSent)),//response[i].DateSent,
					touchEnabled : true,
					top : 2,
					right : 2,
					width : 'auto'
				});
				hView.add(timeLabel);

				row.add(hView);
				tableData.push(row);	
			}

			tableView.setData(tableData);

		} else if (this.status == 400) {

			utm.recordError("Error:" + this.responseText);

		} else {
			utm.recordError("error");
		}

	};
	

	
	//RE #260 - Mobile Ti App: ver 0.28 Beta: Latency, can briefly see messages from previously logged in user
	Ti.App.addEventListener('app:loginSuccess', handleLoginSuccess);
	function handleLoginSuccess(event) {
		tableData = [];	
		tableView.setData(tableData);
	}	

	// #############################  Scroll Refresh Start #############################
	if(! utm.Android){ 
		var border = Ti.UI.createView({
			backgroundColor : "#576c89",
			height : 2,
			bottom : 0
		});
	
		var tableHeader = Ti.UI.createView({
			backgroundColor : "#e2e7ed",
			width : 320,
			height : 60
		});
	
		tableHeader.add(border);
	
		var arrow = Ti.UI.createView({
			backgroundImage : "/images/whiteArrow.png",
			width : 23,
			height : 60,
			bottom : 10,
			left : 20
		});
	
		var statusLabel = Ti.UI.createLabel({
			text : "Pull to reload",
			left : 55,
			width : 200,
			bottom : 30,
			height : "auto",
			color : "#576c89",
			textAlign : "center",
			font : {
				fontSize : 13,
				fontWeight : "bold"
			},
			shadowColor : "#999",
			shadowOffset : {
				x : 0,
				y : 1
			}
		});
	
		var lastUpdatedLabel = Ti.UI.createLabel({
			text : "Last Updated: " + formatDate(),
			left : 55,
			width : 200,
			bottom : 15,
			height : "auto",
			color : "#576c89",
			textAlign : "center",
			font : {
				fontSize : 12
			},
			shadowColor : "#999",
			shadowOffset : {
				x : 0,
				y : 1
			}
		});
	
		var actInd = Titanium.UI.createActivityIndicator({
			left : 20,
			bottom : 13,
			width : 30,
			height : 30
		});
	
		tableHeader.add(arrow);
		tableHeader.add(statusLabel);
		tableHeader.add(lastUpdatedLabel);
		tableHeader.add(actInd);
	
		tableView.headerPullView = tableHeader;
	
		var pulling = false;
		var reloading = false;
	
		function beginReloading() {
			// just mock out the reload
			setTimeout(endReloading, 500);
		}
	
		function endReloading() {		
			var data='';
			//call to get the data
			getMessages(curMode, true);
	
			lastRow += 10;
	
			// when done reset
			tableView.setContentInsets({
				top : 0
			}, {
				animated : true
			});
			reloading = false;
			lastUpdatedLabel.text = "Last Updated: " + formatDate();
			statusLabel.text = "Pull down to refresh...";
			actInd.hide();
			arrow.show();
		}



		tableView.addEventListener('scroll', function(e) {	
			var offset = e.contentOffset.y;
			if (offset <= -65.0 && !pulling && !reloading) {
				var t = Ti.UI.create2DMatrix();
				t = t.rotate(-180);
				pulling = true;
				arrow.animate({
					transform : t,
					duration : 180
				});
				statusLabel.text = "Release to refresh...";
			} else if (pulling && (offset > -65.0 && offset < 0) && !reloading) {
				pulling = false;
				var t = Ti.UI.create2DMatrix();
				arrow.animate({
					transform : t,
					duration : 180
				});
				statusLabel.text = "Pull down to refresh...";
			}
		});
	
		var event1 = 'dragEnd';
		if (Ti.version >= '3.0.0') {
			event1 = 'dragend';
		}
	
		tableView.addEventListener(event1, function(e) {
			if (pulling && !reloading) {
				reloading = true;
				pulling = false;
				arrow.hide();
				actInd.show();
				statusLabel.text = "Reloading...";
				tableView.setContentInsets({
					top : 60
				}, {
					animated : true
				});
				arrow.transform = Ti.UI.create2DMatrix();
				beginReloading();
			}
		});
	}
	
	Number.prototype.pad = function (len) {
 	   return (new Array(len+1).join("0") + this).slice(-len);
	}
	
	function pad(val){
		val = val < 10 ? '0' +val: '' +val;
		return val;
	}
	

	function formatDate() {
		var date = new Date();
		var datestr = (date.getMonth()+1 ) + '/' + date.getDate() + '/' + date.getFullYear();
		if (date.getHours() >= 12) {
			datestr += ' ' + (date.getHours() == 12 ? date.getHours() : date.getHours() - 12) + ':' + pad(date.getMinutes()) + ' PM';
		} else {
			datestr += ' ' + date.getHours() + ':' + pad(date.getMinutes()) + ' AM';
		}
		return datestr;
	}

	// #############################  Scroll Refresh End #############################

	var deleteMessagesReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function(e) {
			utm.log('Message was deleted');

			/*var opts = {options: [L('ok_button')], title:L('messages_message_deleted')};
			 var dialog = Ti.UI.createOptionDiautm.log(opts).show();
			 dialog.addEventListener('click', function(e){
			 getMessages(curMode);
			 });*/
		},
		onerror : function(e) {
			utm.handleError(e, this.status, this.responseText);
		},
		timeout : utm.netTimeout
	});
	
	win.addEventListener('blur', function() {
		if(Ti.Platform.osname == 'iphone'){
			win.setRightNavButton(edit);
		}   		
		tableView.editing = false;
	});



	return win;
};

module.exports = message_window;