var CreateGroupWin = function(_tabGroup) {
	

	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Create Group', '');

	var backButton = Ti.UI.createLabel({
		text: 'Back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close();
	});
	self.setLeftNavButton(backButton);
		
	var settingsView = Ti.UI.createScrollView ({
		height: utm.viewableArea - 60,
		top: 0,
		showVerticalScrollIndicator:true,
		contentHeight:'auto',
		layout: 'vertical'
	});
	self.add(settingsView);
	
	var focused = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	
	var groupLabel = Ti.UI.createLabel({
		text: 'Group name',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 10
	});
	settingsView.add(groupLabel);
	
	var groupField = Ti.UI.createTextField({
		value: '',
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 30,
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	groupField.addEventListener('focus', function() {
		groupField.add(focused);
	});
	groupField.addEventListener('blur', function() { 
		groupField.remove(focused);
	});
	settingsView.add(groupField);
	
	
	var saveButton = Ti.UI.createButton({
		title: 'Create group',
		bottom: 10,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});	
	saveButton.addEventListener('click', function() {
		createMyHort(groupField.getValue());
	});	
	self.add(saveButton);
	
	
	function createMyHort(_myHortName){
		var createMyHortReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				createMyHortReq = null;
				self.close();
			},
			onerror: function(e){
				utm.handleHttpError(e, this.status, this.responseText);
				createMyHortReq = null;
			}		
		});
		
		createMyHortReq.open("POST", utm.serviceUrl + "MyHort/CreateMyHortDetails");
		createMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		createMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		createMyHortReq.send(JSON.stringify({FriendlyName:_myHortName}));
	}

	
	
	return self;
};

module.exports = CreateGroupWin;

