var PreviewWin = function(_tabGroup,_message) {
	_myHortId = _message.selectedContacts[0].userData.MyHortId;
	_nickname = '';
	var deliveryOptions = {
		sms: false,
		email: true,
		twitter: false,
		facebook: false,
		signMessage: false,
		deleteOnRead: true,
		curRjCrypt: ''
	};
	var deliveryEnabled = {
		sms: false,
		email: true,
		twitter: false,
		facebook: false
	};
	
	function loadMyHortDetail() {
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					myHortData = response;
					if (myHortData.PrimaryUser.FaceBook !== '') {
						deliveryEnabled.facebook = true;
					}
					if (myHortData.PrimaryUser.TwitterSecret !== '') {
						deliveryEnabled.twitter = true;
					}
					if (myHortData.PrimaryUser.Mobile) {
						deliveryEnabled.sms = true;
					}
					deliveryOptions.signMessage = myHortData.PrimaryUser.AddNicknameToUtms;
										
					_nickname = myHortData.PrimaryUser.NickName;
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
	
	loadMyHortDetail();
	
	
	

	for (var i=0; i<_message.selectedContacts.length; i++) {
		if (typeof _message.selectedContacts[i].userData !== 'undefined') {
			if (typeof _message.selectedContacts[i].userData.HasMobile !== 'undefined' && _message.selectedContacts[i].userData.HasMobile) {
				deliveryOptions.sms = true;
				deliveryEnabled.sms = true;
			}
			if (typeof _message.selectedContacts[i].userData.HasTwitter !== 'undefined' && _message.selectedContacts[i].userData.HasTwitter) {
				deliveryOptions.twitter = true;
				deliveryEnabled.twitter = true;
			}
			if (typeof _message.selectedContacts[i].userData.HasFacebook !== 'undefined' && _message.selectedContacts[i].userData.HasFacebook) {
				deliveryOptions.facebook = true;
				deliveryEnabled.facebook = true;
			}
		}
	}

	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Preview', true);
	
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
		width: '100%',
		height: utm.viewableArea - 110,
		showVerticalScrollIndicator: true,
		contentHeight: 'auto',
		layout: 'vertical',
		top: 0
	});
	self.add(scrollingView);
	
	var topView = Ti.UI.createView({
		width: '100%',
		height: Ti.UI.SIZE,
		top: 25
	});
	scrollingView.add(topView);
	var leftView = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth-80-35,
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
		font: {fontFamily: utm.fontFamily, fontSize: 18},
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
		font: {fontFamily: utm.fontFamily},
		color: 'black'		
	});
	leftView.add(sendLabel);
	
	var messageHeader = Ti.UI.createLabel({
		text: 'Original Message:',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	leftView.add(messageHeader);

	if ("attachment" in _message && _message.attachment != null) {
		var previewView = Ti.UI.createView({
			right: 25,
			height: 80,
			width: 80,
			borderRadius: 20,
			backgroundColor: utm.barColor,
			borderColor: utm.barColor
		});
		var previewImage = Ti.UI.createImageView({
			image: _message.attachment,
			height: 80,
			width: 80
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
		font: {fontFamily: utm.fontFamily},
		color: 'black'		
	});
	scrollingView.add(messageField);
	
	var messageHeader = Ti.UI.createLabel({
		text: 'UTM Message:',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	scrollingView.add(messageHeader);
	
	var utmMessage = Ti.UI.createLabel({
		text: '',
		top: 10,
		left: 25,
		height: 75,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily},
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
		color: 'black'		
	});
	scrollingView.add(utmMessage);
	
	var utmRefresh = Ti.UI.createImageView({
		image: '/images/icons/refresh.png',
		left: (Ti.Platform.displayCaps.platformWidth-40)/2,
		top: 0,
		height: 40,
		width: 40,
		borderRadius: 20,
		backgroundColor: utm.buttonColor,
	});
	utmRefresh.addEventListener('click',function(e){
		self.showAi();
		getUtmMessage();
	});
	scrollingView.add(utmRefresh);	
	

	

	
	
	
	
	
	
	
	var optionsBtn = Ti.UI.createButton({
		title: 'Delivery options',
		bottom: 60,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.barColor,
		color: 'white'
	});	
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
		if (deliveryOptions.signMessage && utmMessage.getText().indexOf('\n- ' + _nickname) === -1) {
			utmMessage.setText(utmMessage.getText() + '\n- ' + _nickname);
		} else if (!deliveryOptions.signMessage){
			utmMessage.setText(utmMessage.getText().replace('\n- ' + _nickname,''));
		}
		if (utm.iPhone || utm.iPad) {
			navWin.close();
		}
	});
	self.add(optionsBtn);
	
	var sendButton = Ti.UI.createButton({
		title: 'Send message',
		bottom: 10,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
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
					if (deliveryOptions.signMessage) {
						utmText = utmText + '\n- ' + _nickname;
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
				alert(err);
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
					alert('Your message has been sent.');
					for(var i=0; i<utm.winStack.length; i++) {
						utm.winStack[i].close();
					}
					utm.winStack = [];
					self.close();
				} else if (this.status === 200 && response.Status === 'Warning') {
					alert('Your message has been sent.');
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

