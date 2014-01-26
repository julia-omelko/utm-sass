function MemberTableRow(rowData){
	var self = Ti.UI.createTableViewRow({
		className: 'row',
		height: (utm.Android ? '100dp' : 40),
		hasChild: true,
		memberData: rowData
	});
	
	var avatar = Ti.UI.createImageView({
		left: 10,
		top: 5,
		image: '/images/avatar/1.png',
		width: 30,
		height: 30,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	self.add(avatar);
	
	var nickName = Ti.UI.createLabel({
		text: rowData.NickName,
		font: {fontFamily: utm.fontFamily},
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 50
	});
	self.add(nickName);
	
	memberNote = Ti.UI.createView({
		right: 25,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		layout: 'vertical'
	});
	self.add(memberNote);
	
	if (rowData.MemberType === 'Invisible') {
		var invisibleText = Ti.UI.createLabel({
			text: 'Invisible',
			font: {fontFamily: utm.fontFamily},
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
			font: {fontFamily: utm.fontFamily},
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
 