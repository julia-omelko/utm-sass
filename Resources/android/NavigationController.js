var NavigationController = function(utm) { 
    var self = this;

    self.open = function(windowToOpen) {
        //make "heavyweight" and associate with an Android activity
        windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
        //windowToOpen.add(this.utm.activityIndicator);

        if(!self.rootWindow) {
            windowToOpen.exitOnClose = true;
            self.rootWindow = windowToOpen;
        }

        windowToOpen.open();
    };

    self.close = function(windowToClose) {
        windowToClose.close();
    };

    return self;
};

module.exports = NavigationController; 