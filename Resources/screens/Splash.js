function splash_window(utm) {
	
	var win = Ti.UI.createWindow({
		layout : 'vertical',
		backgroundColor : utm.backgroundColor,
		barColor : utm.Android ? utm.androidBarColor : utm.barColor,
		backButtonTitle:'Close'
	});

	var splash  = Ti.UI.createImageView({
		image:'/images/splash.png'
	});
	win.add(splash);
	return win;
};

module.exports = splash_window;
