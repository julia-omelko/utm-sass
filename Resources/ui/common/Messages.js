var MessagesWin = function(_tabGroup) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Messages', true);

	var updateDisplay = function() {
		self.fireEvent('reorientdisplay');
	};
	Ti.App.addEventListener('orientdisplay', updateDisplay);

	var editButton = Ti.UI.createLabel({
		text: 'Edit',
		font: {fontFamily: utm.fontFamily},
		color: 'white',
		top: 10,
		width: 40,
		height: 50
	});
	editButton.addEventListener('click', function(e){
		tableView.setEditing(!tableView.getEditing());
		editButton.setText((tableView.getEditing() ? 'Done' : 'Edit'));
	});
	self.setLeftNavButton(editButton);
	
	var composeButton = Ti.UI.createImageView({
		image: '/images/icons/compose.png',
		height: 25,
		width: 25
	});
	var composeMessage = function() {
		var MessageMembersWin = require('/ui/common/MessageMembers');
		var messageMembersWin = new MessageMembersWin(_tabGroup);
		utm.winStack.push(messageMembersWin);
		_tabGroup.getActiveTab().open(messageMembersWin);
	};
	composeButton.addEventListener('click',function(e){
		Ti.App.fireEvent('app:getSubscriptionInfo',{callBack:'app:composeMessage'});
	});
	Ti.App.addEventListener('app:composeMessage',composeMessage);
	self.addEventListener('close',function(e){
		Ti.App.removeEventListener('app:composeMessage',composeMessage);
	});
	self.setRightNavButton(composeButton);
	
	var mode = 'received';
	var tabBar = Titanium.UI.createView({
		layout : 'horizontal',
		width : '100%',
		height : 37 * utm.sizeMultiplier,
		top: utm.viewableTop
	});
	self.add(tabBar);
	var receivedButton = Ti.UI.createLabel({
		text: 'received',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.4999),
		height: Ti.UI.FILL,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.textColor,
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	tabBar.add(receivedButton);
	
	self.addEventListener('reorientdisplay', function(evt) {
		receivedButton.width = Math.round(Ti.Platform.displayCaps.platformWidth * 0.50);
	});
	
	var sentButton = Ti.UI.createLabel({
		text: 'sent',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.50),
		height: Ti.UI.FILL,
		backgroundColor: utm.backgroundColor,
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	tabBar.add(sentButton);
	self.addEventListener('reorientdisplay', function(evt) {
			sentButton.width = Math.round(Ti.Platform.displayCaps.platformWidth * 0.50);
	});	
	var currentMode = 'received';
	receivedButton.addEventListener('click', function(e){
		receivedButton.setBackgroundColor('white');
		receivedButton.setColor(utm.textColor);
		sentButton.setBackgroundColor(utm.backgroundColor);
		sentButton.setColor(utm.secondaryTextColor);
		getMessages('received');
		tableView.scrollToTop(0);
		currentMode = 'received';
	});
	sentButton.addEventListener('click', function(e){
		sentButton.setBackgroundColor('white');
		sentButton.setColor(utm.textColor);
		receivedButton.setBackgroundColor(utm.backgroundColor);
		receivedButton.setColor(utm.secondaryTextColor);
		getMessages('sent');
		tableView.scrollToTop(0);
		currentMode = 'sent';
	});
	
	var refreshing = false;
	if (utm.iPad || utm.iPhone) {
		var refreshControl = Ti.UI.createRefreshControl({
			tintColor: utm.color_org
		});
		refreshControl.addEventListener('refreshstart',function(e){
			refreshing = true;
			getMessages(currentMode);
		});
	}
	var tableView = Titanium.UI.createTableView({
		editable: false,
		allowsSelectionDuringEditing: true,
		height: utm.viewableArea - (37 * utm.sizeMultiplier) - utm.viewableTabHeight,
		top: utm.viewableTop + (37 * utm.sizeMultiplier),
		refreshControl: ((utm.iPad || utm.iPhone) ? refreshControl : null),
		data: []
	});
	var rowCount = 0;
	var rawTableData = [];
	
	self.addEventListener('reorientdisplay', function(evt) {
		tableView.height = utm.viewableArea - (37 * utm.sizeMultiplier) - utm.viewableTabHeight;
	});	
	
	if (utm.Android) {
		tableView.setHeight(utm.viewableArea - (37 * utm.sizeMultiplier)  - utm.viewableTabHeight - ((40 * utm.sizeMultiplier)+20));
	}
	self.add(tableView);	
	
	tableView.addEventListener('click', function(e) {
		//alert(e.rowData.messageData);
		var DetailWin = require('/ui/common/MessageDetail');
		var detailWin = new DetailWin(_tabGroup,e.rowData.messageData);
		detailWin.addEventListener('close',function(e){
			getMessages(currentMode);
		});
		utm.winStack.push(detailWin);
		_tabGroup.getActiveTab().open(detailWin);
	});
	
	var MessageTableRow = require('/ui/common/baseui/MessageViewRow');
	function getMessages(mode) {
		if (refreshing === false) {
			self.showAi();
		}
		var getMessagesReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate: utm.validatesSecureCertificate,
			onload: function() {
				var response = eval('(' + this.responseText + ')');
				var tableData = [];
				rawTableData = response;
				
				if (this.status === 200) {
					for (var i=0; i < response.length; i++) {//Math.min(20,response.length)
						response[i].mode = mode;
						var row = new MessageTableRow(response[i]);
						tableData.push(row);
					}
					//rowCount = Math.min(20,response.length);

					tableView.setData(tableData);
					self.hideAi();
					if (utm.iPad || utm.iPhone) {
        				refreshControl.endRefreshing();
        			}
        			refreshing = false;
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMessagesReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMessagesReq = null;
			},
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
		});

		if (mode === 'received') {
			getMessagesReq.open("GET", utm.serviceUrl + "ReceivedMessages?$orderby=DateSent desc");
		} else {
			getMessagesReq.open("GET", utm.serviceUrl + "SentMessages?$orderby=DateSent desc");
		}

		getMessagesReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMessagesReq.send();
	}
	
	
	
	
	tableView.addEventListener('delete', function(e) {
		deleteMessage(e.rowData.messageData.Id, e.row);
	});

	function deleteMessage(messageId, theRow) {
		if (currentMode === 'sent') {

			var dialog = Ti.UI.createAlertDialog({
				cancel : 2,
				buttonNames : ['Delete message?', 'Super delete message?', L('cancel')],
				message : '???Delete message??? simply deletes this message from your message box. ???Super delete message??? also deletes it from the message boxes of all recipients.',
				title : 'Delete options',
				messageId : messageId
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					callDeleteMessage(messageId, false);
					tableView.deleteRow(theRow);
				} else if (e.index === 1) {
					callDeleteMessage(messageId, true);
					tableView.deleteRow(theRow);
				} else if (e.index === 2) {
					//Ti.API.info('The cancel button was clicked');
				}
			});
			dialog.show();

		} else {
			if (utm.Android){
				var dialog = Ti.UI.createAlertDialog({
					cancel : 1,
					buttonNames : ['Yes',  L('cancel')],
					message : 'Do you want to delete this message? ',
					title : 'Delete Confirmation',
					messageId : messageId
				});
				dialog.addEventListener('click', function(e) {
					if (e.index === 0) {
						callDeleteMessage(messageId, true);
						tableView.deleteRow(theRow);
					}
				});
				dialog.show();
			} else {
				callDeleteMessage(messageId, false);
				tableView.deleteRow(theRow);
			}
			
		}

	}

	function callDeleteMessage(messageId, isSuperDelete) {
		var deleteMessagesReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				deleteMessagesReq = null;
			},
			onerror : function(e) {
				deleteMessagesReq = null;
			},
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
		});
		deleteMessagesReq.open('delete', utm.serviceUrl + 'Messages/DeleteMessage/' + messageId + '?isSuperDelete=' + isSuperDelete);
		deleteMessagesReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMessagesReq.send();
	}
	
	
	if (utm.Android) {
		var StandardButton = require('/ui/common/baseui/StandardButton');
		var aComposeButton = new StandardButton({title:'New Message'});
		aComposeButton.addEventListener('click',function(e){
			Ti.App.fireEvent('app:getSubscriptionInfo',{callBack:'app:composeMessage'});
		});
		//tableView.setHeight(tableView.getHeight()-((40*utm.sizeMultiplier)+20));
		self.add(aComposeButton);
	}
	
	
	self.addEventListener('postlayout',evaluateAndroidHeight);
	function evaluateAndroidHeight(){
		if (self.rect.height !== 0) {
			self.removeEventListener('postlayout',evaluateAndroidHeight);
			utm.viewableTabHeight = (utm.viewableArea+utm.viewableTop) - self.rect.height;
			Ti.App.Properties.setString('viewableTabHeight',utm.viewableTabHeight);
			
		}
	}

	
	getMessages('received');
	
	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('orientdisplay', updateDisplay);
	});	
	
	
	
	/*tableView.addEventListener('scroll',endOfTheTable);
	function endOfTheTable(e) {
		if (utm.Android) {
			//Ti.API.info(e.firstVisibleItem + ' ' + e.visibleItemCount + ' ' + tableView.getData()[0].rows.length + ' ' + rawTableData.length);
			if ((e.firstVisibleItem + e.visibleItemCount) === tableView.getData()[0].rows.length) {
				tableView.removeEventListener('scroll',endOfTheTable);
				lazyLoadMoreData();
			}	
		} else if (utm.iPhone || utm.iPad) {
			if (e.size.height + e.contentOffset.y + 50 > e.contentSize.height) {
				tableView.removeEventListener('scroll',endOfTheTable);
				lazyLoadMoreData();
			}
		}
	}
	
	function lazyLoadMoreData() {
		var tableData = [];
		for (var i=rowCount; i < Math.min(rowCount+20,rawTableData.length); i++) {
			rawTableData[i].mode = mode;
			var row = new MessageTableRow(rawTableData[i]);
			tableData.push(row);
		}
		rowCount = Math.min(rowCount+20,rawTableData.length);
		tableView.appendRow(tableData);
		tableView.addEventListener('scroll',endOfTheTable);
	}*/
	
	
	
	return self;
};
module.exports = MessagesWin;

