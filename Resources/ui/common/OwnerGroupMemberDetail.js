var MemberGroupMemberDetailWin = function(_tabGroup,_memberData) {

	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Member Detail', '');

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
		height: utm.viewableArea - 110,
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
	
	var nicknameLabel = Ti.UI.createLabel({
		text: 'Nickname',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
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
	nicknameField.addEventListener('focus', function() {
		nicknameField.add(focused);
	});
	nicknameField.addEventListener('blur', function() { 
		nicknameField.remove(focused);
	});
	settingsView.add(nicknameField);
	
	var tableDataSettings = [];
	var tableViewSettings = Ti.UI.createTableView({
		top: 10,
		height: Ti.UI.SIZE,
		scrollable : false
	});
	settingsView.add(tableViewSettings);
	
	var invisibleRow = Ti.UI.createTableViewRow({
		height: (utm.Android ? '100dp' : 40),
		hasChild: false,
		selectedBackgroundColor: 'white',
		width: Ti.UI.FILL
	});
	var invisibleText = Ti.UI.createLabel({
		text:'Invisible to others',
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
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
	
	
	
	
	var deleteButton = Ti.UI.createButton({
		title: 'Delete from group',
		bottom: 60,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.barColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	deleteButton.addEventListener('click',function(e){
		removeFromGroup();
	});
	self.add(deleteButton);
	
	var saveButton = Ti.UI.createButton({
		title: 'Save',
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
		updateMyHortMemberData();
	});	
	self.add(saveButton);

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
			timeout : utm.netTimeout
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
					timeout : utm.netTimeout
				});
				deleteUserFromMyHortHttp.open("POST", utm.serviceUrl + "MyHort/DeleteUserFromMyHort?myhortMemberId=" + _memberData.Id);
				deleteUserFromMyHortHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				deleteUserFromMyHortHttp.setRequestHeader('Authorization-Token', utm.AuthToken);
				deleteUserFromMyHortHttp.send();
			}
		});
		dialog.show();
	}
	
	return self;
};

module.exports = MemberGroupMemberDetailWin;

