function MessageTableRow(rowData){
	var self = Ti.UI.createTableViewRow({
		className: 'row',
		height: (utm.Android ? '100dp' : 80),
		hasChild: true,
		messageData: rowData
	});
	
	var avatar = Ti.UI.createImageView({
		left: 10,
		top: 10,
		image: '/images/avatar/' + rowData.FromUsersAvatar + '.png',
		width: 60,
		height: 60,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	self.add(avatar);
	
	var fromLabel = Ti.UI.createLabel({
		text: rowData.FromUserName,
		font: {fontFamily: utm.fontFamily, fontWeight: (rowData.WasRead ? 'normal' : 'bold')},
		color: (rowData.WasRead ? utm.barColor : utm.color_org),
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-150),
		left: 80,
		top: 11
	});
	self.add(fromLabel);
	
	
	var dateText = getDateTimeFormat(rowData.DateSent);
	dateText = dateText.replace(' minutes','m');
	dateText = dateText.replace(' hours','h');
	dateText = dateText.replace('an hour','1h');
	dateText = dateText.replace('a minute','1m');
	var dateLabel = Ti.UI.createLabel({
		text: dateText,
		font: {fontFamily: utm.fontFamily},
		color: utm.secondaryTextColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: 80,
		left: 230,
		top: 11
	});
	self.add(dateLabel);
	
	var utmLabel = Ti.UI.createLabel({
		text: rowData.UtmText.trim(),
		font: {fontFamily: utm.fontFamily},
		left: 80,
		width: (Ti.Platform.displayCaps.platformWidth-115),
		height: 50,
		ellipsize: true,
		color: utm.textColor,
		top: 28,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
	});
	self.add(utmLabel);
	
    return self;
 }
 module.exports = MessageTableRow;
 