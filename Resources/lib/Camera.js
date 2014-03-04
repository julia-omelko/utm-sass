function CameraView(_previewView) {
	var resizedImage;
	var thumbnailImage;
	
	var CameraView = Ti.UI.createView({
        layout: 'horizontal',
        visible:false
	});


	CameraView.captureImage= function(){
		utm.screenWillLock = false;
		resizedImage = null;
		
		var photoDialog = Ti.UI.createOptionDialog({
			title:'Please provide a picture.',
			options:['Camera','Album','Cancel'],
			cancel:2,
			selectedIndex:0,
			destrutive:2
		});
		
		photoDialog.addEventListener('click', function(e) {			
			resizedImage = null;
			if (e.cancel === e.index || e.cancel === true) {
				_previewView.setHeight(46*utm.sizeMultiplier);
				_previewView.setWidth(46*utm.sizeMultiplier);
				_previewView.setImage('/images/icons/camera.png');
				utm.screenWillLock = true;
				return;
			} else if (e.index === 0) {
				Ti.Media.showCamera({
					saveToPhotoGallery: false,
					mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
					success:function(e) {
						processImage(e);
						utm.screenWillLock = true;
					},
		        	cancel:function() {
						_previewView.setHeight(46*utm.sizeMultiplier);
						_previewView.setWidth(46*utm.sizeMultiplier);
						_previewView.setImage('/images/icons/camera.png');
						utm.screenWillLock = true;
						return;
		        	},
		        	error:function(error) {
						utm.screenWillLock = true;
		            	if (error.code == Ti.Media.NO_CAMERA) {
		            		alert('Device does not have camera capabilities');
		            	} else {
		                	alert('Unable to access camera.\nPlease use a picture from the gallery.');
		            	}
		            }
				});
			} else if (e.index === 1) {
				Ti.Media.openPhotoGallery({
					success:function(e) {
						processImage(e);
						utm.screenWillLock = true;
					},
		        	cancel:function(){
						_previewView.setHeight(46*utm.sizeMultiplier);
						_previewView.setWidth(46*utm.sizeMultiplier);
						_previewView.setImage('/images/icons/camera.png');
						utm.screenWillLock = true;
						return;
		        	},
		        	error:function(error){
						utm.screenWillLock = true;
		            	if (error.code == Ti.Media.NO_CAMERA){
		            		alert('Device does not have camera capabilities');
		            	}else{
		                	//alert('Unexpected error: ' + error.code);
		            	}
		            }
				});
			}
		});
		photoDialog.show();
	};
	
	function processImage(e){
		var ImageFactory = require('ti.imagefactory');
		resizedImage = ImageFactory.compress(e.media,0.35);
		
		thumbnailImage = e.media.imageAsResized(80*utm.sizeMultiplier,80*utm.sizeMultiplier);
		
		//resizedImage = e.media.imageAsResized(e.media.width/2,e.media.height/2);
		/*if (utm.Android) {
			resizedImage = e.media.imageAsResized(e.media.width/6,e.media.height/6);
		} else {
			resizedImage = e.media.imageAsResized(e.media.width/3,e.media.height/3);
		}*/
		
		_previewView.setVisible(false);
		_previewView.setHeight(80*utm.sizeMultiplier);
		_previewView.setWidth(80*utm.sizeMultiplier);
		_previewView.setImage(thumbnailImage);
		_previewView.setVisible(true);
		
	}
	
	CameraView.getImage = function(){
		return resizedImage;
	};
	
	CameraView.getThumbnail = function(){
		return _previewView.getImage();
	};
	
	CameraView.reset = function(){
		_previewView.setVisible(false);
		_previewView.setImage(null);
		resizedImage = null;	
	};

	return CameraView;
};

module.exports = CameraView;