var NavigationController = function(utm) { 
    var self = this;
    var guid = require("/lib/guid");

    self.open = function(windowToOpen) {
        //make "heavyweight" and associate with an Android activity
    		windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
        
        
           
	   	var thisActivityIndicator = Ti.UI.Android.createProgressIndicator({
		    activityIndicatorStyle : Ti.UI.ActivityIndicatorStyle.DARK,
		    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,   // display in dialog 
		    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT // display a spinner
	 	 });
        
	        windowToOpen.add(thisActivityIndicator);

        if(!self.rootWindow) {
            //windowToOpen.exitOnClose = true;
            self.rootWindow = windowToOpen;
        }
		
		function timeoutCompare(){
			var d = new Date();
			var n = d.getTime();
			if (n-utm.activityActive-1000 >= utm.androidTimeout) {
				Ti.App.fireEvent('resumed');
			}
		}
		
		function monitorGuid() {
			var d = new Date();
			var n = d.getTime();
			utm.activityActive = n;
			setTimeout(function() {
			    timeoutCompare();
			}, utm.androidTimeout)
		};

		windowToOpen.addEventListener('open', function(ev) {
			monitorGuid();
		});
		windowToOpen.addEventListener('close', function(ev) {
			monitorGuid();
		})
		windowToOpen.addEventListener('blur', function(ev) {
			monitorGuid();
		})
		windowToOpen.addEventListener('blur', function(ev) {
			monitorGuid();
		})
		windowToOpen.addEventListener('focus', function(ev) {
			timeoutCompare();
		})
	    
        windowToOpen.open();
    };

    self.close = function(windowToClose) {
    		utm.log('CLOSE WINDOW  '+ windowToClose);
    		
    		if(windowToClose.toString() =='[object Window]'){
    			windowToClose.close();	
    		}else{
    			utm.log('NO CLOSE WINDOW  '+ windowToClose);
    		}
        windowToClose=null;
    };
	
	
	
	
    return self;
};

module.exports = NavigationController; 