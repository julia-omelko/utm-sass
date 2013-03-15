exports.MainWindow = function() {
	var win = Ti.UI.createWindow({
		title:'Window '+controller.windowStack.length,
		backgroundColor:'#fff',
		layout:'vertical'
	});



	return win;
};