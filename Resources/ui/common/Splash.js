function splash_window() {
	
	var self = Ti.UI.createWindow({
		layout: 'vertical',
		backgroundColor: utm.backgroundColor,
		barColor: (utm.Android ? utm.androidBarColor : utm.barColor),
		backButtonTitle: 'Close'
	});
	var splash = Ti.UI.createImageView({
		image: '/images/splash.png'
	});
	self.add(splash);
	
	return self;
};

module.exports = splash_window;
