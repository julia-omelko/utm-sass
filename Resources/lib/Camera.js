function CameraView(_win,_imagePreview) {
	var resizedImage;
	//var imageForPreview;
	
	var CameraView = Titanium.UI.createView({
        layout: 'horizontal',
        visible:false
	});

	_imagePreview.addEventListener('click',function(e){
		askDelete();
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
		
		photoDialog.addEventListener('click', function(e){
			
			resizedImage = null;
			
			if (e.cancel === e.index || e.cancel === true) {
				return;
			} else if (e.index === 0){
				Titanium.Media.showCamera({
					saveToPhotoGallery:false,//NOTE this is important to be set to FALSE
					mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],  //, Ti.Media.MEDIA_TYPE_VIDEO this will need work to get video working
					success:function(event) {
						
						processImage(event);
						
					},
		        	cancel:function(){
						return;
		        	},
		        	error:function(error){
		            	if (error.code == Titanium.Media.NO_CAMERA){
		            		alert('Device does not have camera capabilities');
		            	}else{
		                	alert('Unable to access camera! \nPlease use a picture from the gallery.');
		                	// Ti.API.error(JSON.stringify(error));
		            	}
		            }
				});
			} else if (e.index === 1){
				Ti.Media.openPhotoGallery({
					
					success:function(event) {
						
						processImage(event);
						
					},
		        	cancel:function(){
						return;
		        	},
		        	error:function(error){
		            	if (error.code == Titanium.Media.NO_CAMERA){
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
	
	function processImage(event){
		
		if(utm.Android){
			resizedImage = event.media.imageAsResized(event.media.width/4,event.media.height/4);
		}else{
			resizedImage = event.media.imageAsResized(event.media.width/3,event.media.height/3);
		}	
		
		_imagePreview.setImage(resizedImage);
		_imagePreview.visible=true;
		
	}
	
	function askDelete(){
		
		var deleteDialog = Ti.UI.createOptionDialog({
			title:'Do you want to remove the attach file?',
			options:['Yes','Cancel'],
			cancel:1,
			selectedIndex:0,
			destrutive:1
		});
		
		deleteDialog.addEventListener('click', function(e){
			if (e.cancel === e.index || e.cancel === true) {
				return;
			} else if (e.index === 0){
				_imagePreview.setVisible(false);
				resizedImage=null;				
			}		
		});		
		deleteDialog.show();
	}
	
	
	CameraView.getImage = function(){
		return resizedImage;
	};
	
	CameraView.reset = function(){
		_imagePreview.setVisible(false);
		resizedImage = null;	
	};
	

	return CameraView;
};

module.exports = CameraView;