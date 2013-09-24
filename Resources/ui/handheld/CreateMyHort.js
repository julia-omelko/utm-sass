function createwin(utm) {

	var Header = require('ui/common/Header');

	var win = new Header(utm, 'Create MyHort', L('button_back'));
	win.left='5dp';
	
	var fldView = Ti.UI.createView({
		layout:'horizontal'
		,width:'100%'
		,height:Ti.UI.SIZE,
		top:utm.iPhone || utm.iPad?'33%':'30dp'
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
	
	win.add(fldView);
	
	//############ Buttons ################
	var buttonView = Ti.UI.createView({
		layout:'horizontal'
		,width:'100%'
		,top:'10dp'
	});
	win.add(buttonView);
	
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
		win.close();
	});
	buttonView.add(closeButton);
	
	// ##################### CREATE MyHort #####################
	function createMyHort(myHortName){		
		utm.log('Create MyHort: '+myHortName);
		createButton.enabled=false;
		utm.setActivityIndicator(win , 'Adding New MyHort...');
		createMyHortReq.open("POST", utm.serviceUrl + "MyHort/CreateMyHortDetails");
		createMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		createMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
	
		var myHort = {FriendlyName:myHortName} ;
		
		createMyHortReq.send(JSON.stringify(myHort));
	}

	var createMyHortReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			utm.setActivityIndicator(win , '');
			refreshMyHortList();
			win.close();
		},onerror: function(e){
			createButton.enabled=true;
			utm.handleError(e, this.status, this.responseText);
			refreshMyHortList();
		}		
		
	});
	
	function refreshMyHortList(){
		utm.setActivityIndicator(win , 'Refreshing your MyHorts...');	
		Ti.App.fireEvent("app:loadMyHorts");
	}
	
		
	return win;

}

module.exports = createwin; 