function BackButton(_parentWin){
	
	self = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		layout: 'horizontal'
	});
	
	var backChevron = Ti.UI.createImageView({
		image: 'images/chevron.png',
	});
	self.add(backChevron);
	
	var backText = Ti.UI.createLabel({
		text: 'Back',
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: 'white',
		left: 3,
		top: 3,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
	});
	self.add(backText);
	
	self.addEventListener('click',function(e){
		_parentWin.close();
	});
	
    return self;
 }
 module.exports = BackButton;
 