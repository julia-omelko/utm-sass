var AttachmentPreviewWin = function(_win,_attachment) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Attachment', '');


	
	var backButton = Ti.UI.createLabel({
		text: 'Done',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		if (utm.Android) {
			resizedImage = null;
		}
		_win.fireEvent('closeAttachmentPreview',{});
		if (utm.Android) {
			self.close({animated:true});
		}
	});
	self.setRightNavButton(backButton);
	
	var scrollView = Ti.UI.createScrollView({
		contentWidth:'auto',
		contentHeight:'auto',
		top:utm.viewableTop,
		bottom:0,	
		showVerticalScrollIndicator:true,
		showHorizontalScrollIndicator:true,
		maxZoomScale:4,
		minZoomScale:1, 
		zoomScale:1
	});
	self.add(scrollView);
	
	//For Android, need to resize image to a size the device can display
//	if (utm.Android) {
//	var resizedImage = _attachment.imageAsResized(Ti.Platform.displayCaps.platformWidth, (Ti.Platform.displayCaps.platformHeight - utm.viewableTabHeight));
//	}

//The above code resulted in image skewing.  Per Ti documentation, specifying either the width OR the height of createImageView will preserve the
//  proportion size of teh image without skewing it.

	var attachmentPreview = Ti.UI.createImageView({
		image: _attachment,
    	//enableZoomControls: true,
		width: Ti.Platform.displayCaps.platformWidth,
		autorotate: true
	});
	scrollView.add(attachmentPreview);
	
	return self;
};
module.exports = AttachmentPreviewWin;

