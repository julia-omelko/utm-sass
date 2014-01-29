var MessageDetailWin = function(_tabGroup,_messageData) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Message', true);

	var trashButton = Ti.UI.createImageView({
		image: '/images/icons/trash.png',
		height: 22,
		width: 22
	});
	self.setRightNavButton(trashButton);
	
	var backButton = Ti.UI.createLabel({
		text: 'back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close({animated:true});
	});
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width:'100%',
		height:'100%',
		showVerticalScrollIndicator: true,
		contentHeight:'auto',
		layout:'vertical'
	});
	self.add(scrollingView);
	
	var userView = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth-50,
		left: 25,
		height: Ti.UI.SIZE
	});
	scrollingView.add(userView);
	
	var avatar = Ti.UI.createImageView({
		top: 25,
		left: 0,
		image: '/images/avatar/' + _messageData.FromUsersAvatar + '.png',
		width: 80,
		height: 80,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	userView.add(avatar);
	
	var fromLabel = Ti.UI.createLabel({
		text: ((_messageData.mode === 'received') ? _messageData.FromUserName : _messageData.ToHeader),
		font: {fontFamily: utm.fontFamily, fontWeight: 'bold'},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-100-25),
		left: 100,
		top: 30
	});
	userView.add(fromLabel);
	
	var dateLabel = Ti.UI.createLabel({
		text: getDateTimeFormat(_messageData.DateSent),
		font: {fontFamily: utm.fontFamily},
		color: utm.secondaryTextColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-100-25),
		left: 100,
		top: 50
	});
	userView.add(dateLabel);
	
	var utmMessageHeader = Ti.UI.createLabel({
		text: 'UTM message',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	scrollingView.add(utmMessageHeader);
	
	var utmMessage = Ti.UI.createLabel({
		text: _messageData.UtmText,
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily},
		color: 'black'		
	});
	scrollingView.add(utmMessage);
	
	
	var originalMessageHeader = Ti.UI.createLabel({
		text: 'Original message',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	scrollingView.add(originalMessageHeader);
	
	var originalMessage = Ti.UI.createLabel({
		text: '',
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily},
		color: 'black',
		height: Ti.UI.SIZE	
	});
	scrollingView.add(originalMessage);
	
	var replyBtn = Ti.UI.createButton({
		title: 'Reply',
		top: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white',
		visible: false
	});	
	scrollingView.add(replyBtn);
	replyBtn.addEventListener('click', function() {
		Ti.App.fireEvent('app:getSubscriptionInfo',{callBack:'app:replyToMessage'});
	});	
	Ti.App.addEventListener('app:replyToMessage',function(e){
		getReplyToUserData(_messageData.FromUserId);
	});
	
	
	var getMessageDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate,
		onload: function() {
			var response = eval('('+this.responseText+')');
			
			if (this.status === 200) {
				if (_messageData.HasAttachments) {
					callOutToGetAttachments(_messageData);
				} else {
					//Mark Message as Read
					if (!_messageData.WasRead) {
						setMessageAsRead(_messageData.Id);
					}
				} 	
				
				originalMessage.setText(response.Message);
				replyBtn.setVisible(true);
				self.hideAi();

			} else {
				utm.handleHttpError(e, this.status, this.responseText);
			}	
			getMessageDetailReq = null;
		},		
		onerror:function(e){	
			if (this.status != undefined && this.status === 404) {
				alert('The message you are looking for does not exist.');	
			} else {
				utm.handleHttpError(e, this.status, this.responseText);
         	}  
			getMessageDetailReq = null;       			
		},
		timeout:utm.netTimeout
	});	
	if (_messageData.mode === 'received') {
		getMessageDetailReq.open("GET",utm.serviceUrl+"ReceivedMessages/"+_messageData.Id);	
	} else {
		getMessageDetailReq.open("GET",utm.serviceUrl+"SentMessages/"+_messageData.Id);
	}	
	getMessageDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
	getMessageDetailReq.send();	
	
	
	function setMessageAsRead(messageId) {
		var getMarkMessageAsReadReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate:utm.validatesSecureCertificate,
			onload: function() {
				getMarkMessageAsReadReq = null;
			},		
			onerror:function(e) {
				utm.handleHttpError(e,this.status,this.responseText); 	
				getMarkMessageAsReadReq = null;		
			}
			,timeout:utm.netTimeout
		});	
		getMarkMessageAsReadReq.open("POST",utm.serviceUrl+"Messages/MarkAsRead/"+messageId);	
		getMarkMessageAsReadReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMarkMessageAsReadReq.send();		
	}
	
	
	function getReplyToUserData(replyingToUserId) {

		var getMembersReq = Ti.Network.createHTTPClient({
		    validatesSecureCertificate:utm.validatesSecureCertificate, 
			onload : function(e) {
				var response = eval('('+this.responseText+')');
				
				if (this.status === 200) {					
					if (response.length === 0) {
						alert('You are unable to send a message to this member as they are no longer a member of this group.');
						getMembersReq = null;
						return;
					}
					
					var data = [];
					utm.curUserCurMyHortHasTwitter = false;
					utm.curUserCurMyHortHasFacebook = false;
					utm.curUserCurMyHortNickName  = _messageData.ToHeader;
					
					var selectedContacts = [];
					
					selectedContacts.push({
						userData: response[0]
					});
					
					var ComposeWin = require('/ui/common/Compose');
					var composeWin = new ComposeWin(_tabGroup,selectedContacts,'Reply',_messageData.Id);
					utm.winStack.push(composeWin);
					_tabGroup.getActiveTab().open(composeWin);
											
				} else {	
					utm.handleHttpError(e, this.status, this.responseText);		
				}		
				getMembersReq = null;
		     },
		     onerror : function(e) {		
		        utm.handleError(e,this.status,this.responseText); 
		        getMembersReq = null;
		     }
		     ,timeout:utm.netTimeout
		});	
		getMembersReq.open("GET",utm.serviceUrl+"Members/"+_messageData.MyHortId +'?$filter=UserId eq '+replyingToUserId );
		getMembersReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	
		getMembersReq.send();			
	};
	
	
	
	return self;
};
module.exports = MessageDetailWin;

