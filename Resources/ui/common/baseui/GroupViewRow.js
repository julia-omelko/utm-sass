function GroupTableRow(_groupData){
	var self = Ti.UI.createTableViewRow({
		className: 'row',
		height: (utm.Android ? '100dp' : 80),
		hasChild: true,
		groupData: _groupData
	});
	
	var primaryAvatar = 0;
	for (var i=0; i<_groupData.Members.length; i++) {
		if (_groupData.Members[i].MemberType === 'Primary') {
			primaryAvatar = _groupData.Members[i].Avatar;
			break;
		}
	}
	var avatar = Ti.UI.createImageView({
		left: 10,
		top: 10,
		image: '/images/avatar/' + primaryAvatar + '.png',
		width: 60,
		height: 60,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	self.add(avatar);
	
	var groupName = Ti.UI.createLabel({
		text: _groupData.FriendlyName,
		font: {fontFamily: utm.fontFamily, fontWeight: 'bold'},
		color: (_groupData.IsOwner ? utm.color_org : utm.barColor),
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-150),
		left: 80,
		top: 11
	});
	self.add(groupName);
	
	var listCount = 0;
	for (var i=0; i<_groupData.Members.length; i++) {
		if (_groupData.Members[i].MemberType === 'Secondary' || _groupData.Members[i].MemberType === 'Visible' || (_groupData.IsOwner && _groupData.Members[i].MemberType === 'Invisible')) {
			listCount = listCount+1;
		}
	}
	
	var aMembers = [];
	var count = 0;
	for (var i=0; i<_groupData.Members.length; i++) {
		if (_groupData.Members[i].MemberType === 'Secondary' || _groupData.Members[i].MemberType === 'Visible' || (_groupData.IsOwner && _groupData.Members[i].MemberType === 'Invisible')) {
			aMembers[aMembers.length] = Ti.UI.createImageView({
				left: 80 + (aMembers.length*40),
				top: 40,
				image: '/images/avatar/' + _groupData.Members[i].Avatar + '.png',
				width: 30,
				height: 30,
				backgroundColor: 'white',
				borderColor: '#D4D4D4',
				borderWidth: 1,
				borderRadius: 2
			});
			self.add(aMembers[aMembers.length-1]);
			if (aMembers.length === 4 && listCount !== 4 && listCount !== 5 ) {
				aMembers[aMembers.length] = Ti.UI.createLabel({
					left: 80 + (aMembers.length*40),
					top: 40,
					text: '+' + (listCount-4),
					width: 30,
					height: 30,
					backgroundColor: 'white',
					borderColor: '#D4D4D4',
					borderWidth: 1,
					borderRadius: 2,
					font: {fontFamily: utm.fontFamily},
					color: utm.barColor,
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
				});
				self.add(aMembers[aMembers.length-1]);
				break;
			}
		}
	}
	
    return self;
 }
 module.exports = GroupTableRow;
 