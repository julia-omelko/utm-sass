var ComposeWin = function(_tabGroup,_selectedContacts,_mode,_messageData) {
	
	//Ti.API.info(_messageData);
	
	if (_mode === 'Reply') {
		_messageID = _messageData.Id;
		_messageData.deliveryOptions =  null;
	} else {
		_messageID = null;
		_messageData = {deliveryOptions: null};
	}
	
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow(_mode, '');
	
	var updateDisplay = function() {
		self.fireEvent('reorientdisplay');
	};
	Ti.App.addEventListener('orientdisplay', updateDisplay);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width: Ti.UI.FILL,
		height: utm.viewableArea - (utm.Android ? 0 : (40*utm.sizeMultiplier)+20),
		scrollType: 'vertical',
		showVerticalScrollIndicator: true,
//		contentHeight: 'auto',
		layout: 'vertical',
		top: utm.viewableTop,
		contentHeight: Ti.Platform.displayCaps.platformHeight*2
	});
	self.add(scrollingView);	
	

	self.addEventListener('reorientdisplay', function(e) {
		scrollingView.height = utm.viewableArea - ((40*utm.sizeMultiplier)+20);
	});
	
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
	
	self.addEventListener('reorientdisplay', function(e) {
		leftView.width = Ti.Platform.displayCaps.platformWidth-(80*utm.sizeMultiplier)-35;
	});
	
	var sendHeader = Ti.UI.createLabel({
		text: _mode + ' to:',
		top: 0,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	leftView.add(sendHeader);
	
	var sendTo = [];
	if (_mode === 'Reply') {
		sendTo = _messageData.FromUserName;
		_selectedContacts[0].userData.NickName = _messageData.FromUserName;
	} else {
		for (var i=0; i<_selectedContacts.length; i++) {
			sendTo[i] = _selectedContacts[i].userData.NickName;
		}
		sendTo = sendTo.join(', ');
	}
	var sendLabel = Ti.UI.createLabel({
		text: sendTo,
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50-(80*utm.sizeMultiplier)-10,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: 'black'		
	});
	leftView.add(sendLabel);
	
	self.addEventListener('reorientdisplay', function(e) {
		sendLabel.width = Ti.Platform.displayCaps.platformWidth-50-(80*utm.sizeMultiplier)-10;
	});
	
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
	
	self.addEventListener('reorientdisplay', function(e) {
		messageField.width = Ti.Platform.displayCaps.platformWidth-50;
		calctextAreaHeight();
		messageField.height = textAreaHeight;
	});
	
	var messageFocued = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	
	self.addEventListener('reorientdisplay', function(e) {
		messageFocued.width = Ti.UI.FILL;
	});
	
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
	
	self.addEventListener('reorientdisplay', function(e) {
		if ((utm.iPhone || utm.iPad) && utm.keyboardHeight !== 0 && messageFieldHasFocus) {
			previewBtn.setBottom(10+utm.keyboardHeight-50);
			scrollingView.setHeight(utm.viewableArea-60-utm.keyboardHeight+50);
		} else if ((utm.iPhone || utm.iPad) && !messageFieldHasFocus) {
			previewBtn.setBottom(10);
			scrollingView.setHeight(utm.viewableArea-60);
		}
	});	
	
	messageField.addEventListener('change', function() { 
		self.monitorGuid();
		/*if (messageField.rect.height > maxHeight) {
			messageField.setHeight(maxHeight);
		}*/
	});
	

	scrollingView.add(messageField);
	
	//Business rule: If replying to a message that was NOT set to "delete on read", include the original message text in the reply
	if (!_messageData.DeleteOnRead && _mode === 'Reply') {
		
		var sentDate = moment(_messageData.DateSent);
		
		messageField.value =  '\n\n On '+sentDate.format("M/D/YY")+ '  ' + _messageData.FromUserName + '  Wrote:\n  >' + _messageData.replingToMessageText +'';
		messageField.setSelection(0, 0);
	}

	var StandardButton = require('/ui/common/baseui/StandardButton');
	var previewBtn = new StandardButton({title:'Preview'});
	
	if (utm.Android) {
	//Can't add button to window because Android keyboard makes window smaller, so add to view
		previewBtn.top = 10;
		scrollingView.add(previewBtn);
	} else {
		self.add(previewBtn);
	}
	
	previewBtn.addEventListener('click', function() {
		var message = {
			selectedContacts: _selectedContacts,
			mode: _mode,
			message: messageField.getValue(),
			messageID: _messageID,
			deliveryOptions: _messageData.deliveryOptions,
			attachment: camera.getImage(),
			thumbnail: camera.getThumbnail(),
			FromUserName: _messageData.FromUserName
			//attachment: ((previewView.getHeight() !== 46*utm.sizeMultiplier) ? camera.getImage() : '')
		};
		var PreviewWin = require('/ui/common/Preview');
		var previewWin = new PreviewWin(_tabGroup,message);
		utm.winStack.push(previewWin);
		_tabGroup.getActiveTab().open(previewWin);
	});
	
	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('orientdisplay', updateDisplay);
	});

	
	return self;
};
module.exports = ComposeWin;