var WebViewWin = function(_title,_url) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow(_title, false);
	
	var backButton = Ti.UI.createLabel({
		text: 'Back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close({animated:true});
	});
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

