var ChooseMyHort_window =function(utm) {
	
	if(utm.iPhone || utm.iPad){
		var chooseMyHortView = Ti.UI.createWindow({
		layout:'vertical'
		, title:L('send_choose_myhort')
		,backButtonTitle:'Back'
		,backgroundColor:utm.backgroundColor
		,barColor:utm.barColor
		});	
	}
	
	if(utm.Android){
		//create the base screen and hide the Android navbar
		var chooseMyHortView = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
	    });

 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text : L('send_choose_myhort'),
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
		
		//add the navbar to the screen
		chooseMyHortView.add(my_navbar);
	}
	
	var myHortPicker = Ti.UI.createPicker({
		selectionIndicator:true,
		useSpinner:true
		//width:Ti.UI.FILL  //This statement pushes picker to left side of Android screen. 
							//Documentation indicates width should be set on createPickerRow. 
	
	});
	
	// turn on the selection indicator (off by default)
	//myHortPicker.selectionIndicator = true;	
	//myHortPicker.setSelectedRow(0,-1,false);
	
	//The folowing code block creates an unwanted empty row in picker in Android and does not set width to screen width in Android
	//var tmpData=[];
	//tmpData[0]=Ti.UI.createPickerRow({title:'',custom_item:0});  
	//myHortPicker.add(tmpData);
	//myHortPicker.width=Ti.UI.FILL;
		
	chooseMyHortView.add(myHortPicker);

	Ti.App.addEventListener('app:populateMyHortPicker',populateMyHortPicker);
	function populateMyHortPicker(){	
		var data = [];

		// Clear picker contents so that next time through new content is not being appended to contents already loaded in picker
		if(utm.iPhone || utm.iPad){
			myHortPicker.columns = [];
		}else if(utm.Android){  
			 var emptyPickerColumn = Ti.UI.createPickerColumn();
			 myHortPicker.setColumns(emptyPickerColumn);
		}
		
		var intOption = 0, intOptionLen = utm.User.MyHorts.length;
		for (intOption = 0; intOption < intOptionLen; intOption = intOption + 1) {
			data[intOption]=Ti.UI.createPickerRow({title:utm.User.MyHorts[intOption].FriendlyName,custom_item:utm.User.MyHorts[intOption].MyHortId,width:Ti.UI.FILL});
		}

		myHortPicker.add(data);
		
		if(data.length == 1){
			var curRow =  myHortPicker.getSelectedRow(0,0);
			var val = data[0].custom_item;	
			utm.navController.open(utm.chooseMyHortView);	
			Ti.App.fireEvent("app:myHortChoosen", {myHortId:val});	
		}else{
			//Re #237 Moved the window change call to after the myhort picklist is done setting
			utm.navController.open(utm.chooseMyHortView);
		}
		
	}; 

	var chooseMyhortButton = Ti.UI.createButton({
		title:L('send_choose_contacts'),
		top:34,
	});	
	chooseMyHortView.add(chooseMyhortButton);
	
	chooseMyhortButton.addEventListener('click',function()
	{		
		//myHortPicker.hide(); //todo  needed???
		//myHortPicker.height=0;
		var curRow =  myHortPicker.getSelectedRow(0,0);
		var val = curRow.custom_item;
		
		Ti.App.fireEvent("app:myHortChoosen", {myHortId:val});	
		
	});
	
	chooseMyHortView.restForm  =function(){		
		//myHortPicker.setSelectedRow(0,-1,false);		
		//populateMyHortPicker();
	};
	
	
	return chooseMyHortView;
	
	
};
module.exports = ChooseMyHort_window;
