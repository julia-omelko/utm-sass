var MemberGroupMemberDetailWin = function(_tabGroup,_memberData) {

	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Member Detail', '');

	var updateDisplay = function() {
		self.fireEvent('reorientdisplay');
	};
	Ti.App.addEventListener('orientdisplay', updateDisplay);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
		
	var settingsView = Ti.UI.createScrollView ({
		height: utm.viewableArea - (utm.Android ? 0: ((40*2*utm.sizeMultiplier)+30)),
		top: utm.viewableTop,
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
	
	var nicknameLabel = Ti.UI.createLabel({
		text: 'Nickname',
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 10
	});
	settingsView.add(nicknameLabel);
	
	var nicknameField = Ti.UI.createTextField({
		value: _memberData.NickName,
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: (utm.Android ? Ti.UI.SIZE : 30),
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	nicknameField.addEventListener('focus', function() {
		nicknameField.add(focused);
	});
	nicknameField.addEventListener('blur', function() { 
		nicknameField.remove(focused);
	});
	settingsView.add(nicknameField);
	
	self.addEventListener('reorientdisplay', function(evt) {
		nicknameField.width = (Ti.Platform.displayCaps.platformWidth-50);
	});
	
	var tableDataSettings = [];
	var tableViewSettings = Ti.UI.createTableView({
		top: 10,
		height: Ti.UI.SIZE,
		scrollable : false
	});
	settingsView.add(tableViewSettings);
	
	var invisibleRow = Ti.UI.createTableViewRow({
		height: 40*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white',
		width: Ti.UI.FILL
	});
	
	self.addEventListener('reorientdisplay', function(evt) {
		invisibleRow.width = Ti.UI.FILL;
	});
	
	var invisibleText = Ti.UI.createLabel({
		text:'Invisible to others',
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor,
		left: 15
	});
	var invisibleSwitch = Ti.UI.createSwitch({
		right: 25,
		value: ((_memberData.MemberType === 'Invisible') ? true : false)
	});
	invisibleRow.add(invisibleText);
	invisibleRow.add(invisibleSwitch);
	tableDataSettings[0] = invisibleRow;
	
	tableViewSettings.setData(tableDataSettings);
	
	settingsView.add(tableViewSettings);
	
	var StandardButton = require('/ui/common/baseui/StandardButton');
	var deleteButton = new StandardButton({title:'Delete from group',bottom:(40*utm.sizeMultiplier)+20,type:'secondary'});
	deleteButton.addEventListener('click',function(e){
		removeFromGroup();
	});

	if (utm.Android) {
		//Can't add button to window because Android keyboard makes window smaller, so add to view for Android
		settingsView.add(deleteButton);
		deleteButton.top = 10;
		deleteButton.bottom = 0;  
	} else {	
		self.add(deleteButton);
	}
	
	var saveButton = new StandardButton({title:'Save'});
	saveButton.addEventListener('click', function() {
		updateMyHortMemberData();
	});	

	if (utm.Android) {
		//Can't add button to window because Android keyboard makes window smaller, so add to view for Android
		settingsView.add(saveButton);
		saveButton.top = 10;
		saveButton.bottom = 0;  
	} else {	
		self.add(saveButton);
	}

	function updateMyHortMemberData() {
		_memberData.NickName = nicknameField.getValue();
		if (_memberData.MemberType !== 'Primary'){
			if (invisibleSwitch.getValue()) {
				_memberData.MemberType = 'Invisible';
			} else {
				_memberData.MemberType = 'Secondary';
			}
		}
		
		var updateMemberDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				if (this.status === 200) {
					self.close();
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				updateMemberDetailReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				updateMemberDetailReq = null;
			},
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
		});	
		updateMemberDetailReq.open("POST", utm.serviceUrl + "MyHort/UpdateMyHortMember");
		updateMemberDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		updateMemberDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		updateMemberDetailReq.send(JSON.stringify(_memberData));
	}

	function removeFromGroup() {
		var dialog = Ti.UI.createAlertDialog({
			cancel: 1,
			buttonNames: [L('yes'), L('cancel')],
			message: 'Are you sure you want to remove this member?',
			title: L('Remove Member')
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {
				//Ti.API.info('The cancel button was clicked');
			} else {					
				var deleteUserFromMyHortHttp = Ti.Network.createHTTPClient({
					validatesSecureCertificate: utm.validatesSecureCertificate,
					onload : function() {
						deleteUserFromMyHortHttp = null;
						self.close();
					},
					onerror : function(err) {
						utm.handleHttpError({}, this.status, this.responseText);
						deleteUserFromMyHortHttp = null;
					},
					timeout : utm.netTimeout,
					enableKeepAlive : utm.keepAlive
				});
				deleteUserFromMyHortHttp.open("POST", utm.serviceUrl + "MyHort/DeleteUserFromMyHort?myhortMemberId=" + _memberData.Id);
				deleteUserFromMyHortHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				deleteUserFromMyHortHttp.setRequestHeader('Authorization-Token', utm.AuthToken);
				deleteUserFromMyHortHttp.send();
			}
		});
		dialog.show();
	}

	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('orientdisplay', updateDisplay);
	});
	
	return self;
};

module.exports = MemberGroupMemberDetailWin;

