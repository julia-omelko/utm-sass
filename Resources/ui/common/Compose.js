var ComposeWin = function(_tabGroup,_selectedContacts,_mode,_messageID) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow(_mode, '');
	
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
		height: 380,
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
		text: _mode + ' to:',
		top: 0,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
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
		width: Ti.Platform.displayCaps.platformWidth-50-80-10,
		font: {fontFamily: utm.fontFamily},
		color: 'black'		
	});
	leftView.add(sendLabel);
	
	var messageHeader = Ti.UI.createLabel({
		text: 'Message:',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	leftView.add(messageHeader);
	
	
	var previewView = Ti.UI.createView({
		right: 25,
		height: 80,
		width: 80,
		borderRadius: 20,
		backgroundColor: utm.barColor,
		borderColor: utm.barColor
	});
	var previewImage = Ti.UI.createImageView({
		image: '/images/icons/camera.png',
		height: 46,
		width: 46
	});
	previewView.addEventListener('click',function(e){
		camera.captureImage();
	});
	previewView.add(previewImage);
	topView.add(previewView);	
	
	
	var Camera = require("/lib/Camera");
	var camera = new Camera(previewImage);
	
	
	
	
	var messageField = Ti.UI.createTextArea({
		color: utm.textFieldColor,		
		width: Ti.Platform.displayCaps.platformWidth-50,
		height: Ti.UI.SIZE,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 15,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: 16},
	});
	var messageFocued = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	messageField.addEventListener('focus', function() {
		messageField.add(messageFocued);
	});
	messageField.addEventListener('blur', function() { 
		messageField.remove(messageFocued);
	});
	var messageMinHeight = Ti.UI.createView({
		width: 1,
		height: 60,
		left: 0
	});
	messageField.add(messageMinHeight);
	scrollingView.add(messageField);
	

	
	
	
	
	
	
	
	
	
	var previewBtn = Ti.UI.createButton({
		title: 'Preview',
		bottom: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
	previewBtn.addEventListener('click', function() {
		var message = {
			selectedContacts: _selectedContacts,
			mode: _mode,
			message: messageField.getValue(),
			messageID: _messageID,
			attachment: ((previewView.getHight() !== 46) ? camera.getImage() : '')
		};
		var PreviewWin = require('/ui/common/Preview');
		var previewWin = new PreviewWin(_tabGroup,message);
		utm.winStack.push(previewWin);
		_tabGroup.getActiveTab().open(previewWin);
	});	
	self.add(previewBtn);
	
	return self;
};
module.exports = ComposeWin;

