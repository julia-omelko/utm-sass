function HeaderWindow(utm,_title,_backButtonTitle) {

	if(utm.iPhone || utm.iPad ){
		var mainWindow = Ti.UI.createWindow({			
			layout:'vertical'
			, title:_title
			, backgroundColor:utm.backgroundColor
			, barColor:utm.barColor
			, backButtonTitle : _backButtonTitle,
		});
		
		mainWindow.add(utm.activityIndicator);
	}
	
	if(utm.Android){
		//create the base screen and hid the Android navbar
		var mainWindow = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true		   
		});
		
		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    color : utm.backgroundColor,
		     font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    text:_title,
		    top:0
		});
 
 		//add the navbar to the screen
		mainWindow.add(my_navbar);
	}
	
	return mainWindow;
} 
 module.exports=HeaderWindow;	