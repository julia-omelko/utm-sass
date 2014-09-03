var ForgotWin = function() {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Forgotten', '');

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var webView = Ti.UI.createView({
		height: '100%',
		width: '100%',
		backgroundColor: '#ED5C00'
	});
	self.add(webView);
	
	
	return self;
};
module.exports = ForgotWin;

