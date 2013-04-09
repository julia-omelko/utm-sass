var TheLandingScreen_view = function(utm) {

	if(utm.iPhone || utm.iPad ){
		var landingView = Ti.UI.createWindow({			
			layout:'vertical',title:''
			, backButtonTitle:L('logout')
			, backgroundColor:utm.backgroundColor
			, barColor:utm.barColor
		});
	}
	
	if(utm.Android){
		//create the base screen and hid the Android navbar
		var landingView = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
		});
		
		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.barColor,
		    color : utm.backgroundColor,
		    text:'',
		    top:0
		});
 
 		//add the navbar to the screen
		landingView.add(my_navbar);
	
		//since there is no back ("Logout") button in Nav bar, must fire logout event when user uses back button on landing page
		landingView.addEventListener('android:back', function () {
  			utm.log("Back button pressed while on landing screen on Android. Firing app:logout");
  			Ti.App.fireEvent("app:logout", {});
		});
	}
	
	var utmLogo = Ti.UI.createImageView({
		image:'/images/ytm_Narrow.png',
		width:275,
		height:71,
		top:20
	});
	landingView.add(utmLogo);	
	
	var viewMessageBtn = Ti.UI.createButton({
		title:L('landing_view_messages'),
		top:20,
		width:200,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(viewMessageBtn);
	
	var sendMessageBtn = Ti.UI.createButton({
		title:L('landing_send_messages'),
		top:20,
		width:200,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(sendMessageBtn);	
	
	var myHortBtn = Ti.UI.createButton({
		title:'MyHorts',
		top:20,
		width:200,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(myHortBtn);	
	
	var myAccountBtn = Ti.UI.createButton({
		title:L('landing_my_account'),
		top:20,
		width:200,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(myAccountBtn);	
	
	viewMessageBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showMessages", {});
	});
	
	sendMessageBtn.addEventListener('click',function(e)
	{	
		
		if(utm.User.MyHorts.length==1){
			Ti.App.fireEvent("app:myHortChoosen", {myHortId:utm.User.MyHorts[0].MyHortId, direct:true});	//Direct tells us we need to setBackButtonTitle()
		}else{
			Ti.App.fireEvent("app:showChooseMyHortWindow", {});
		}
	});
	
	myHortBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showMyHortWindow", {});
	});
	
	myAccountBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showMyAccountWindow", {});
	});
	
	landingView.setEnableSendMessageButton=function(enableIt){
		sendMessageBtn.enabled=enableIt;
	}	

	return landingView;
};
module.exports = TheLandingScreen_view;


