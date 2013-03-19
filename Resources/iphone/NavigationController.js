var NavigationController = function() {
    var self = this;

    function createNavGroup(windowToOpen) {
        self.navGroup = Ti.UI.iPhone.createNavigationGroup({
            window : windowToOpen
        });
        var containerWindow = Ti.UI.createWindow();
        containerWindow.add(self.navGroup);
        containerWindow.open();
        containerWindow.add(this.utm.activityIndicator);
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
        if(self.navGroup) {
            self.navGroup.close(windowToClose);
        }
    };

    return self;
};

module.exports = NavigationController;