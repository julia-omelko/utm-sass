var subscribe_window = function(utm) {
	
	var moment = require('lib/moment');

	if(utm.iPhone || utm.iPad ){
		var win = Titanium.UI.createWindow({
		layout : 'vertical',
		title : 'Subscription Information',
		backButtonTitle : L('button_back'),
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor
		});
	}else	if(utm.Android){
		
		//create the base screen and hid the Android navbar
		var win = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
		});
		
 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text:'Subscription Information',
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
 
 		//add the navbar to the screen
		win.add(my_navbar);	
	}
	var message='';	
		

	var instructionLbl = Ti.UI.createLabel({ 
		top:10,
		left:5,
		right:5,
		font:{fontSize:'15dp'},
		color:utm.textColor
		})
	win.add(instructionLbl);
	
	
	win.updateMessage = function(){
		message='';
		if(utm.User.UserProfile.MessagesRemaining <1){
			message= 'Your have no more messages available \n';
		}
		
		var now = new Date();		
		var subDate = utm.User.UserProfile.SubscriptionEnds.substring(0,	10);
		subDate=subDate.replace(/-/g, '/');
		subDate = new Date(subDate);

			
		if( subDate < now){			
			message+='\nYour subscription has run out as of '  + 	utm.User.UserProfile.SubscriptionEnds.substring(0,	10) +'\n';			
		}	
		
		message+='\nTo update - go to www.youthisme.com and login in to update your subscription';
		
		instructionLbl.text=message;
		
	}			
	
	/*
	 * 
	 * 	var upgradeBtn = Ti.UI.createButton({
		title:'To Send - Upgrade Here',
		width:200,
		height:'50dp',
		visible:false,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
	});
	landingView.add(upgradeBtn);
	upgradeBtn.addEventListener('click', function(){
		  Ti.Platform.openURL(utm.webUrl +'/Store');
	});	
	 */
	
	

	return win;

}
module.exports = subscribe_window;
