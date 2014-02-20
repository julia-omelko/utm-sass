var NavigationController = function() { 
    var self = this;

    self.open = function(windowToOpen) {
    	var ai = Ti.UI.createView({
			height: utm.viewableArea,
			width: '100%',
			visible: false,
			zIndex: 1,
			top: 0,
			left: 0
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
			top: 150*utm.sizeMultiplier,
			width: 50*utm.sizeMultiplier,
			height: 50*utm.sizeMultiplier
		});
		ai.add(imageView);
		windowToOpen.add(ai);
		
		var timerId;
		windowToOpen.showAi = function() {
			imageView.start();
			ai.setVisible(true);
			timerId = setTimeout(function(){
				windowToOpen.hideAi();
			}, utm.netTimeout);
		};
		windowToOpen.hideAi = function() {
			ai.setVisible(false);
			imageView.stop();
			clearTimeout(timerId);
		};
	
        windowToOpen.open();
    };

    self.close = function(windowToClose) {
    	windowToClose.close();	
        windowToClose = null;
    };
	
	
	
	
	
    return self;
};

module.exports = NavigationController; 