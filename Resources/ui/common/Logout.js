var LogoutWin = function(_tabGroup) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Logout', '');
	
	var scrollView = Ti.UI.createScrollView({
		scrollType : 'vertical',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		height: Ti.Platform.displayCaps.platformHeight
	});
	self.add(scrollView);
	
	self.addEventListener('focus',function(e){
		alert('You have been logged out of YouThisMe');
		Ti.App.fireEvent('app:logout');
		_tabGroup.close();
	});

	return self;
};
module.exports = LogoutWin;

