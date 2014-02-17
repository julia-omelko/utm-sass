var AttachmentPreviewWin = function(_win,_attachment) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Attachment', '');


	
	var backButton = Ti.UI.createLabel({
		text: 'done',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
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
	
	var attachmentPreview = Ti.UI.createImageView({
		image: _attachment,
    	//enableZoomControls: true,
    	width: '100%'
	});
	scrollView.add(attachmentPreview);
	
	return self;
};
module.exports = AttachmentPreviewWin;

