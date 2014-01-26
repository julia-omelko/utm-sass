var AvatarWin = function(_tabGroup) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Change Avatar', '');
	
	var backButton = Ti.UI.createLabel({
		text: 'back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close({animated:true});
	});
	self.setLeftNavButton(backButton);
	
	
	var scrollingView = Ti.UI.createScrollView({
		layout : 'vertical',
		height: 380,
		top: 0
	});
	self.add(scrollingView);


var avatarHeader = Ti.UI.createLabel({
		text: 'Choose your avatar',
		top: 15,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
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
	for (var i=0; i<12; i++) {
		aAvatar[i] = Ti.UI.createImageView({
			left: 8,
			right: 8,
			top: 16,
			image: '/images/avatar/'+ (i+1) +'.png',
			width: 70,
			height: 70,
			backgroundColor: 'white',
			borderColor: '#D4D4D4',
			borderWidth: 1,
			borderRadius: 2
		});
		aAvatar[i].addEventListener('click',function(e){
			for (var i=0; i<12; i++) {
				aAvatar[i].setBorderColor('#D4D4D4');
				aAvatar[i].setBorderWidth(1);
			}
			e.source.setBorderColor(utm.barColor);
			e.source.setBorderWidth(2);
		});
		avatarHolder.add(aAvatar[i]);
	}
	aAvatar[aAvatar.length-1].setRight(10);
	scrollingView.add(avatarHolder);





	var saveButton = Ti.UI.createButton({
		title: 'Save',
		bottom: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
	saveButton.addEventListener('click', function() {
		alert('save');
	});	
	self.add(saveButton);
	

	return self;
};
module.exports = AvatarWin;

