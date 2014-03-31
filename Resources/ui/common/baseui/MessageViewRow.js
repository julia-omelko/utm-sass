function MessageTableRow(rowData){
	
	if (rowData.ToAvatars !== null & (rowData.FromUserId === utm.User.UserProfile.UserId)) {
		Ti.API.info('sent message');
		Ti.API.info(rowData);
	}
	
	var self = Ti.UI.createTableViewRow({
		className: 'MessageTableRow',
		height: 80 * utm.sizeMultiplier,
		hasChild: true,
		messageData: rowData
	});
	
	if ('ToAvatars' in rowData && rowData.ToAvatars !== '<null>' && rowData.ToAvatars !== null && rowData.FromUserId === utm.User.UserProfile.UserId && rowData.ToAvatars.split(',').length > 1) {
		// sent message with multiple recipients
		var avatarHolder = Ti.UI.createView({
			left: 10 * utm.sizeMultiplier,
			top: 10 * utm.sizeMultiplier,
			width: 60 * utm.sizeMultiplier,
			height: 60 * utm.sizeMultiplier,
			layout: 'horizontal'
		});
		self.add(avatarHolder);
		var aAvatar = new Array();
		for (var i=0; i<Math.min(rowData.ToAvatars.split(',').length,3); i++) {
			aAvatar[i] = Ti.UI.createImageView({
				left: ((i === 1) ? 2 * utm.sizeMultiplier : 0),
				top: ((i === 2) ? 2 * utm.sizeMultiplier : 0),
				image: '/images/avatar/' + rowData.ToAvatars.split(',')[i] + '.png',
				width: 29 * utm.sizeMultiplier,
				height: 29 * utm.sizeMultiplier,
				backgroundColor: 'white',
				borderColor: '#D4D4D4',
				borderWidth: 1,
				borderRadius: 2
			});
			avatarHolder.add(aAvatar[i]);
		}
		if (rowData.ToAvatars.split(',').length === 4) {
			aAvatar[3] = Ti.UI.createImageView({
				left: 2 * utm.sizeMultiplier,
				top: 2 * utm.sizeMultiplier,
				image: '/images/avatar/' + rowData.ToAvatars.split(',')[3] + '.png',
				width: 29 * utm.sizeMultiplier,
				height: 29 * utm.sizeMultiplier,
				backgroundColor: 'white',
				borderColor: '#D4D4D4',
				borderWidth: 1,
				borderRadius: 2
			});
			avatarHolder.add(aAvatar[3]);
		} else if (rowData.ToAvatars.split(',').length > 4){
			aAvatar[3] = Ti.UI.createView({
				left: 2 * utm.sizeMultiplier,
				top: 2 * utm.sizeMultiplier,
				width: 29*utm.sizeMultiplier,
				height: 29*utm.sizeMultiplier,
				backgroundColor: 'white',
				borderColor: '#D4D4D4',
				borderWidth: 1,
				borderRadius: 2,
			});
			var moreLabel = Ti.UI.createLabel({
				text: '+' + (rowData.ToAvatars.split(',').length-3),
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
				color: utm.barColor,
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
			});
			aAvatar[3].add(moreLabel);
			avatarHolder.add(aAvatar[3]);
		}
		
	} else if ('ToAvatars' in rowData && rowData.ToAvatars !== '<null>' && rowData.ToAvatars !== null && rowData.FromUserId === utm.User.UserProfile.UserId && rowData.ToAvatars.split(',').length === 1) {
		// sent message with one recipient
		var avatar = Ti.UI.createImageView({
			left: 10 * utm.sizeMultiplier,
			top: 10 * utm.sizeMultiplier,
			image: '/images/avatar/' + rowData.ToAvatars + '.png',
			width: 60 * utm.sizeMultiplier,
			height: 60 * utm.sizeMultiplier,
			backgroundColor: 'white',
			borderColor: '#D4D4D4',
			borderWidth: 1,
			borderRadius: 2
		});
		self.add(avatar);
	} else {
		//received message		
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
	}
	
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
		width: Ti.UI.SIZE,
		right: 0,
		top: 0
	});
	textHeader.add(dateLabel);
	
	Ti.App.addEventListener('orientdisplay', function(evt) {
		dateLabel.setRight(0);
	});	
	
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
 