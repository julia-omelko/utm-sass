var MessageDetailWin = function(_tabGroup,_messageData) {
	
	if (_messageData.mode === 'received') {
		var winTitle = 'Message Received';
	} else {
		var winTitle = 'Message Sent';
	}
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow(winTitle, true);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width: Ti.UI.FILL,
		height: ((_messageData.mode !== 'sent') ? utm.viewableArea - 60 : utm.viewableArea),
		top: utm.viewableTop,
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
		width: 80*utm.sizeMultiplier,
		height: 80*utm.sizeMultiplier,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	userView.add(avatar);
	
	var userSubView = Ti.UI.createView({
		left: (100*utm.sizeMultiplier),
		top: 30,
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		layout: 'vertical'
	});
	userView.add(userSubView);
	
	var fromLabel = Ti.UI.createLabel({
		text: ((_messageData.mode === 'received') ? _messageData.FromUserName : _messageData.ToHeader.split(',').join(', ')),
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.barColor,
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		wordWrap: true,
		left: 0,
		top: 0
	});
	userSubView.add(fromLabel);
	
	var dateLabel = Ti.UI.createLabel({
		text: getDateTimeFormat(_messageData.DateSent),
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-(100*utm.sizeMultiplier)-25),
		left: 0,
		top: 10
	});
	userSubView.add(dateLabel);
	
	var utmMessageHeader = Ti.UI.createLabel({
		text: 'UTM message',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	scrollingView.add(utmMessageHeader);
	
	var utmMessage = Ti.UI.createLabel({
		text: _messageData.UtmText,
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: 'black'		
	});
	scrollingView.add(utmMessage);
	
	
	var originalMessageHeader = Ti.UI.createLabel({
		text: 'Original message',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	scrollingView.add(originalMessageHeader);
	
	var originalMessage = Ti.UI.createLabel({
		text: '',
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: 'black',
		height: Ti.UI.SIZE	
	});
	scrollingView.add(originalMessage);
	
	if (_messageData.mode !== 'sent') {
		var StandardButton = require('/ui/common/baseui/StandardButton');
		var replyBtn = new StandardButton({title:'Reply'});
		self.add(replyBtn);
		replyBtn.addEventListener('click', function() {
			self.showAi();
			Ti.App.fireEvent('app:getSubscriptionInfo',{callBack:'app:replyToMessage'});
		});	
		var replyToMessage = function() {
			getReplyToUserData(_messageData.FromUserId);
		};
		Ti.App.addEventListener('app:replyToMessage',replyToMessage);
		self.addEventListener('close',function(e){
			Ti.App.removeEventListener('app:replyToMessage',replyToMessage);
		});
	}
	
	
	var getMessageDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate,
		onload: function() {
			var response = eval('('+this.responseText+')');
			_messageData.deliveryOptions = response.Data;
			
			if (this.status === 200) {
				if (_messageData.HasAttachments) {
					callOutToGetAttachments(_messageData);
				} else {
					//Mark Message as Read
					if (!_messageData.WasRead) {
						setMessageAsRead(_messageData.Id);
						_messageData.WasRead = true;
					}
					self.hideAi();
				}
				originalMessage.setText(response.Message);

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
						self.hideAi();
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
					var composeWin = new ComposeWin(_tabGroup,selectedContacts,'Reply',_messageData);
					utm.winStack.push(composeWin);
					_tabGroup.getActiveTab().open(composeWin);
					self.hideAi();
											
				} else {
					utm.handleHttpError(e, this.status, this.responseText);	
					self.hideAi();
				}		
				getMembersReq = null;
		     },
		     onerror : function(e) {		
		        utm.handleHttpError(e,this.status,this.responseText); 
		        self.hideAi();
		        getMembersReq = null;
		     }
		     ,timeout:utm.netTimeout
		});	
		getMembersReq.open("GET",utm.serviceUrl+"Members/"+_messageData.MyHortId +'?$filter=UserId eq '+replyingToUserId );
		getMembersReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	
		getMembersReq.send();			
	};
	
	function callOutToGetAttachments(_messageData) {
		var getAttachmentsReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate:utm.validatesSecureCertificate, 
			onload: function(){
				var response = eval('('+this.responseText+')');
				
				if(this.status == 200){
					showAttachment(response);
					
					if (!_messageData.WasRead) {
						setMessageAsRead(_messageData.Id);
					}
				}
				getAttachmentsReq = null;	
			},		
			onerror:function(e){
				utm.handleHttpError(e,this.status,this.responseText); 		
				getAttachmentsReq = null;
			},
			timeout:utm.netTimeout
		});	
								
		getAttachmentsReq.open("GET",utm.serviceUrl + "Attachment/" + _messageData.Attachments[0].Id);	
		getAttachmentsReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getAttachmentsReq.send();				
		
	}
	
	function showAttachment(_attachmentData) {
		var imageSrc = _attachmentData.Attachment;	
		var image = Ti.Utils.base64decode(imageSrc);

		var previewView = Ti.UI.createView({
			top: 15*utm.sizeMultiplier,
			height: 80*utm.sizeMultiplier,
			width: 80*utm.sizeMultiplier,
			borderRadius: 20*utm.sizeMultiplier,
			backgroundColor: utm.barColor,
			borderColor: utm.barColor
		});
		var previewImage = Ti.UI.createImageView({
			image: image,
			height: 80*utm.sizeMultiplier,
			width: 80*utm.sizeMultiplier
		});
		previewView.addEventListener('click',function(e){
			var AttachmentPreviewWin = require('/ui/common/AttachmentPreview');
			var attachmentPreviewWin = new AttachmentPreviewWin(self, image);
			if (utm.Android) {
				attachmentPreviewWin.open({modal: true});
			} else {
				navWin = Ti.UI.iOS.createNavigationWindow({
	    			modal: true,
					window: attachmentPreviewWin
				});
				navWin.open();
			}
		});
		self.addEventListener('closeAttachmentPreview',function(e) {
			if (utm.iPhone || utm.iPad) {
				navWin.close();
			}
		});
		previewView.add(previewImage);
		scrollingView.add(previewView);
		self.hideAi();
	}
	
	
	return self;
};
module.exports = MessageDetailWin;

