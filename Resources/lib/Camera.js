function CameraView(_previewView) {
	var resizedImage;
	
	var CameraView = Ti.UI.createView({
        layout: 'horizontal',
        visible:false
	});


	CameraView.captureImage= function(){
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
				return;
			} else if (e.index === 0) {
				Ti.Media.showCamera({
					saveToPhotoGallery: false,
					mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
					success:function(e) {
						processImage(e);
					},
		        	cancel:function() {
						_previewView.setHeight(46*utm.sizeMultiplier);
						_previewView.setWidth(46*utm.sizeMultiplier);
						_previewView.setImage('/images/icons/camera.png');
						return;
		        	},
		        	error:function(error) {
		            	if (error.code == Ti.Media.NO_CAMERA) {
		            		alert('Device does not have camera capabilities');
		            	}else{
		                	alert('Unable to access camera.\nPlease use a picture from the gallery.');
		            	}
		            }
				});
			} else if (e.index === 1) {
				Ti.Media.openPhotoGallery({
					success:function(e) {
						processImage(e);
					},
		        	cancel:function(){
						_previewView.setHeight(46*utm.sizeMultiplier);
						_previewView.setWidth(46*utm.sizeMultiplier);
						_previewView.setImage('/images/icons/camera.png');
						return;
		        	},
		        	error:function(error){
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
		resizedImage = e.media.imageAsResized(e.media.width/2,e.media.height/2);
		/*if (utm.Android) {
			resizedImage = e.media.imageAsResized(e.media.width/6,e.media.height/6);
		} else {
			resizedImage = e.media.imageAsResized(e.media.width/3,e.media.height/3);
		}*/
		
		_previewView.setVisible(false);
		_previewView.setHeight(80*utm.sizeMultiplier);
		_previewView.setWidth(80*utm.sizeMultiplier);
		_previewView.setImage(resizedImage);
		_previewView.setVisible(true);
		
	}
	
	CameraView.getImage = function(){
		return resizedImage;
	};
	
	CameraView.reset = function(){
		_previewView.setVisible(false);
		resizedImage = null;	
	};

	return CameraView;
};

module.exports = CameraView;