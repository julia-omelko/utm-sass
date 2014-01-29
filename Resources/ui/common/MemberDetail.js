var MemberDetailWin = function(_tabGroup,_memberData) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Member Detail', true);
	
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
		top: 0,
		width: Ti.UI.FILL,
		height: utm.viewableArea - 69,
		showVerticalScrollIndicator: true,
		contentHeight: 'auto',
		layout: 'vertical'
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
		image: '/images/avatar/' + _memberData.Avatar + '.png',
		width: 80,
		height: 80,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	userView.add(avatar);
	
	var nicknameLabel = Ti.UI.createLabel({
		text: 'Nickname',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 100,
		top: 30
	});
	userView.add(nicknameLabel);
	
	var nicknameField = Ti.UI.createTextField({
		value: _memberData.NickName,
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-100-25),
		height: 30,
		left: 100,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 50,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	var focused = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	nicknameField.addEventListener('focus', function() {
		nicknameField.add(focused);
	});
	nicknameField.addEventListener('blur', function() { 
		nicknameField.remove(focused);
	});
	userView.add(nicknameField);

	var groupLabel = Ti.UI.createLabel({
		text: 'Groups',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 15
	});
	scrollingView.add(groupLabel);
	
	var tableView = Ti.UI.createTableView({
		height: 200,
		width: '100%',
		top: 15
	});
	scrollingView.add(tableView);
	var tableData = [];
	
	var saveButton = Ti.UI.createButton({
		title: 'Save',
		bottom: 15,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
	saveButton.addEventListener('click', function() {
		saveMemberData();
	});	
	self.add(saveButton);
	
	var deleteButton = Ti.UI.createButton({
		title: 'Delete member',
		bottom: 60,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.barColor,
		color: 'white'
	});
	deleteButton.addEventListener('click',function(e){
		confirmDeleteMember();
	});
	self.add(deleteButton);
	
	function saveMemberData() {
		_memberData.NickName = nicknameField.getValue();
		
		var updateMemberReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				if (this.status === 200) {
					self.close();
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				updateMemberReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				updateMemberReq = null;
			},
			timeout : utm.netTimeout
		});
		
		updateMemberReq.open("POST", utm.serviceUrl + "MyHort/UpdateMyHortMember");
		updateMemberReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		updateMemberReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		updateMemberReq.send(JSON.stringify(_memberData));
	}
	
	
	
	function confirmDeleteMember() {
		var dialog = Ti.UI.createAlertDialog({
			cancel: 1,
			buttonNames: ['Yes', L('cancel')],
			message: 'This will remove this member.  Do you want to continue?',
			title: 'Confirm delete'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				deleteMember();
			}
		});
		dialog.show();
	};
	
	function deleteMember() {
		var deleteMemberReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				if (this.status === 200) {
					self.close();
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				deleteMyHortReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				deleteMyHortReq = null;
			},
			timeout : utm.netTimeout
		});
		
		deleteMemberReq.open("POST", utm.serviceUrl + "MyHort/DeleteUserFromMyHort?myhortMemberId=" + _memberData.Id);
		deleteMemberReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMemberReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMemberReq.send();
	}
	
	
	
	
	function populateTable(_groups) {
		for (var i=0; i<_groups.length; i++) {
			for (var j=0; j<_groups[i].Members.length; j++) {
				if (_groups[i].Members[j].UserId === _memberData.UserId) {
					tableData[tableData.length] = Ti.UI.createTableViewRow({
						title: _groups[i].FriendlyName,
						height: 40,
						font: {fontFamily: utm.fontFamily}
					});
					break;
				}
			}
		}
		tableView.setData(tableData);
		self.hideAi();
	}
	
	function loadMyHorts() {
		var getMyHortsReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				if (this.status === 200) {
					var response = eval('(' + this.responseText + ')');
					if (response !== null) {
						populateTable(response);
					}
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMyHortsReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMyHortsReq = null;
			},
			timeout : utm.netTimeout
		});
		getMyHortsReq.open("GET", utm.serviceUrl + "MyHort?$orderby=FriendlyName");
		getMyHortsReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsReq.send();
	};
	loadMyHorts();
	
	
	return self;
};
module.exports = MemberDetailWin;

