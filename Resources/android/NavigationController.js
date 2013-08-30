var NavigationController = function(utm) { 
    var self = this;

    self.open = function(windowToOpen) {
        //make "heavyweight" and associate with an Android activity
        windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
        //windowToOpen.add(this.utm.activityIndicator);

        if(!self.rootWindow) {
            //windowToOpen.exitOnClose = true;
            self.rootWindow = windowToOpen;
        }

        windowToOpen.open();
    };

    self.close = function(windowToClose) {
    		utm.log('CLOSE WINDOW  '+ windowToClose);
    		
    		if(windowToClose.toString() =='[object Window]'){
    			windowToClose.close();	
    		}else{
    			utm.log('NO CLOSE WINDOW  '+ windowToClose);
    		}
        
    };

    return self;
};

module.exports = NavigationController; 