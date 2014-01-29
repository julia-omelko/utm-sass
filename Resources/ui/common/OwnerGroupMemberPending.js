var MemberGroupMemberDetailWin = function(_tabGroup,_memberData) {
	
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
	
	var userView = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth-50,
		left: 25,
		height: Ti.UI.SIZE
	});
	scrollingView.add(userView);
	
	var avatar = Ti.UI.createImageView({
		top: 25,
		left: 0,
		image: '/images/avatar/1.png',
		width: 80,
		height: 80,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	userView.add(avatar);
	
	var nicknameLabel = Ti.UI.createLabel({
		text: 'Email',
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
	
	var nicknameField = Ti.UI.createLabel({
		text: _memberData.EmailAddress,
		color: utm.textFieldColor,		
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		left: 115,
		top: 50,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	userView.add(nicknameField);
	
	var inviteLabel = Ti.UI.createLabel({
		text: 'Invite expiration date',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 100,
		top: 75
	});
	userView.add(inviteLabel);
	
	var inviteDateText = Ti.UI.createLabel({
		text: getDateTimeFormat(_memberData.ExpireDate),
		color: utm.textFieldColor,		
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		left: 115,
		top: 95,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	userView.add(inviteDateText);
	





	
	
	
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
	
	var saveButton = Ti.UI.createButton({
		title: 'Reinvite',
		bottom: 10,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
	saveButton.addEventListener('click', function() {
		alert('reinvite');
	});	
	self.add(saveButton);



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


	
	return self;
};

module.exports = MemberGroupMemberDetailWin;

