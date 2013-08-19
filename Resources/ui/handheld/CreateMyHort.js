function createMyHortWindow(utm) {
	var InputField = require('ui/common/baseui/InputField');
	
	var myHortWindow = Ti.UI.createWindow({
		backgroundColor : '#fff',
		layout : 'horizontal',
		left:5
	});	
	
	var spacer = Ti.UI.createView({
		height:'33%'
	});
	myHortWindow.add(spacer);
	
	var fldView = Ti.UI.createView({
		layout:'horizontal'
		,width:'100%'
		,height:Ti.UI.SIZE
	});
	var nameLabel = Ti.UI.createLabel({
		text:'MyHort Name '
		//,font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
		,font:(utm.Android) ? {fontFamily:'Arial',fontWeight:'bold',fontSize:utm.androidLabelFontSize} : {fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	fldView.add(nameLabel);
	
	var myHortName = Ti.UI.createTextField({
		color:utm.textFieldColor,		
		width:200,
		left:10,
		//height:40,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5
	});
	fldView.add(myHortName);
	
	myHortName.addEventListener('change',function(){
		if(myHortName.value.length > 0){
			createButton.enabled=true;	
		}else{
			createButton.enabled=false;
		}
	});
	
	myHortWindow.add(fldView);
	
	//############ Buttons ################
	var buttonView = Ti.UI.createView({
		layout:'horizontal'
		,width:'100%'
		,top:'10dp'
	});
	myHortWindow.add(buttonView);
	
	var createButton = Ti.UI.createButton({
		title : 'Save'
		,enabled:false
	})
	buttonView.add(createButton);

	createButton.addEventListener('click', function() {
		createMyHort(myHortName.value);
	})
	
	var closeButton = Ti.UI.createButton({
		title : 'Cancel',
		left : 10
	});
	closeButton.addEventListener('click', function() {
		myHortWindow.close();
	});
	buttonView.add(closeButton);
	
	// ##################### CREATE MyHort #####################
	function createMyHort(myHortName){		
		utm.log('Create MyHort: '+myHortName);
		createButton.enabled=false;
		utm.setActivityIndicator('Adding New MyHort...');
		createMyHortReq.open("POST", utm.serviceUrl + "MyHort/CreateMyHortDetails");
		createMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		createMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
	
		var myHort = {FriendlyName:myHortName} ;
		
		createMyHortReq.send(JSON.stringify(myHort));
	}

	var createMyHortReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			utm.setActivityIndicator('');
			refreshMyHortList();
			myHortWindow.close();
		},onerror: function(e){
			createButton.enabled=true;
			utm.handleError(e, this.status, this.responseText);
			refreshMyHortList();
		}		
		
	});
	
	function refreshMyHortList(){
		utm.setActivityIndicator('Refreshing your MyHorts...');	
		Ti.App.fireEvent("app:loadMyHorts");
	}
	
		
	return myHortWindow;

}

module.exports = createMyHortWindow; 