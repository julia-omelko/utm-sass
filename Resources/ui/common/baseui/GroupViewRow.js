function GroupTableRow(_groupData){
	var self = Ti.UI.createTableViewRow({
		className: 'row',
		height: 80*utm.sizeMultiplier,
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
		left: 10*utm.sizeMultiplier,
		top: 10*utm.sizeMultiplier,
		image: '/images/avatar/' + primaryAvatar + '.png',
		width: 60*utm.sizeMultiplier,
		height: 60*utm.sizeMultiplier,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	self.add(avatar);
	
	var groupName = Ti.UI.createLabel({
		text: _groupData.FriendlyName,
		font: {fontFamily: utm.fontFamily, fontWeight: 'bold', fontSize: utm.fontSize},
		color: (_groupData.IsOwner ? utm.color_org : utm.barColor),
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-150),
		left: (60*utm.sizeMultiplier)+(20*utm.sizeMultiplier),
		top: 10*utm.sizeMultiplier
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
				left: ((60*utm.sizeMultiplier)+(20*utm.sizeMultiplier)) + (aMembers.length*40*utm.sizeMultiplier),
				top: 40*utm.sizeMultiplier,
				image: '/images/avatar/' + _groupData.Members[i].Avatar + '.png',
				width: 30*utm.sizeMultiplier,
				height: 30*utm.sizeMultiplier,
				backgroundColor: 'white',
				borderColor: '#D4D4D4',
				borderWidth: 1,
				borderRadius: 2
			});
			self.add(aMembers[aMembers.length-1]);
			if (aMembers.length === 4 && listCount !== 4 && listCount !== 5 ) {
				aMembers[aMembers.length] = Ti.UI.createLabel({
					left: ((60*utm.sizeMultiplier)+20) + (aMembers.length*40*utm.sizeMultiplier),
					top: 40*utm.sizeMultiplier,
					text: '+' + (listCount-4),
					width: 30*utm.sizeMultiplier,
					height: 30*utm.sizeMultiplier,
					backgroundColor: 'white',
					borderColor: '#D4D4D4',
					borderWidth: 1,
					borderRadius: 2,
					font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
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
 