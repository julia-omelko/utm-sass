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
	
	var textHolder = Ti.UI.createView({
		top: 10,
		height: 60,
		width: Ti.UI.FILL,
		left: 80,
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
		text: rowData.FromUserName,
		font: {fontFamily: utm.fontFamily, fontWeight: (rowData.WasRead ? 'normal' : 'bold')},
		color: (rowData.WasRead ? utm.barColor : utm.color_org),
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-150),
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
		font: {fontFamily: utm.fontFamily},
		color: utm.secondaryTextColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: 80,
		left: (Ti.Platform.displayCaps.platformWidth-180),
		top: 0
	});
	textHeader.add(dateLabel);
	
	var utmLabel = Ti.UI.createLabel({
		text: rowData.UtmText.trim(),
		font: {fontFamily: utm.fontFamily},
		left: 0,
		width: (Ti.Platform.displayCaps.platformWidth-115),
		height: Ti.UI.FILL,
		ellipsize: true,
		color: utm.textColor,
		top: 2,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
	});
	textHolder.add(utmLabel);
	
    return self;
 }
 module.exports = MessageTableRow;
 