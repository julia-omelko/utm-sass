var NavigationController = function() {
    var self = this;

	 // Function to test if device is iOS 7 or later
		var isiOS7Plus = function()
		{
			// iOS-specific test
			if (Titanium.Platform.name == 'iPhone OS')
			{
				var version = Titanium.Platform.version.split(".");
				var major = parseInt(version[0],10);
		
				// Can only test this support on a 3.2+ device
				if (major >= 7)
				{
					return true;
				}
			}
			return false;
		};
        
        var iOS7 = isiOS7Plus();

    function createNavGroup(windowToOpen) {
        self.navGroup = Ti.UI.iPhone.createNavigationGroup({
            window : windowToOpen
        });
        
		var theTop = iOS7 ? 20 : 0;
        
        var containerWindow = Ti.UI.createWindow({top: theTop});
        containerWindow.add(self.navGroup);
        containerWindow.open();
        containerWindow.add(utm.activityIndicator);
    };

    self.open = function(windowToOpen) {
        if(!self.navGroup) {
            createNavGroup(windowToOpen);
        }
        else {
            self.navGroup.open(windowToOpen);
        }
    };

    self.close = function(windowToClose) {
        
        var thisWindow = windowToClose.toString();
        
		if( thisWindow == "[object TiUIWindow]" ) {      
	        if(self.navGroup) {
	            
	            self.navGroup.close(windowToClose);
	        }
       }
    };

    return self;
};

module.exports = NavigationController;