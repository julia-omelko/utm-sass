var ChooseMyHort_window =function() {
	
	var chooseMyHortView = Titanium.UI.createView({
	   width:'auto',
	   height:'auto',
	   layout:'vertical'
	});	
	
	/*var backButton = Ti.UI.createButton({title:'Back',top:2,left:2,width:'auto',height:30});	
	chooseMyHortView.add(backButton);
	backButton.addEventListener('click',function(){Ti.App.fireEvent("app:showLandingView");});
	*/
	
	var chooseMyhortLabel = Ti.UI.createLabel({
		text:'Choose a MyHort',
		width:'auto',
		height:30,
		textAlign:'center'
	});
	chooseMyHortView.add(chooseMyhortLabel);
	
	var myHortPicker = Ti.UI.createPicker();

	// turn on the selection indicator (off by default)
	myHortPicker.selectionIndicator = true;	
	myHortPicker.setSelectedRow(0,-1,false);
	var tmpData=[];
	tmpData[0]=Ti.UI.createPickerRow({title:'',custom_item:0});
	myHortPicker.add(tmpData);
	myHortPicker.width=Ti.UI.FILL;
		
	chooseMyHortView.add(myHortPicker);

	Ti.App.addEventListener('app:showSendMessage',showSendMessageWindow);
	function showSendMessageWindow(){	
		var data = [];
		myHortPicker.columns = [];
		
		var intOption = 0, intOptionLen = utm.myHorts.length;
		for (intOption = 0; intOption < intOptionLen; intOption = intOption + 1) {
			data[intOption]=Ti.UI.createPickerRow({title:utm.myHorts[intOption].FriendlyName,custom_item:utm.myHorts[intOption].MyHortId});
		}

		myHortPicker.add(data);
	} 

/*		
	myHortPicker.addEventListener('change',function(e)
	{
		Ti.App.fireEvent("app:myHortChoosen", {
	        myHortId:e.row.custom_item
	    });			
		
		Ti.API.info("You selected row: "+e.row+", column: "+e.column+", custom_item: "+e.row.custom_item);
		
	});
*/
	var chooseMyhortButton = Ti.UI.createButton({
		title:'Choose Contacts',
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
	
	return chooseMyHortView;
	
	
}
module.exports = ChooseMyHort_window;
