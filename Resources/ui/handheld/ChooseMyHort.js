var ChooseMyHort_window =function() {
	
	var chooseMyHortView = Titanium.UI.createView({
	   width:'auto',
	   height:'auto',
	   layout:'vertical'
	});	
	
	var chooseMyhortLabel = Ti.UI.createLabel({
		text:'Choose MyHort',
		width:'auto',
		height:30,
		textAlign:'center'
	});
	chooseMyHortView.add(chooseMyhortLabel);
	
	var data = [];
	var intOption = 0, intOptionLen = utm.myHorts.length;
	for (intOption = 0; intOption < intOptionLen; intOption = intOption + 1) {
		data[intOption]=Ti.UI.createPickerRow({title:utm.myHorts[intOption].FriendlyName,custom_item:utm.myHorts[intOption].MyHortId});
	}

	var myHortPicker = Ti.UI.createPicker();

	// turn on the selection indicator (off by default)
	myHortPicker.selectionIndicator = true;	
	myHortPicker.setSelectedRow(0,-1,false);
	myHortPicker.add(data);	
	chooseMyHortView.add(myHortPicker);

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
		var curRow =  myHortPicker.getSelectedRow(0,0);
		var val = curRow.custom_item;
		
		Ti.App.fireEvent("app:myHortChoosen", {
		         myHortId:val
		    });	
		
	});
	
	return chooseMyHortView;
	
	
}
module.exports = ChooseMyHort_window;
