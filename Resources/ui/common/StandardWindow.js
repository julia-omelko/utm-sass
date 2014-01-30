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
		    //layout: 'vertical',
		 	backgroundColor: utm.backgroundColor,
		    navBarHidden: true		   
		});
		
		var my_navbar = Ti.UI.createLabel({
		    height: 50,
		    width: '100%',
		    backgroundColor: utm.androidBarColor,
		    color: utm.backgroundColor,
		    font: {fontSize: utm.androidTitleFontSize, fontFamily: utm.fontFamily},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    text: _title,
		    top: 0
		});
 		self.add(my_navbar);
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
		}, 8000);
	};
	self.hideAi = function() {
		ai.setVisible(false);
		clearTimeout(timerId);
	};
	
	if (_showAi) {
		timerId = setTimeout(function(){
			self.hideAi();
		}, 8000);
	}
	
	/*
	var ai = require('/ui/common/baseui/ActivityIndicator');
	var indicator = ai.createIndicatorWindow();
	self.showAi = function() {
		indicator.openIndicator();
	};
	self.hideAi = function() {
		indicator.closeIndicator();
	};
	
	if (_showAi === true) {
		self.addEventListener('open',function(e){
			self.showAi();
		});
	}
	*/
	
	return self;
} 
module.exports = StandardWindow;	
 