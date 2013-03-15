exports.NavigationController = function(_utm) {
	this.windowStack = [];
	this.utm=_utm;
};

exports.NavigationController.prototype.open = function(/*Ti.UI.Window*/windowToOpen) {
	//add the window to the stack of windows managed by the controller
	this.windowStack.push(windowToOpen);
	//windowToOpen.add(utm.activityIndicator);
	//grab a copy of the current nav controller for use in the callback
	var that = this;
	windowToOpen.addEventListener('close', function() {
		that.windowStack.pop();
	});
	
	//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
	windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

	//This is the first window
	if(this.windowStack.length === 1) {
		if(Ti.Platform.osname === 'android') {
			windowToOpen.exitOnClose = true;
			windowToOpen.add(this.utm.activityIndicator);
			windowToOpen.open();
			
		} else {
			this.navGroup = Ti.UI.iPhone.createNavigationGroup({
				window : windowToOpen
			});
			var containerWindow = Ti.UI.createWindow({
				backgroundColor : this.utm.backgroundColor,
				barColor : this.utm.barColor
			});
			containerWindow.add(this.navGroup);
			containerWindow.add(this.utm.activityIndicator);
			containerWindow.open();
		}
	}
	//All subsequent windows
	else {
		if(Ti.Platform.osname === 'android') {
			windowToOpen.add(this.utm.activityIndicator);
			windowToOpen.open();
		} else {
			this.navGroup.open(windowToOpen);
		}
	}
	


	
};

//go back to the initial window of the NavigationController
exports.NavigationController.prototype.home = function() {
	//store a copy of all the current windows on the stack
	var windows = this.windowStack.concat([]);
	for(var i = 1, l = windows.length; i < l; i++) {
		(this.navGroup) ? this.navGroup.close(windows[i]) : windows[i].close();
	}
	this.windowStack = [this.windowStack[0]]; //reset stack
};

//Close one open windows
exports.NavigationController.prototype.closeWindows = function(/*Ti.UI.Window*/windowToClose) {
	
	//	(this.navGroup) ? this.navGroup.close(windows[i]) : windows[i].close();

};

//Close all open windows
exports.NavigationController.prototype.closeAllWindows = function() {
	var windows = this.windowStack.concat([]);
	for(var i = 1, l = windows.length; i < l; i++) {
		(this.navGroup) ? this.navGroup.close(windows[i]) : windows[i].close();
	}
};


