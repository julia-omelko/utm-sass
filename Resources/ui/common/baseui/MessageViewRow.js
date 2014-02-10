function MessageTableRow(rowData){

	var self = Ti.UI.createTableViewRow({
		className: 'row',
		height: 80 * utm.sizeMultiplier,
		hasChild: true,
		messageData: rowData
	});
	
	var avatar = Ti.UI.createImageView({
		left: 10 * utm.sizeMultiplier,
		top: 10 * utm.sizeMultiplier,
		image: '/images/avatar/' + rowData.FromUsersAvatar + '.png',
		width: 60 * utm.sizeMultiplier,
		height: 60 * utm.sizeMultiplier,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	self.add(avatar);
	
	var textHolder = Ti.UI.createView({
		top: 8 * utm.sizeMultiplier,
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		left: 80 * utm.sizeMultiplier,
		layout: 'vertical'
	});
	self.add(textHolder);
	
	var textHeader = Ti.UI.createView({
		top: 0,
		left: 0,
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE
	});
	textHolder.add(textHeader);
	
	var fromLabel = Ti.UI.createLabel({
		text: ((rowData.FromUserId === utm.User.UserProfile.UserId) ? rowData.ToHeader.split(',').join(', ') : rowData.FromUserName),
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize, fontWeight: (rowData.WasRead ? 'normal' : 'bold')},
		color: (rowData.WasRead ? utm.barColor : utm.color_org),
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-(150 * utm.sizeMultiplier)),
		left: 0,
		top: 0
	});
	textHeader.add(fromLabel);
	
	
	var dateText = getDateTimeFormat(rowData.DateSent);
	dateText = dateText.replace(' minutes','m');
	dateText = dateText.replace(' hours','h');
	dateText = dateText.replace('an hour','1h');
	dateText = dateText.replace('a minute','1m');
	var dateLabel = Ti.UI.createLabel({
		text: dateText,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: 80 * utm.sizeMultiplier,
		left: (Ti.Platform.displayCaps.platformWidth-(180 * utm.sizeMultiplier)),
		top: 0
	});
	textHeader.add(dateLabel);
	
	var utmLabel = Ti.UI.createLabel({
		text: rowData.UtmText.trim(),
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		left: 0,
		width: (Ti.Platform.displayCaps.platformWidth-(115 * utm.sizeMultiplier)),
		height: Ti.UI.SIZE,
		ellipsize: true,
		wordWrap: true,
		color: utm.textColor,
		top: 1,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
	});
	textHolder.add(utmLabel);
	
    return self;
 }
 module.exports = MessageTableRow;
 