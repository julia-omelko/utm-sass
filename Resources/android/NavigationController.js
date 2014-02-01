var NavigationController = function() { 
    var self = this;

    self.open = function(windowToOpen) {
        windowToOpen.open();
    };

    self.close = function(windowToClose) {
    	windowToClose.close();	
        windowToClose = null;
    };
	
	alert(0);
	
    return self;
};

module.exports = NavigationController; 