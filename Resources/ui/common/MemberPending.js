var MemberGroupMemberDetailWin = function(_tabGroup,_memberData,_myHortData) {
	var _myHortId = utm.User.UserProfile.PrimaryMyHort;
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Member Detail', '');

	var backButton = Ti.UI.createLabel({
		text: 'back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close();
	});
	self.setLeftNavButton(backButton);
		
	var scrollingView = Ti.UI.createScrollView ({
		height: utm.viewableArea - 110,
		top: 0,
		showVerticalScrollIndicator:true,
		contentHeight:'auto',
		layout: 'vertical'
	});
	self.add(scrollingView);
	
	

	
	var emailLabel = Ti.UI.createLabel({
		text: 'Email',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 25
	});
	scrollingView.add(emailLabel);
	
	var emailField = Ti.UI.createLabel({
		text: _memberData.EmailAddress,
		color: utm.textFieldColor,		
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		left: 35,
		top: 10,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	scrollingView.add(emailField);
	
	var inviteLabel = Ti.UI.createLabel({
		text: 'Invite expiration date',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 15
	});
	scrollingView.add(inviteLabel);
	
	var inviteDateText = Ti.UI.createLabel({
		text: getDateTimeFormat(_memberData.ExpireDate),
		color: utm.textFieldColor,		
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		left: 35,
		top: 10,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	scrollingView.add(inviteDateText);
	





	
	
	
	var deleteButton = Ti.UI.createButton({
		title: 'Cancel invite',
		bottom: 60,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.barColor,
		color: 'white'
	});
	deleteButton.addEventListener('click',function(e){
		deleteInvite();
	});
	self.add(deleteButton);
	
	var reinviteButton = Ti.UI.createButton({
		title: 'Reinvite',
		bottom: 10,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
	reinviteButton.addEventListener('click', function() {
		reinviteMyHort();
	});	
	self.add(reinviteButton);



	function deleteInvite() {
		var deletePendingReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					self.close();
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				deletePendingReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				deletePendingReq = null;
			},
			timeout : utm.netTimeout
		});
		deletePendingReq.open("DELETE", utm.serviceUrl + "MyHort/DeleteInvite/" + _memberData.Id);
		deletePendingReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deletePendingReq.send();
	}

	function reinviteMyHort() {
		
		var inviteMyHortReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload: function() {
				var json = this.responseData;
				self.hideAi();
				alert('Your invitation has been sent.');
				self.close();
				inviteMyHortReq = null;
			},
			onerror : function(e) {
				inviteMyHortReq = null;
			},
			timeout:utm.netTimeout
		});
		inviteMyHortReq.open("POST", utm.serviceUrl + "MyHort/Invite");
		inviteMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		inviteMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		var myHortInviteModel = {
			MyHortInfo: _myHortData,
			UsersToInvite: _memberData.EmailAddress,
			InviteMessage: 'You have been reinvited to YouThisMe.',
			FromNickName: utm.User.UserProfile.UserName,
			MemberType: _memberData.MemberType,
			InviteCode: 'autogen'
		};
		inviteMyHortReq.send(JSON.stringify(myHortInviteModel));
	}
	
	function getPrimaryMember(_members) {
		for (var ii=0; ii<_members.length; ii++) {
			if (_members[ii].MemberType === 'Primary') {
				return _members[ii];
			}
		}
	}

	
	return self;
};

module.exports = MemberGroupMemberDetailWin;

