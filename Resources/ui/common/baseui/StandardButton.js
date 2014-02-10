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
		backgroundColor: ((_params.type != null && _params.type === 'Secondary') ? utm.barColor : utm.buttonColor),
		color: 'white',
		style: (utm.Android ? null : Ti.UI.iPhone.SystemButtonStyle.PLAIN)
	});	
	
    return self;
 }
 module.exports = StandardButton;
 