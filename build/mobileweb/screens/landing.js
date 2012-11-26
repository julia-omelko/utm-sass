

var TheLandingScreen_view = function() {
	
	var landingView = Ti.UI.createView({		
		backgroundColor: 'transparent',
		layout:'vertical'
	});
	

/*
	 var b = Titanium.UI.createButton({title:'Logout'});
	 landingView.leftNavButton = b;
	    b.addEventListener('click', function()
	    {
	       Ti.App.fireEvent("app:logout", {});
    		landingView.close();
	  	});
*/	
	/*var nav = Titanium.UI.iPhone.createNavigationGroup({
  		window: landingView 
 	});
*/
	/*
	var logoutButton = Titanium.UI.createButton({title:'Logout'});

    logoutButton.addEventListener('click', function()
    {
    	Ti.App.fireEvent("app:logout", {});
    	landingView.close();
     
  	});
  	
  	 landingView.add(nav);
	*/
	
	var utmLogo = Ti.UI.createImageView({
		image:'/images/ytm_Narrow.png',
		width:275,
		height:71,
		top:20
	});
	landingView.add(utmLogo);	
	
	var viewMessageBtn = Ti.UI.createButton({
		title:L('view_messages'),
		top:20,
		width:200,
		height:35,
		borderRadius:1,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(viewMessageBtn);
	
	var sendMessageBtn = Ti.UI.createButton({
		title:L('send_messages'),
		top:20,
		width:200,
		height:35,
		borderRadius:1,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(sendMessageBtn);
	
	
	
	viewMessageBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showMessages", {});
	});
	
	sendMessageBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showSendMessage", {});
	});

	
	
	
	return landingView;
};
module.exports = TheLandingScreen_view;

