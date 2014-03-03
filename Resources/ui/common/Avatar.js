var AvatarWin = function(_tabGroup) {
	var selectedAvatar = 0;
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Change Avatar', '');
	
	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	
	var scrollingView = Ti.UI.createScrollView({
		layout : 'vertical',
		height: utm.viewableArea - ((40*utm.sizeMultiplier)+20),
		top: utm.viewableTop,
		scrollType: 'vertical'
	});
	self.add(scrollingView);


	var avatarHeader = Ti.UI.createLabel({
		text: 'Choose your avatar',
		top: 15,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	scrollingView.add(avatarHeader);
	
	var avatarHolder = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		layout: 'horizontal',
		top: 0
	});
	
	var aAvatar = [];
	for (var i=0; i<16; i++) {
		aAvatar[i] = Ti.UI.createImageView({
			left: 8*utm.sizeMultiplier,
			right: 8*utm.sizeMultiplier,
			top: 16*utm.sizeMultiplier,
			image: '/images/avatar/'+ i +'.png',
			width: 70*utm.sizeMultiplier,
			height: 70*utm.sizeMultiplier,
			backgroundColor: 'white',
			borderColor: '#D4D4D4',
			borderWidth: 1*utm.sizeMultiplier,
			borderRadius: 2*utm.sizeMultiplier,
			avatar: i
		});
		aAvatar[i].addEventListener('click',function(e){
			for (var i=0; i<12; i++) {
				aAvatar[i].setBorderColor('#D4D4D4');
				aAvatar[i].setBorderWidth(1*utm.sizeMultiplier);
			}
			e.source.setBorderColor(utm.barColor);
			e.source.setBorderWidth(2*utm.sizeMultiplier);
			selectedAvatar = e.source.avatar;
		});
		avatarHolder.add(aAvatar[i]);
	}
	aAvatar[aAvatar.length-1].setRight(10*utm.sizeMultiplier);
	scrollingView.add(avatarHolder);

	aAvatar[utm.User.UserProfile.Avatar].fireEvent('click');
	
	var StandardButton = require('/ui/common/baseui/StandardButton');
	var saveButton = new StandardButton({title:'Save'});
	saveButton.addEventListener('click', function() {
		updateAvatar();
	});	
	self.add(saveButton);
	
	function updateAvatar() {
		var updateAvatarReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				utm.User.UserProfile.Avatar = selectedAvatar;
				self.close();
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
			},
			timeout : utm.netTimeout
		});
		updateAvatarReq.open("PUT", utm.serviceUrl + "Avatar/" + selectedAvatar);
		updateAvatarReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		updateAvatarReq.send();
	}
	
	

	return self;
};
module.exports = AvatarWin;

