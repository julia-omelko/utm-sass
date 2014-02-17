var WebViewWin = function(_title,_url) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow(_title, false);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var webView = Ti.UI.createWebView({
		height: '100%',
		width: '100%',
		url: _url,
		backgroundColor: '#ED5C00'
	});
	self.add(webView);
	
	Ti.API.info(_url);
	
	return self;
};
module.exports = WebViewWin;

