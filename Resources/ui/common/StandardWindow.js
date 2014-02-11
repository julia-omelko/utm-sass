function StandardWindow(_title,_showAi) {

	if (utm.iPhone || utm.iPad) {
		var titleControl = Ti.UI.createLabel({
			text: _title,
			font: {fontFamily: utm.fontFamily, fontSize: 18},
			color: 'white'
		});
		var self = Ti.UI.createWindow({			
			//layout: 'vertical',
			titleControl: titleControl,
			backgroundColor: utm.backgroundColor,
			barColor: utm.barColor
		});
		
	} else if (utm.Android) {
		var self = Titanium.UI.createWindow({
		 	backgroundColor: utm.backgroundColor,
		    navBarHidden: true		   
		});
		if (_title !== '') {
			var psudoNavBar = Ti.UI.createView({
				height: utm.viewableTop,
				top: 0,
				width: Ti.UI.FILL,
			    backgroundColor: utm.androidBarColor
			});
			self.add(psudoNavBar);
			
			var winTitle = Ti.UI.createLabel({
			    height: Ti.UI.FILL,
			    width: Ti.UI.FILL,
			    color: utm.backgroundColor,
			    font: {fontSize: '25dp', fontFamily: utm.fontFamily},
			    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			    text: _title
			});
	 		psudoNavBar.add(winTitle);
 		}
 		self.setLeftNavButton = function(buttonView) {
 			//alert(1111);
 		};
 		self.setRightNavButton = function(buttonView) {
 			//alert(2222);
 		};
	};
	
	
	
	
	
	
	
	var ai = Ti.UI.createView({
		height: utm.viewableArea,
		width: '100%',
		visible: _showAi,
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
		top: 150,
		width: 50,
		height: 50
	});
	ai.add(imageView);
	imageView.start();
	self.add(ai);
	
	var timerId;
	self.showAi = function() {
		ai.setVisible(true);
		timerId = setTimeout(function(){
			self.hideAi();
		}, utm.netTimeout);
	};
	self.hideAi = function() {
		ai.setVisible(false);
		clearTimeout(timerId);
	};
	
	if (_showAi) {
		timerId = setTimeout(function(){
			self.hideAi();
		}, utm.netTimeout);
	}
	
	
	return self;
} 
module.exports = StandardWindow;	
 