var DeliveryOptionsWin = function(_win,_options,_enabled) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Delivery Options', '');

	var backButton = Ti.UI.createLabel({
		text: 'Done',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		_win.fireEvent('closeDeliveryOptions',{
			options: _options
		});
		if (utm.Android) {
			self.close({animated:true});
		}
	});
	self.setRightNavButton(backButton);
	
	var tableData = [];
	var tableView = Ti.UI.createTableView({
		top: utm.viewableTop
	});
	self.add(tableView);
	
	
	var deliverSection = Ti.UI.createTableViewSection({ headerTitle: 'Deliver by' });
	
	var smsRow = Ti.UI.createTableViewRow({
		height: 50*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
	});
	var smsIcon = Ti.UI.createImageView({
		image: '/images/icons/message.png',
		height: 30*utm.sizeMultiplier,
		width: 30*utm.sizeMultiplier,
		left: 25
	});
	var smsSwitch = Ti.UI.createSwitch({
		right: 25,
		value: _options.sms,
		enabled: _enabled.sms
	});
	smsRow.add(smsIcon);
	smsRow.add(smsSwitch);
	deliverSection.add(smsRow);
	
	var emailRow = Ti.UI.createTableViewRow({
		height: 50*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
	});
	var emailIcon = Ti.UI.createImageView({
		image: '/images/icons/mail.png',
		height: 30*utm.sizeMultiplier,
		width: 30*utm.sizeMultiplier,
		left: 25
	});
	var emailSwitch = Ti.UI.createSwitch({
		right: 25,
		value: _options.email,
		enabled: _enabled.email
	});
	emailRow.add(emailIcon);
	emailRow.add(emailSwitch);
	deliverSection.add(emailRow);
	
	
	var postSection = Ti.UI.createTableViewSection({ headerTitle: 'Post to my' });
	
	var twitterRow = Ti.UI.createTableViewRow({
		height: 50*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
	});
	var twitterIcon = Ti.UI.createImageView({
		image: '/images/icons/twitter.png',
		height: 30*utm.sizeMultiplier,
		width: 30*utm.sizeMultiplier,
		left: 25
	});
	var twitterSwitch = Ti.UI.createSwitch({
		right: 25,
		value: _options.twitter,
		enabled: _enabled.twitter
	});
	twitterRow.add(twitterIcon);
	twitterRow.add(twitterSwitch);
	postSection.add(twitterRow);
	
	var fbRow = Ti.UI.createTableViewRow({
		height: 50*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
	});
	var fbIcon = Ti.UI.createImageView({
		image: '/images/icons/facebook.png',
		height: 30*utm.sizeMultiplier,
		width: 30*utm.sizeMultiplier,
		left: 25
	});
	var fbSwitch = Ti.UI.createSwitch({
		right: 25,
		value: _options.facebook,
		enabled: _enabled.facebook
	});
	fbRow.add(fbIcon);
	fbRow.add(fbSwitch);
	postSection.add(fbRow);
	
	var additionalSection = Ti.UI.createTableViewSection({ headerTitle: 'Additional' });
	
	var signRow = Ti.UI.createTableViewRow({
		height: 50*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
	});
	var signLabel = Ti.UI.createLabel({
		text: 'Sign message',
		width: Ti.UI.SIZE,
		height: Ti.UI.FILL,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor
	});
	var signSwitch = Ti.UI.createSwitch({
		value: _options.signMessage,
		right: 25
	});
	signRow.add(signLabel);
	signRow.add(signSwitch);
	additionalSection.add(signRow);
	
	var deleteRow = Ti.UI.createTableViewRow({
		height: 40*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
	});
	var deleteLabel = Ti.UI.createLabel({
		text: 'Delete message when read',
		width: Ti.UI.SIZE,
		left: 25,
		height: Ti.UI.FILL,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor
	});
	var deleteSwitch = Ti.UI.createSwitch({
		value: _options.deleteOnRead,
		right: 25
	});
	deleteRow.add(deleteLabel);
	deleteRow.add(deleteSwitch);
	additionalSection.add(deleteRow);
	
	tableData.push(deliverSection);
	tableData.push(postSection);
	tableData.push(additionalSection);
	tableView.setData(tableData);
	
	
	smsSwitch.addEventListener('change',function(e){
		_options.sms = smsSwitch.getValue();
	});
	emailSwitch.addEventListener('change',function(e){
		_options.email = emailSwitch.getValue();
	});
	twitterSwitch.addEventListener('change',function(e){
		_options.twitter = twitterSwitch.getValue();
	});
	fbSwitch.addEventListener('change',function(e){
		_options.facebook = fbSwitch.getValue();
	});
	signSwitch.addEventListener('change',function(e){
		_options.signMessage = signSwitch.getValue();
	});
	deleteSwitch.addEventListener('change',function(e){
		_options.deleteOnRead = deleteSwitch.getValue();
	});
	

	
	
	return self;
};
module.exports = DeliveryOptionsWin;

