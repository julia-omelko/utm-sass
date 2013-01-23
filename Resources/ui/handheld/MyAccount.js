var MyAccount_window =function() {
	
	var myAccountWindow = Titanium.UI.createWindow({
	  layout:'vertical'
		, title:'Messages'
		, backButtonTitle:L('button_back')
		, backgroundColor:utm.backgroundColor
		, barColor:utm.barColor
	});		
	
	var upgradeButton = Ti.UI.createButton({
		title:'Upgrade Me',
		top:20,
		width:'auto',
		height:30,
		enabled :false
	});	
	myAccountWindow.add(upgradeButton);
	
	upgradeButton.addEventListener('click',function()
	{	
		
	});
	
	var forgetMeButton = Ti.UI.createButton({
		title:L('forget_me'),
		top:20,
		width:'auto',
		height:30,
		enabled :true
	});	
	myAccountWindow.add(forgetMeButton);
	
	forgetMeButton.addEventListener('click',function()
	{	
		
		var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: [ L('forget_me'), L('cancel')],
		    message: 'CONFIRM - Your account will be deleted, all MyHorts and Messages will be deleted? - NOTE: This can not be undone and messages are gone forever!',
		    title: L('forget_me')
		 });
		  dialog.addEventListener('click', function(e){
		    if (e.index === e.source.cancel){
		      Ti.API.info('The cancel button was clicked');
		    }
		    Ti.API.info('e.cancel: ' + e.cancel);
		    Ti.API.info('e.source.cancel: ' + e.source.cancel);
		    Ti.API.info('e.index: ' + e.index);
		  });
		  dialog.show();
				
		
	});
	
	
	
	return myAccountWindow;
	
	
}
module.exports = MyAccount_window;
