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
		//_tabGroup.getTabs()[0] = null;
		//_tabGroup.getTabs()[1] = null;
		//_tabGroup.getTabs()[2] = null;
		//_tabGroup.getTabs()[3] = null;
		//_tabGroup.getTabs()[4] = null;
		if (utm.iPhone || utm.iPad) {
			_tabGroup.removeTab(_tabGroup.getTabs()[0]);
			_tabGroup.removeTab(_tabGroup.getTabs()[0]);
			_tabGroup.removeTab(_tabGroup.getTabs()[0]);
			_tabGroup.removeTab(_tabGroup.getTabs()[0]);
			_tabGroup.removeTab(_tabGroup.getTabs()[0]);
		}
		_tabGroup = null;
	});
	
	return self;
};
module.exports = LogoutWin;

