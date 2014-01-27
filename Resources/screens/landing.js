var TheLandingScreen_view = function(utm) {

	if(utm.iPhone || utm.iPad ){
		
		var win = Ti.UI.createWindow({			
			layout:'vertical',title:''		
			, backgroundColor:utm.backgroundColor
			, barColor:utm.barColor
		});
		
		var logoutBtn = Ti.UI.createButton({
			title:L('logout'),
			font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
		});
		logoutBtn.addEventListener('click', function(){
			utm.log("Back button pressed while on landing screen on ios. Firing app:logout");
  			Ti.App.fireEvent("app:logout", {});			
		});
		win.leftNavButton=logoutBtn;
		
	}else	if(utm.Android){
		
		//create the base screen and hid the Android navbar
		var win = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
		});
		
		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : '50dp',
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    color : utm.backgroundColor,
		    text:'',
		    top:0
		});
 
 		//add the navbar to the screen
		win.add(my_navbar);
	
		//since there is no back ("Logout") button in Nav bar, must fire logout event when user uses back button on landing page
		win.addEventListener('android:back', function () {
  			utm.log("Back button pressed while on landing screen on Android. Firing app:logout");
  			Ti.App.fireEvent("app:logout", {});
		});
	}
	
	//------------- Scroll Code -----------
	// set scroll context differently for platform
	if(utm.Android){
		var scrollingView = Ti.UI.createScrollView({
		scrollType : 'vertical'
		});
	}
	if(utm.iPhone || utm.iPad ){
		var scrollingView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
		});
	}
	win.add(scrollingView);

	var view = Ti.UI.createView({
		layout : 'vertical' 
	});

	scrollingView.add(view);
	
	//------------- End Scroll Code
	var utmLogo = Ti.UI.createImageView({
		image:'/images/ytm_Narrow.png',
		width:'275dp',
		height:'71dp',
		top:'20dp'
	});
	view.add(utmLogo);	
	
	var viewMessageBtn = Ti.UI.createButton({
		title:L('landing_view_messages'),
		top:'20dp',
		width:'200dp',
		height:'50dp',
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
	});
	view.add(viewMessageBtn);
	
	
	var sendMessageBtn = Ti.UI.createButton({
		title:L('landing_send_messages'),
		top:'20dp',
		width:'200dp',
		height:'50dp',
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
	});
	view.add(sendMessageBtn);	
	
	
	win.allowSendMessage = function(){		
		//Re Ticket #644 - "Draft" (unsent) messages are preserved
		utm.writeMessageView.restForm();
		
		if(utm.User.MyHorts.length==1){
			Ti.App.fireEvent("app:myHortChoosen", {myHortId:utm.User.MyHorts[0].MyHortId, direct:true});	//Direct tells us we need to setBackButtonTitle()
		}else{
			Ti.App.fireEvent("app:showChooseMyHortWindow", {});
		}		
	};
	
	sendMessageBtn.addEventListener('click',function(e)
	{																					//NOTE cant pass function only the string
		Ti.App.fireEvent("app:getSubscriptionInfo", {callBack:'utm.landingView.allowSendMessage'});  //call back IF the user is allowed to send messages	
	});		
	
	
	
	var myHortBtn = Ti.UI.createButton({
		title:'MyHorts',
		top:'20dp',
		width:'200dp',
		height:'50dp',
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
	});
	view.add(myHortBtn);	
	
	var myAccountBtn = Ti.UI.createButton({
		title:L('landing_my_account'),
		top:'20dp',
		width:'200dp',
		height:'50dp',
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
	});
	view.add(myAccountBtn);	
	
	viewMessageBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showMessages", {});
	});
	
	
	myHortBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showMyHortWindow", {});
	});
	
	myAccountBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showMyAccountWindow", {});
	});
	
	return win;
};
module.exports = TheLandingScreen_view;


