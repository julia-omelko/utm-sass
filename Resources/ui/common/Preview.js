var PreviewWin = function(_tabGroup,_message) {
	_myHortId = _message.selectedContacts[0].userData.MyHortId;
	_nickname = '';
	
	var deliveryOptions = {
		sms: false,
		email: false,
		twitter: false,
		facebook: false,
		signMessage: false,
		deleteOnRead: true,
		curRjCrypt: ''
	};
	if (_message.deliveryOptions != null) {
		// a reply to a message.
		var deliveryEnabled = {
			sms: _message.deliveryOptions.Mobile,
			email: _message.deliveryOptions.Email,
			twitter: _message.deliveryOptions.Twitter,
			facebook: _message.deliveryOptions.Facebook
		};
	} else {
		var deliveryEnabled = {
			sms: false,
			email: false,
			twitter: false,
			facebook: false
		};
		for (var i=0; i<_message.selectedContacts.length; i++) {
			if (typeof _message.selectedContacts[i].userData !== 'undefined') {
				if (typeof _message.selectedContacts[i].userData.HasMobile !== 'undefined' && _message.selectedContacts[i].userData.HasMobile) {
					deliveryOptions.sms = true;
					deliveryEnabled.sms = true;
				}
				if (typeof _message.selectedContacts[i].userData.HasEmail !== 'undefined' && _message.selectedContacts[i].userData.HasEmail) {
					deliveryOptions.email = true;
					deliveryEnabled.email = true;
				}
			}
		}
	}
	
	function loadMyHortDetail() {
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					myHortData = response;
					if (myHortData.PrimaryUser !== null) {
						var sendData = myHortData.PrimaryUser;
					} else {
						var sendData = myHortData.MyInformation;
					}
					//if (_message.deliveryOptions != null) {
					if (sendData.FaceBook !== '') {
						deliveryEnabled.facebook = true;
					}
					if (sendData.TwitterSecret !== '') {
						deliveryEnabled.twitter = true;
					}
					if (sendData.Mobile !== '') {
						deliveryEnabled.sms = true;
					}
					if (sendData.Email !== '') {
						deliveryEnabled.email = true;
					}
					//}
					deliveryOptions.signMessage = sendData.AddNicknameToUtms;
					if (sendData.deleteOnRead !== null) {
						deliveryOptions.deleteOnRead = sendData.deleteOnRead;
					}
					
					_nickname = sendData.NickName;
					getUtmMessage();
					
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMyHortDetailReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMyHortDetailReq = null;
			},
			timeout : utm.netTimeout
		});
		
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + _myHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	if (_message.deliveryOptions != null) {
		getUtmMessage();
	} else {
		loadMyHortDetail();
	}

	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Preview', true);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width: '100%',
		height: utm.viewableArea - ((40*2*utm.sizeMultiplier)+30),
		showVerticalScrollIndicator: true,
		contentHeight: 'auto',
		layout: 'vertical',
		top: utm.viewableTop
	});
	self.add(scrollingView);
	
	var topView = Ti.UI.createView({
		width: '100%',
		height: Ti.UI.SIZE,
		top: 25
	});
	scrollingView.add(topView);
	var leftView = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth-(80*utm.sizeMultiplier)-35,
		height: Ti.UI.SIZE,
		layout: 'vertical',
		left: 0,
		top: 0
	});
	topView.add(leftView);
	
	
	var sendHeader = Ti.UI.createLabel({
		text: _message.mode + ' to:',
		top: 0,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	leftView.add(sendHeader);
	
	var sendTo = [];
	var sendToIds = [];
	for (var i=0; i<_message.selectedContacts.length; i++) {
		sendTo[i] = _message.selectedContacts[i].userData.NickName;
		sendToIds[i] = _message.selectedContacts[i].userData.UserId;
	}
	sendTo = sendTo.join(', ');
	var sendLabel = Ti.UI.createLabel({
		text: sendTo,
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: 'black'		
	});
	leftView.add(sendLabel);
	
	var messageHeader = Ti.UI.createLabel({
		text: 'Original Message:',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	leftView.add(messageHeader);

	if ("attachment" in _message && _message.attachment != null) {
		var previewView = Ti.UI.createView({
			right: 25,
			height: 80*utm.sizeMultiplier,
			width: 80*utm.sizeMultiplier,
			borderRadius: 20*utm.sizeMultiplier,
			backgroundColor: utm.barColor,
			borderColor: utm.barColor
		});
		var previewImage = Ti.UI.createImageView({
			image: _message.thumbnail,
			height: 80*utm.sizeMultiplier,
			width: 80*utm.sizeMultiplier,
			autorotate: true
		});
		previewView.addEventListener('click',function(e){
			var AttachmentPreviewWin = require('/ui/common/AttachmentPreview');
			var attachmentPreviewWin = new AttachmentPreviewWin(self, _message.attachment);
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
		topView.add(previewView);
	}


	var messageField = Ti.UI.createLabel({
		text: _message.message,
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: 'black'		
	});
	scrollingView.add(messageField);
	
	var messageHeader = Ti.UI.createLabel({
		text: 'UTM Message:',
		top: 25,
		left: 25,
		height: Ti.UI.SIZE,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	scrollingView.add(messageHeader);
	
	var utmMessage = Ti.UI.createLabel({
		text: '',
		top: 10,
		left: 25,
		height: 90*utm.sizeMultiplier,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
		color: 'black'		
	});
	scrollingView.add(utmMessage);
	
	var utmRefresh = Ti.UI.createImageView({
		image: '/images/icons/refresh.png',
		left: (Ti.Platform.displayCaps.platformWidth-(40*utm.sizeMultiplier))/2,
		top: 0,
		height: 40*utm.sizeMultiplier,
		width: 40*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		backgroundColor: utm.buttonColor,
	});
	utmRefresh.addEventListener('click',function(e){
		self.showAi();
		getUtmMessage();
	});
	scrollingView.add(utmRefresh);	
	

	

	
	
	
	var StandardButton = require('/ui/common/baseui/StandardButton');
	var optionsBtn = new StandardButton({title:'Delivery options',bottom:(40*utm.sizeMultiplier)+20,type:'secondary'});
	optionsBtn.addEventListener('click', function() {
		var DeliveryOptionsWin = require('/ui/common/DeliveryOptions');
		var deliveryOptionsWin = new DeliveryOptionsWin(self, deliveryOptions, deliveryEnabled);
		if (utm.Android) {
			deliveryOptionsWin.open({modal: true});
		} else {
			navWin = Ti.UI.iOS.createNavigationWindow({
    			modal: true,
				window: deliveryOptionsWin
			});
			navWin.open();
		}
	});
	self.addEventListener('closeDeliveryOptions',function(e) {
		deliveryOptions = e.options;
		if (deliveryOptions.signMessage && utmMessage.getText().indexOf('-' + _nickname) === -1) {
			utmMessage.setText(utmMessage.getText() + '\n\n-' + _nickname);
		} else if (!deliveryOptions.signMessage){
			utmMessage.setText(utmMessage.getText().replace('-' + _nickname,''));
		}
		if (utm.iPhone || utm.iPad) {
			navWin.close();
		}
	});
	self.add(optionsBtn);
	
	var sendButton = new StandardButton({title:'Send message'});
	self.add(sendButton);
	
	
	function getUtmMessage() {
		var params = {
			MyHortId: _message.selectedContacts[0].userData.MyHortId,
			PlainText: _message.message
		};
		
		var getMessagesPreviewReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					var utmText = response.UtmText;
					if (deliveryOptions.signMessage && utmText.indexOf('-' + _nickname) === -1) {
						utmText = utmText + '\n\n-' + _nickname;
					} else if (!deliveryOptions.signMessage){
						utmText = utmText.replace('-' + _nickname,'');
					}
					utmMessage.setText(utmText.trim());
					deliveryOptions.curRjCrypt = response.RjCrypt;
					self.hideAi();
					
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMessagesPreviewReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMessagesPreviewReq = null;
			},
			timeout : utm.netTimeout
		});
		getMessagesPreviewReq.open("POST", utm.serviceUrl + "EncryptMessage");
		getMessagesPreviewReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMessagesPreviewReq.send(params);
	}
	
	sendButton.addEventListener('click', function() {
		var messageType = getMessageSendTypes();
		if (messageType === '') {
			alert('You must choose at least one message type.');
			return;
		}

		var invalidRecips = checkMessageSendTypesForReceipents(_message.selectedContacts);
		if (invalidRecips !== '') {
			//Found issue that one or more users will not get the message because of the user chosen types
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : [L('ok_button'), L('cancel'), L('help')],
				message : 'Some of the people you have selected to receive this message will not get the message based on the message types you have chosen.  Do you want to continue and send the message anyway?',
				title : 'Message Delivery Problem'
			});

			dialog.addEventListener('click', function(e) {
				if (e.index !== e.source.cancel) {
					sendMessages(messageType);
				}
			});
			dialog.show();

		} else {
			//imagePreview.visible=false;
			self.showAi();
			sendMessages(messageType);
		}

	});
	
	function getMessageSendTypes() {
		var messageType = '';
		if (deliveryOptions.sms === true) {
			messageType += 'sms,';
		}
		if (deliveryOptions.email === true) {
			messageType += 'email,';	
		}
		if (deliveryOptions.twitter === true) {
			messageType += 'twitter,';
		}
		if (deliveryOptions.facebook === true) {
			messageType += 'fb,';
		}
		messageType = messageType.slice(0, -1);
		return messageType;
	}
	
	function checkMessageSendTypesForReceipents(sentToList) {
		var invalidRecips = '';
		for (var x = 0; x < sentToList.length; x++) {
			var typesOk = false;
			if (deliveryOptions.sms === true && sentToList[x].userData.HasMobile) {
				typesOk = true;
			}
			if (deliveryOptions.email === true && sentToList[x].userData.HasEmail) {
				typesOk = true;
			}
			if (deliveryOptions.twitter === true && utm.curUserCurMyHortHasTwitter) {
				typesOk = true;
			}
			if (deliveryOptions.sms === true && utm.curUserCurMyHortHasFacebook) {
				typesOk = true;
			}

			if (!typesOk) {
				invalidRecips += sentToList[x].nickName + ',';
			}
		}
		invalidRecips = invalidRecips.slice(0, -1);

		return invalidRecips;
	}
	
	function sendMessages(messageType) {
			
		if (_message.attachment != null) {		
			try {
				var sendImageSrc = Ti.Utils.base64encode(_message.attachment);
				var attachments = [{
					Attachment: sendImageSrc.toString(),
					MimeType: _message.attachment.mimeType,
					WasVirusScanned: true
				}];	
			} catch(err) {
				if (utm.Android) {
					alert("An error occured handling the photo.  Some Android phones don't support attaching photos directly form the camera.  Try attaching an image from a album.");
				} else {
					alert('An error occured handling the photo.');
				}
				return;
			}
		} else {
			var attachments = null;
		}
		

		var params = {
			MyHortId: _message.selectedContacts[0].userData.MyHortId,
			PlainText: _message.message,
			UtmText:  utmMessage.getText(),
			DeleteOnRead: deliveryOptions.deleteOnRead,
			RjCrypt: deliveryOptions.curRjCrypt,
			MessageType: messageType,
			FromUserId: utm.User.UserProfile.UserId,
			ToUserId: ((_message.mode === 'Reply') ? sendToIds[0] : utm.User.UserProfile.UserId), //messageData.FromUserId, // this appears to equal the sender????
			CopiedUsers: sendToIds, // array of userIDs
			ParrentMessageId: ((_message.mode === 'Reply') ? _message.messageID : null), // or null
			Attachments: attachments
		};
		
		utm.User.UserProfile.MessagesRemaining = utm.User.UserProfile.MessagesRemaining - sendToIds.length;
		
		var sendMessageReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				self.hideAi();
				if (this.status === 200 && response.Status === 'Success') {
					//alert('Your message has been sent.');
					for(var i=0; i<utm.winStack.length; i++) {
						utm.winStack[i].close();
					}
					utm.winStack = [];
					self.close();
				} else if (this.status === 200 && response.Status === 'Warning') {
					//alert('Your message has been sent.');
					for(var i=0; i<utm.winStack.length; i++) {
						utm.winStack[i].close();
					}
					utm.winStack = [];
					self.close();
				} else {
					alert('An error occured while sending your message.  One of the message services is down or not available.  Please try again.');
				}
				sendMessageReq = null;
	
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				sendMessageReq = null;
			},
			timeout : utm.netTimeout
		});
		sendMessageReq.open("POST", utm.serviceUrl + "SendMessage");
		sendMessageReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		sendMessageReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		sendMessageReq.timeout = params.attachments != null ? 20000 : utm.netTimeout;
		
		sendMessageReq.send(JSON.stringify(params));
		
		
	}
	
	return self;
};
module.exports = PreviewWin;

