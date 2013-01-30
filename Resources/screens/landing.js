var TheLandingScreen_view = function() {

	var landingView = Ti.UI.createWindow({			
		layout:'vertical',title:''
		, backButtonTitle:L('logout')
		, backgroundColor:utm.backgroundColor
		, barColor:utm.barColor
	});

	
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
		height:35,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(viewMessageBtn);
	
	var sendMessageBtn = Ti.UI.createButton({
		title:L('landing_send_messages'),
		top:20,
		width:200,
		height:35,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(sendMessageBtn);	
	
	var myAccountBtn = Ti.UI.createButton({
		title:L('landing_my_account'),
		top:20,
		width:200,
		height:35,
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	landingView.add(myAccountBtn);	
	
	viewMessageBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showMessages", {});
	});
	
	sendMessageBtn.addEventListener('click',function(e)
	{	
		Ti.App.fireEvent("app:showChooseMyHortWindow", {});
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


