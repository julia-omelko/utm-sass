var ChooseMyHort_window =function() {
	
	var chooseMyHortView = Ti.UI.createWindow({
		backgroundColor:'#fff'
		,layout:'vertical'
		, title:L('send_choose_myhort')
		,backButtonTitle:'Back'
	});	
	
	var myHortPicker = Ti.UI.createPicker();
	
	// turn on the selection indicator (off by default)
	myHortPicker.selectionIndicator = true;	
	myHortPicker.setSelectedRow(0,-1,false);
	var tmpData=[];
	tmpData[0]=Ti.UI.createPickerRow({title:'',custom_item:0});
	myHortPicker.add(tmpData);
	myHortPicker.width=Ti.UI.FILL;
		
	chooseMyHortView.add(myHortPicker);

	Ti.App.addEventListener('app:populateMyHortPicker',populateMyHortPicker);
	function populateMyHortPicker(){	
		var data = [];
		myHortPicker.columns = [];
		
		var intOption = 0, intOptionLen = utm.myHorts.length;
		for (intOption = 0; intOption < intOptionLen; intOption = intOption + 1) {
			data[intOption]=Ti.UI.createPickerRow({title:utm.myHorts[intOption].FriendlyName,custom_item:utm.myHorts[intOption].MyHortId});
		}

		myHortPicker.add(data);
	} 

	var chooseMyhortButton = Ti.UI.createButton({
		title:L('send_choose_contacts'),
		top:34,
		width:'auto',
		height:30
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
	
	chooseMyHortView.restForm=function(){		
		//myHortPicker.setSelectedRow(0,-1,false);		
		//populateMyHortPicker();
	}
	
	
	return chooseMyHortView;
	
	
}
module.exports = ChooseMyHort_window;
