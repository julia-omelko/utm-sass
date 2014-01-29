/*function createIndicatorWindow() {
	
	var self = {};
	var win;

    function openIndicator() {
   		win = Titanium.UI.createWindow({
	        height: Ti.UI.FILL,
	        width: Ti.UI.FILL
	    });
	
		var images = [
			'/images/ai/0.png',
			'/images/ai/1.png',
			'/images/ai/2.png',
			'/images/ai/3.png',
			'/images/ai/4.png',
			'/images/ai/5.png',
			'/images/ai/6.png',
			'/images/ai/7.png',
			'/images/ai/8.png',
			'/images/ai/9.png',
			'/images/ai/10.png',
			'/images/ai/11.png'
		];
		var imageView = Titanium.UI.createImageView({
			images: images,
			duration: 83,
			repeatCount: 0,
			top: 150,
			width: 50,
			height: 50
		});
	    win.add(imageView);
	    imageView.start();
        win.open();
    }
    self.openIndicator = openIndicator;

    function closeIndicator() {
    	if (win != null) {
        	win.close();
      	}
    }
    self.closeIndicator = closeIndicator;

    return self;
}
exports.createIndicatorWindow = createIndicatorWindow;*/
