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
	
	attachmentPreview = Ti.UI.createImageView({
		image: _attachment
	});
	self.add(attachmentPreview);
	
	return self;
};
module.exports = AttachmentPreviewWin;

