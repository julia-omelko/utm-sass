var WriteMessage_window =function() {
	
	var writeMessageView = Titanium.UI.createView({
	   width:'auto',
	   height:'auto',
	   layout:'vertical',
	   visible:false
	});	
	
	var toLabel = Ti.UI.createLabel({
		text:'To:',
		width:'auto',
		height:30,
		textAlign:'center'
	});
	writeMessageView.add(toLabel);
	
	var yourMessageLabel = Ti.UI.createLabel({
		text:'Your Message',
		width:'auto',
		height:30,
		textAlign:'center'
	});
	writeMessageView.add(yourMessageLabel);
	
	var textArea = Ti.UI.createTextArea({
	  borderWidth: 2,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color: '#888',
	  font: {fontSize:20, fontWeight:'bold'},
	  textAlign: 'left',
	  top: 10,
	  width: 30, height : 'auto'
	}); //todo get the screen width so we can make this wider if possible
	writeMessageView.add(textArea);
	
	
	
	var previewButton = Ti.UI.createButton({
		title:'Preview Your Message...',
		top:34,
		width:'auto',
		height:30
	});	
	writeMessageView.add(previewButton);
	
	previewButton.addEventListener('click',function()
	{		
		/*
		Ti.App.fireEvent("app:myHortChoosen", {
		         myHortId:val
		    });	
		*/
	});
	
	return writeMessageView;
	
	
}
module.exports = WriteMessage_window;
