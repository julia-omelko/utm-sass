function CameraView(_win) {
	var resizedImage;
	
	var CameraView = Titanium.UI.createView({
        layout: 'vertical',
        visible:true,
        height:135
	});

		
	var imageBorder = Ti.UI.createView({
		left:25,
		//top:CameraView.height*0.01,
		//height:CameraView.height*0.3,
		height:36,
		width:Ti.Platform.displayCaps.platformWidth-50,
	//	borderColor:'black',
	//	borderWidth:1,
		backgroundColor:'#fff',
		borderRadius: 5
	});
	CameraView.add(imageBorder);
	
	var imageContainer = Ti.UI.createImageView({
		left:(imageBorder.width-36)/2,
		//top:(imageBorder.height-130)/2,
		height:36,//imageBorder.getHeight(),
		width:36//,//imageBorder.getWidth(),
	//	image:'/images/camera-ip.png'
	});
	imageBorder.add(imageContainer);
	
	imageContainer.addEventListener('click',function(e){
		askDelete();
	});
	
	
/*	imageContainer.addEventListener('click',function(e){
		this.captureImage();
	});
	*/
	CameraView.captureImage= function(){
		resizedImage = null;
		imageContainer.setHeight(130);
		imageContainer.setWidth(193);
		imageContainer.setLeft((imageBorder.width-193)/2);
		imageContainer.setTop((imageBorder.height-130)/2);
		imageContainer.setImage('/images/camera-ip.png');
		
		var photoDialog = Ti.UI.createOptionDialog({
			title:'Please provide a picture.',
			options:['Camera','Album','Cancel'],
			cancel:2,
			selectedIndex:0,
			destrutive:2
		});
		
		photoDialog.addEventListener('click', function(e){
			if (e.cancel === e.index || e.cancel === true) {
				return;
			} else if (e.index === 0){
				Titanium.Media.showCamera({
					mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],  //, Ti.Media.MEDIA_TYPE_VIDEO this will need work to get video working
					success:function(event) {
						resizedImage = event.media;
						displayRatio = (Math.max(event.media.width/imageBorder.getWidth(),event.media.height/imageBorder.getHeight()));
						thumbWidth = Math.round(event.media.width/displayRatio);
						thumbHeight = Math.round(event.media.height/displayRatio);
						
						imageContainer.setVisible(false);
						imageContainer.setWidth(thumbWidth);
						imageContainer.setLeft((imageBorder.getWidth()-thumbWidth)/2);
						imageContainer.setHeight(thumbHeight);
						imageContainer.setTop((imageBorder.getHeight()-thumbHeight)/2);
						imageContainer.setImage(event.media);
						imageContainer.setVisible(true);
					},
		        	cancel:function(){
						return;
		        	},
		        	error:function(error){
		            	if (error.code == Titanium.Media.NO_CAMERA){
		            		alert('Device does not have camera capabilities');
		            	}else{
		                	alert('Unexpected error: ' + error.code);
		            	}
		            }
				});
			} else if (e.index === 1){
				Ti.Media.openPhotoGallery({
					
					success:function(event) {
						resizedImage = event.media.imageAsResized(event.media.width/3,event.media.height/3);
				
						displayRatio = (Math.max(event.media.width/imageBorder.getWidth(),event.media.height/imageBorder.getHeight()));
						thumbWidth = Math.round(event.media.width/displayRatio);
						thumbHeight = Math.round(event.media.height/displayRatio);
						
						imageContainer.setVisible(false);
						imageContainer.setWidth(thumbWidth);
						imageContainer.setLeft((imageBorder.getWidth()-thumbWidth)/2);
						imageContainer.setHeight(thumbHeight);
						imageContainer.setTop((imageBorder.getHeight()-thumbHeight)/2);
						imageContainer.setImage(event.media.imageAsResized(thumbWidth,thumbHeight));
						imageContainer.setVisible(true);
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
		})
		photoDialog.show();
		
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
				imageContainer.setVisible(false);
				resizedImage=null;				
			}		
		});		
		deleteDialog.show();
	}
	
	
	CameraView.getImage = function(){
		return resizedImage;
	}
	
	CameraView.reset = function(){
		imageContainer.setVisible(false);
		resizedImage=null;			
	}
	

	return CameraView;
};

module.exports = CameraView;