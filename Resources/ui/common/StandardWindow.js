function StandardWindow(_title,_backButtonTitle) {

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
			barColor: utm.barColor,
			backButtonTitle: _backButtonTitle
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
	
	return self;
} 
module.exports = StandardWindow;	
 