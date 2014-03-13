var ComposeWin = function(_tabGroup,_selectedContacts,_mode,_messageData) {
	if (_mode === 'Reply') {
		_messageID = _messageData.Id;
		_messageData.deliveryOptions =  null;
	} else {
		_messageID = null;
		_messageData = {deliveryOptions: null};
	}
	
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow(_mode, '');

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width: Ti.UI.FILL,
		height: utm.viewableArea - ((40*utm.sizeMultiplier)+20),
		scrollType: 'vertical',
		showVerticalScrollIndicator: true,
		contentHeight: 'auto',
		layout: 'vertical',
		top: utm.viewableTop,
		contentHeight: Ti.Platform.displayCaps.platformHeight*2
	});
	self.add(scrollingView);	
	
	var adjustscrollingView = function() {
		scrollingView.height = utm.viewableArea - ((40*utm.sizeMultiplier)+20);
	};
	Ti.App.addEventListener('orientdisplay', adjustscrollingView);
	
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
	
	var adjustleftView = function() {
		leftView.width = Ti.Platform.displayCaps.platformWidth-(80*utm.sizeMultiplier)-35;
	};
	Ti.App.addEventListener('orientdisplay', adjustleftView);
	
	var sendHeader = Ti.UI.createLabel({
		text: _mode + ' to:',
		top: 0,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	leftView.add(sendHeader);
	
	var sendTo = [];
	for (var i=0; i<_selectedContacts.length; i++) {
		sendTo[i] = _selectedContacts[i].userData.NickName;
	}
	sendTo = sendTo.join(', ');
	var sendLabel = Ti.UI.createLabel({
		text: sendTo,
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50-(80*utm.sizeMultiplier)-10,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: 'black'		
	});
	leftView.add(sendLabel);
	
	var adjustsendLabel = function() {
		sendLabel.width = Ti.Platform.displayCaps.platformWidth-50-(80*utm.sizeMultiplier)-10;
	};
	Ti.App.addEventListener('orientdisplay', adjustsendLabel);
	
	var messageHeader = Ti.UI.createLabel({
		text: 'Message:',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	leftView.add(messageHeader);
	
	
	var previewView = Ti.UI.createView({
		right: 25,
		height: 80*utm.sizeMultiplier,
		width: 80*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		backgroundColor: utm.barColor,
		borderColor: utm.barColor
	});
	var previewImage = Ti.UI.createImageView({
		image: '/images/icons/camera.png',
		height: 46*utm.sizeMultiplier,
		width: 46*utm.sizeMultiplier,
		autorotate: true
	});
	previewView.addEventListener('click',function(e){
		camera.captureImage();
	});
	previewView.add(previewImage);
	topView.add(previewView);	
	
	
	var Camera = require("/lib/Camera");
	var camera = new Camera(previewImage);
	

	var textAreaHeight;
	function calctextAreaHeight() {
		textAreaHeight = ((utm.Android) ? 80*utm.sizeMultiplier : (utm.viewableArea - 125 + 50 - ((40*utm.sizeMultiplier)+20) - utm.keyboardHeight));
		if (textAreaHeight < 80) {
			textAreaHeight = 80;
		}
	}
	calctextAreaHeight();
	
	/*var messageFieldMaxHeight = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: (utm.Android) ? 80*utm.sizeMultiplier : (utm.viewableArea - (216*utm.sizeMultiplier) + 50 - ((40*utm.sizeMultiplier)+20))
	});
	scrollingView.add(messageFieldMaxHeight);*/
	
	var messageField = Ti.UI.createTextArea({
		color: utm.textFieldColor,		
		width: Ti.Platform.displayCaps.platformWidth-50,
		height: textAreaHeight,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		suppressReturn: false,
		top: 15,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'},
	});
	
	var adjustmessageField = function() {
		messageField.width = Ti.Platform.displayCaps.platformWidth-50;
		calctextAreaHeight();
		messageField.height = textAreaHeight;
	};
	Ti.App.addEventListener('orientdisplay', adjustmessageField);
	
	var messageFocued = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	
	var adjustmessageFocued = function() {
		messageFocued.width = Ti.UI.FILL;
	};
	Ti.App.addEventListener('orientdisplay', adjustmessageFocued);
	
	var messageFieldHasFocus = false;
	
	messageField.addEventListener('focus', function() {
		messageField.add(messageFocued);
		messageFieldHasFocus = true;
		if ((utm.iPhone || utm.iPad) && utm.keyboardHeight !== 0) {
			previewBtn.setBottom(10+utm.keyboardHeight-50);
			scrollingView.setHeight(utm.viewableArea-60-utm.keyboardHeight+50);
		}
	});
	
	messageField.addEventListener('blur', function() { 
		messageField.remove(messageFocued);
		messageFieldHasFocus = false;
		if (utm.iPhone || utm.iPad) {
			previewBtn.setBottom(10);
			scrollingView.setHeight(utm.viewableArea-60);
		}
	});
	
	var adjustmessageFocusBlur = function() {
		if ((utm.iPhone || utm.iPad) && utm.keyboardHeight !== 0 && messageFieldHasFocus) {
			previewBtn.setBottom(10+utm.keyboardHeight-50);
			scrollingView.setHeight(utm.viewableArea-60-utm.keyboardHeight+50);
		} else if ((utm.iPhone || utm.iPad) && !messageFieldHasFocus) {
			previewBtn.setBottom(10);
			scrollingView.setHeight(utm.viewableArea-60);
		}
	};
	Ti.App.addEventListener('orientdisplay', adjustmessageFocusBlur);	
	
	messageField.addEventListener('change', function() { 
		self.monitorGuid();
		/*if (messageField.rect.height > maxHeight) {
			messageField.setHeight(maxHeight);
		}*/
	});
	

	scrollingView.add(messageField);
	

	var StandardButton = require('/ui/common/baseui/StandardButton');
	//if (utm.iPhone || utm.iPad) {
		var previewBtn = new StandardButton({title:'Preview'});
		self.add(previewBtn);
	/*} else {
		var previewBtn = Ti.UI.createButton({
			title: 'Preview',
			top: 15,
			width: (Ti.Platform.displayCaps.platformWidth-50),
			height: 40 * utm.sizeMultiplier,
			borderRadius: 20 * utm.sizeMultiplier,
			font:{fontFamily: utm.fontFamily, fontSize: utm.fontSize},
			backgroundColor: utm.buttonColor,
			color: 'white',
			style: null,
			zIndex: 1
		});	
		scrollingView.add(previewBtn);
	}*/
	
	previewBtn.addEventListener('click', function() {
		var message = {
			selectedContacts: _selectedContacts,
			mode: _mode,
			message: messageField.getValue(),
			messageID: _messageID,
			deliveryOptions: _messageData.deliveryOptions,
			attachment: camera.getImage(),
			thumbnail: camera.getThumbnail()
			//attachment: ((previewView.getHeight() !== 46*utm.sizeMultiplier) ? camera.getImage() : '')
		};
		var PreviewWin = require('/ui/common/Preview');
		var previewWin = new PreviewWin(_tabGroup,message);
		utm.winStack.push(previewWin);
		_tabGroup.getActiveTab().open(previewWin);
	});
	
	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('orientdisplay', adjustmessageFocued);
		Ti.App.removeEventListener('orientdisplay', adjustmessageField);
		Ti.App.removeEventListener('orientdisplay', adjustsendLabel);
		Ti.App.removeEventListener('orientdisplay', adjustleftView);
		Ti.App.removeEventListener('orientdisplay', adjustscrollingView);
		Ti.App.removeEventListener('orientdisplay', adjustmessageFocusBlur);
	});

	
	return self;
};
module.exports = ComposeWin;

