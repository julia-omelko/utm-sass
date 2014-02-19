var MemberDetailWin = function(_tabGroup,_memberData) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Member Detail', true);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var composeButton = Ti.UI.createImageView({
		image: '/images/icons/compose.png',
		height: 22,
		width: 22
	});
	var composeMessage = function() {
		var selectedContacts = [{userData:_memberData}];
		var ComposeWin = require('/ui/common/Compose');
		var composeWin = new ComposeWin(_tabGroup,selectedContacts,'Send');
		utm.winStack.push(composeWin);
		_tabGroup.setActiveTab(0);
		_tabGroup.getTabs()[0].open(composeWin);
	};
	composeButton.addEventListener('click',function(e){
		Ti.App.fireEvent('app:getSubscriptionInfo',{callBack:'app:memberMessage'});
	});
	Ti.App.addEventListener('app:memberMessage',composeMessage);
	self.addEventListener('close',function(e){
		Ti.App.removeEventListener('app:memberMessage',composeMessage);
	});
	self.setRightNavButton(composeButton);
	
	
	var scrollingView = Ti.UI.createView({
		top: utm.viewableTop,
		width: Ti.UI.FILL,
		height: utm.viewableArea - ((40*2*utm.sizeMultiplier)+30),
		showVerticalScrollIndicator: true,
		contentHeight: 'auto',
		layout: 'vertical'
	});
	if (utm.Android) {
		scrollingView.setHeight(utm.viewableArea - ((40*2*utm.sizeMultiplier)+30) - utm.keyboardHeight);
	}
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
		width: 80*utm.sizeMultiplier,
		height: 80*utm.sizeMultiplier,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	userView.add(avatar);
	
	var nicknameLabel = Ti.UI.createLabel({
		text: 'Nickname',
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: (80*utm.sizeMultiplier)+20,
		top: 30
	});
	userView.add(nicknameLabel);
	
	var nicknameField = Ti.UI.createTextField({
		value: _memberData.NickName,
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-nicknameLabel.getLeft()-25),
		height: (utm.Android ? Ti.UI.SIZE : 30),
		left: nicknameLabel.getLeft(),
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 50*utm.sizeMultiplier,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
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
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
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
		width: Ti.UI.FILL,
		height: utm.viewableArea - 253,
		top: 10
	});
	scrollingView.add(tableView);
	var tableData = [];
	
	
	var StandardButton = require('/ui/common/baseui/StandardButton');
	var saveButton = new StandardButton({title:'Save'});
	saveButton.addEventListener('click', function() {
		saveMemberData();
	});	
	self.add(saveButton);
	
	var deleteButton = new StandardButton({title:'Delete member',bottom:(40*utm.sizeMultiplier)+20,type:'secondary'});
	deleteButton.addEventListener('click',function(e){
		confirmDeleteMember();
	});
	self.add(deleteButton);
	
	function saveMemberData() {
		_memberData.NickName = nicknameField.getValue();
		_memberData.MemberType = 'Secondary';
		
		var updateMemberReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				Ti.API.info(_memberData);
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
					if (_groups[i].MyHortId !== utm.User.UserProfile.PrimaryMyHort) {
						tableData[tableData.length] = Ti.UI.createTableViewRow({
							title: _groups[i].FriendlyName,
							height: 40*utm.sizeMultiplier,
							font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
							color: utm.secondaryTextColor
						});
						break;
					}
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
	
	// keyboard resizing
	if (utm.Android) {
		aHeight = [];
		self.addEventListener('postlayout',function(e){
			aHeight.push(self.rect.height);
			if (self.rect.height === (Math.min.apply(Math, aHeight))) {
				scrollingView.setHeight(utm.viewableArea - ((40*2*utm.sizeMultiplier)+30) - utm.keyboardHeight);
			} else {
				scrollingView.setHeight(utm.viewableArea - ((40*2*utm.sizeMultiplier)+30));
			}
		});
	}
	
	
	return self;
};
module.exports = MemberDetailWin;

