function StandardButton(_params){
	/* _params = {
	 * 	title: string, 				default=''
	 *  bottom: numeric 			default=10
	 *  type: primary || secondary 	default='primary'
	 * }
	 */
	
	var self = Ti.UI.createButton({
		title: ((_params.title == null) ? '' : _params.title), //'Reply',
		bottom: ((_params.bottom == null) ? 10 : _params.bottom),
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40 * utm.sizeMultiplier,
		borderRadius: 20 * utm.sizeMultiplier,
		font:{fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		backgroundColor: ((_params.type != null && _params.type === 'secondary') ? utm.barColor : utm.buttonColor),
		color: 'white',
		style: (utm.Android ? null : Ti.UI.iOS.SystemButtonStyle.PLAIN),
		zIndex: 1
	});
	
	var updateBtnWidth = function() {
		self.width = (Ti.Platform.displayCaps.platformWidth-50);
	};
	Ti.App.addEventListener('orientdisplay', updateBtnWidth);	
	
	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('orientdisplay', updateBtnWidth);
	});	
    return self;
 }
 module.exports = StandardButton;
 