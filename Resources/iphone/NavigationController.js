var NavigationController = function() {
    var self = this;

    function createNavGroup(windowToOpen) {
        self.navGroup = Ti.UI.iOS.createNavigationWindow({
            window : windowToOpen
        });
        self.navGroup.open();
		//var theTop = utm.iOS7 ? 20 : 0;
        
        //var containerWindow = Ti.UI.createWindow();
        //containerWindow.add(self.navGroup);
        //containerWindow.open();
        //containerWindow.add(utm.activityIndicator);
    };

    self.open = function(windowToOpen) {
        if(!self.navGroup) {
            createNavGroup(windowToOpen);
        }
        else {
            self.navGroup.openWindow(windowToOpen);
        }
    };

    self.close = function(windowToClose) {
        
        var thisWindow = windowToClose.toString();
        
		if( thisWindow == "[object TiUIWindow]" ) {      
	        if(self.navGroup) {
	            
	            self.navGroup.closeWindow(windowToClose);
	        }
       }
    };

    return self;
};

module.exports = NavigationController;