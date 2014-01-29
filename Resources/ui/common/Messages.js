var MessagesWin = function(_tabGroup) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Messages', true);

	var editButton = Ti.UI.createLabel({
		text: 'edit',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	editButton.addEventListener('click', function(e){
		tableView.setEditing(!tableView.getEditing());
		editButton.setText((tableView.getEditing() ? 'done' : 'edit'));
	});
	self.setLeftNavButton(editButton);
	
	var composeButton = Ti.UI.createImageView({
		image: '/images/icons/compose.png',
		height: 22,
		width: 22
	});
	composeButton.addEventListener('click',function(e){
		Ti.App.fireEvent('app:getSubscriptionInfo',{callBack:'app:composeMessage'});
	});
	Ti.App.addEventListener('app:composeMessage',function(e){
		var MessageMembersWin = require('/ui/common/MessageMembers');
		var messageMembersWin = new MessageMembersWin(_tabGroup);
		utm.winStack.push(messageMembersWin);
		_tabGroup.getActiveTab().open(messageMembersWin);
	});
	self.setRightNavButton(composeButton);
	
	var mode = 'received';
	var tabBar = Titanium.UI.createView({
		layout : 'horizontal',
		width : '100%',
		height : 27,
		top: 0
	});
	self.add(tabBar);
	var receivedButton = Ti.UI.createLabel({
		text: 'received',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
		height: Ti.UI.FILL,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily},
		color: utm.textColor,
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	tabBar.add(receivedButton);
	var sentButton = Ti.UI.createLabel({
		text: 'sent',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
		height: Ti.UI.FILL,
		backgroundColor: utm.backgroundColor,
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily},
		color: utm.secondaryTextColor,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	tabBar.add(sentButton);
	
	var currentMode = 'received';
	receivedButton.addEventListener('click', function(e){
		receivedButton.setBackgroundColor('white');
		receivedButton.setColor(utm.textColor);
		sentButton.setBackgroundColor(utm.backgroundColor);
		sentButton.setColor(utm.secondaryTextColor);
		self.showAi();
		getMessages('received');
		currentMode = 'received';
	});
	sentButton.addEventListener('click', function(e){
		sentButton.setBackgroundColor('white');
		sentButton.setColor(utm.textColor);
		receivedButton.setBackgroundColor(utm.backgroundColor);
		receivedButton.setColor(utm.secondaryTextColor);
		self.showAi();
		getMessages('sent');
		currentMode = 'sent';
	});
	
	var tableView = Titanium.UI.createTableView({
		editable: false,
		allowsSelectionDuringEditing: true,
		height: utm.viewableArea - 27,
		top: 27
	});
	self.add(tableView);	
	
	tableView.addEventListener('click', function(e) {
		var DetailWin = require('/ui/common/MessageDetail');
		var detailWin = new DetailWin(_tabGroup,e.rowData.messageData);
		utm.winStack.push(detailWin);
		_tabGroup.getActiveTab().open(detailWin);
	});
	
	var MessageTableRow = require('/ui/common/baseui/MessageViewRow');
	function getMessages(mode) {
		var getMessagesReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate: utm.validatesSecureCertificate,
			onload: function() {
				var response = eval('(' + this.responseText + ')');
				var tableData = [];
				
				Ti.Analytics.featureEvent('user.viewed_messages');
				if (this.status === 200) {
					
					for (var i=0; i < response.length; i++) {
						response[i].mode = mode;
						var row = new MessageTableRow(response[i]);
						tableData.push(row);
					}

					tableView.setData(tableData);
					self.hideAi();
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMessagesReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMessagesReq = null;
			},
			timeout : utm.netTimeout
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
				message : '“Delete message” simply deletes this message from your message box. “Super delete message” also deletes it from the message boxes of all recipients.',
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
					Ti.API.info('The cancel button was clicked');
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
			timeout : utm.netTimeout
		});
		deleteMessagesReq.open('delete', utm.serviceUrl + 'Messages/DeleteMessage/' + messageId + '?isSuperDelete=' + isSuperDelete);
		deleteMessagesReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMessagesReq.send();
	}
	
	
	
	
	
	
	
	
	getMessages('received');
	
	return self;
};
module.exports = MessagesWin;

