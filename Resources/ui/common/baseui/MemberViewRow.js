function MemberTableRow(rowData){
	var self = Ti.UI.createTableViewRow({
		className: 'row',
		height: 40*utm.sizeMultiplier,
		hasChild: true,
		memberData: rowData
	});
	
	var avatar = Ti.UI.createImageView({
		left: 10,
		top: 5,
		image: '/images/avatar/'+ rowData.Avatar +'.png',
		width: 30*utm.sizeMultiplier,
		height: 30*utm.sizeMultiplier,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	self.add(avatar);
	
	var nickName = Ti.UI.createLabel({
		text: rowData.NickName,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: (30*utm.sizeMultiplier)+20,
		color: utm.textColor
	});
	self.add(nickName);
	
	memberNote = Ti.UI.createView({
		left: Ti.Platform.displayCaps.platformWidth - (90*utm.sizeMultiplier),
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		layout: 'vertical'
	});
	self.add(memberNote);
	
	if (rowData.MyHortId !== utm.User.UserProfile.PrimaryMyHort && rowData.MemberType === 'Invisible') {
		var invisibleText = Ti.UI.createLabel({
			text: 'Invisible',
			font: {fontFamily: utm.fontFamily, fontSize:utm.fontSize},
			color: utm.secondaryTextColor,
			wordWrap: false,
			ellipsize: true,
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE
		});
		memberNote.add(invisibleText);
	}
	
	if (rowData.InviteCode != null) {
		var pendingText = Ti.UI.createLabel({
			text: 'Pending',
			font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
			color: utm.secondaryTextColor,
			wordWrap: false,
			ellipsize: true,
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE
		});
		memberNote.add(pendingText);
	}
	
	
    return self;
 }
 module.exports = MemberTableRow;
 