function messageDetail_window(_messageData,_curMode,utm) {
	var moment = require('lib/moment');
	var imageViews=[];

	var Header = require('ui/common/Header');

	var win = new Header(utm, 'Message', 'Messages');
		
	// set scroll context differently for platform
	if(utm.Android){
		var scrollingView = Ti.UI.createScrollView({
			scrollType : 'vertical'
		});
	}
	if(utm.iPhone || utm.iPad ){	
		var scrollingView = Ti.UI.createScrollView({
			contentWidth: utm.SCREEN_WIDTH,
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : false
		});
	}
	win.add(scrollingView);

	var view = Ti.UI.createView({
		layout : 'vertical'
	});

	scrollingView.add(view);
			
	
	//-----------------Sent On  ----------------------
	var toDate = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:'14dp', fontWeight:'bold'},
		height:'auto',
		top:2,
		color : '#000',
		textAlign:'left'
	});
	view.add(toDate);
	
	//-----------------To/From  ----------------------
	var toLabel = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:'14dp', fontWeight:'bold'},
		height:'auto',
		top:2,
		color : '#000',
		textAlign:'left' 
	});
	view.add(toLabel);
	
	var grayLine1 = Ti.UI.createLabel({text:' ',backgroundColor:'gray',width:'100%',height:'.5dp',top:2});
	view.add(grayLine1);
	
	
	//-----------------UTM Message Label  ----------------------
	var utmMessageLabel = Ti.UI.createLabel({
		text:'UTM Message:',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:'14dp', fontWeight:'bold'},
		top:4,
		color : '#000',
		textAlign:'left'
	});
	view.add(utmMessageLabel);
	
	//-----------------UTM Message Value  ----------------------
	var utmMessageValue = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:'16dp'},
		top:2,
		height:'auto',
		color : '#000',
		textAlign:'left'
	});
	view.add(utmMessageValue);
	
	var grayLine2 = Ti.UI.createLabel({text:' ',backgroundColor:'gray',width:'100%',	height:'.5dp',top:2});
	view.add(grayLine2);
	
	//-----------------Real Message Label  ----------------------
	var realMessageLabel = Ti.UI.createLabel({
		text:'Real Message:',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:'14dp', fontWeight:'bold'},
		top:3,
		height:Titanium.UI.SIZE ,
		color : '#000',
		textAlign:'left'
	});
	view.add(realMessageLabel);
	
	//-----------------Real Message Value ----------------------
	var realMessageValue = Ti.UI.createLabel({
		value:'',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:'16dp'},
		color:utm.textFieldColor,
		top:2,
		height:Titanium.UI.SIZE ,
		textAlign:'left'
	});
	view.add(realMessageValue);
	
	//-----------------Reply To Button ----------------------
	var replyButton = Ti.UI.createButton({title:'Reply', visible:true});
	replyButton.addEventListener('click', function()
	{																						//NOTE can't pass function only the string
		Ti.App.fireEvent("app:getSubscriptionInfo", {callBack:'utm.messageDetailWindow.getReplyToUserData', fromUserId:_messageData.FromUserId});  //call back IF the user is allowed to send messages	
	});	

	view.add(replyButton);
		
	var bottomSpacerView = Ti.UI.createView({height:'10dp'});
	view.add(bottomSpacerView);
	
	var scrollVu = Ti.UI.createScrollableView({	  
		top:4,
	    cacheSize:3,
	    visible:false
	});
	view.add(scrollVu);
	

// ##################### Call out to get Reply To User Data #####################

	win.getReplyToUserData = function(replyingToUserId) {

		var getMembersReq = Ti.Network.createHTTPClient({
		     validatesSecureCertificate:utm.validatesSecureCertificate 
			,onload : function(e) {
		         Ti.API.info("Received text: " + this.responseText);
		        var response = eval('('+this.responseText+')');
				//Received text: [{"UserId":1004,"MyHortId":1003,"MemberType":"Primary","NickName":"Ant","HasMobile":true,"HasEmail":true,"HasFaceBook":false,"HasTwitter":false}]
				
				if(this.status ==200){					
					utm.log("data returned:"+response);
					var data = [];
					utm.curUserCurMyHortHasTwitter = false;
					utm.curUserCurMyHortHasFacebook = false;
					utm.curUserCurMyHortNickName  = _messageData.ToHeader;
					
					var selectedContacts=[];
					
					selectedContacts.push({userId:response.UserId, nickName:response.nickName,userData:response[0]});
					
					Ti.App.fireEvent("app:contactsChoosen", {
				        sentToContactList: selectedContacts
				    });	
					
					
				    
				    	Ti.App.fireEvent("app:showWriteMessageView", {mode:'reply', messageData: _messageData});
				
				/*  ATD We dont have the data here for the cur user's MyHort if has Twitter/Facebook
					for(i=0; i< utm.User.MyHorts.length; i++ ){
						var mh = utm.User.MyHorts[i];
						if(mh.MyHortId= response[0].MyHortId){
							
							for (x=0; x < mh.Members.length; x++){
								
								var curMember = mh.Member[x];
								
									if (response[i].HasTwitter) {
										utm.curUserCurMyHortHasTwitter = true;
									}
									if (response[i].HasFaceBook) {
										utm.curUserCurMyHortHasFacebook = true;
									}	
							}							
							
							break;
						}
					}
					*/
					
					
				    	
					
				/*	for (var i=0;i<response.length;i++)
					{
						var row = Ti.UI.createTableViewRow({UserId:response[i].UserId, id:i, nickName:response[i].NickName,height:35,userData:response[i]});
						
						var l = Ti.UI.createLabel({left:5, font:{fontSize:16}, height:30,color:'#000',text:response[i].NickName});
						row.add(l);
						
						if(utm.User.UserProfile.UserId ===response[i].UserId ){
							if(response[i].HasTwitter){
								utm.curUserCurMyHortHasTwitter=true;
							}
						}
						
						data[i] = row;
					}
				
		*/
					
				}else if(this.status == 400){				
					utm.recordError(response.Message+ ' ExceptionMessag:'+response.ExceptionMessage);			
				}else{
					utm.log("error");				
				}		
				getMembersReq=null;
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {		        
		        	utm.handleError(e,this.status,this.responseText); 
		        	getMembersReq=null;
		     }
		     ,timeout:utm.netTimeout
		});	
		getMembersReq.open("GET",utm.serviceUrl+"Members/"+_messageData.MyHortId +'?$filter=UserId eq '+replyingToUserId );
		getMembersReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	
		getMembersReq.send();			
	};

	win.getMessageDetails = function (){
		utm.setActivityIndicator(win , 'Loading Message...');	
		getMessageDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMessageDetailReq.send();	
	};
	
	// ##################### Call out to get message detail #####################
	var getMessageDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate 
		,onload: function()
		{	
			win.visible=true;
			var response = eval('('+this.responseText+')');
			
			if(this.status ==200){
				utm.log("message data returned:"+response);
				if(response.Message.length > 1000){
					view.height=Titanium.UI.SIZE ;
				}else{
					//view.height=2000;
				}
				
				if(_messageData.HasAttachments){
					callOutToGetAttachments(_messageData);
				}	
				
				//Now that we have date set all the values
				toDate.text = 'Sent: '+getDateTimeFormat(_messageData.DateSent);
				utmMessageValue.text=_messageData.UtmText;	
				realMessageValue.text = response.Message;
				
				//Mark Message as Read
				utm.log('Mark Message as Read'+ ! _messageData.WasRead);
				if(  _messageData.WasRead !=1){
					//#124 Fix issue with message list not refreshing IF message is marked as Read
					setMessageAsRead(_messageData.Id);
				}
				
				if(_curMode=='recieved'){
					toLabel.text='From: '+_messageData.FromUserName;
				}else{
					toLabel.text='To: '+_messageData.ToHeader;
					replyButton.visible=false;
				}
					
				
			}else if(this.status == 400){
				utm.recordError(response.Message);
			}else{
				utm.recordError(response.Message);
			}	
			
			//This hide message call clears the loading attachment message
			if(! _messageData.HasAttachments){
				utm.setActivityIndicator(win , '');
			}	
		},		
		onerror:function(e){	
			utm.setActivityIndicator(win , '');	
			if(this.status != undefined && this.status ===404)
			{
				alert('The message you are looking for does not exist.');	
				Ti.App.fireEvent('app:refreshMessages', {showProgress:false});
			}else{
         		utm.handleError(e,this.status,this.responseText);
         	}         			
		}
		,timeout:utm.netTimeout
	});	
	if(_curMode=='recieved'){
		getMessageDetailReq.open("GET",utm.serviceUrl+"ReceivedMessages/"+_messageData.Id);	
	}else{
		getMessageDetailReq.open("GET",utm.serviceUrl+"SentMessages/"+_messageData.Id);
	}	
	
	var getMarkMessageAsReadReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate 
		,onload: function()
		{
			Ti.App.fireEvent('app:refreshMessages', {showProgress:false});
			
		},		
		onerror:function(e){
			utm.handleError(e,this.status,this.responseText); 			
		}
		,timeout:utm.netTimeout
	});	
	
	function setMessageAsRead(messageId){		
		//setTimeout(function(){callMessageAsRead(_messageData)}, 2500);	
		getMarkMessageAsReadReq.open("POST",utm.serviceUrl+"Messages/MarkAsRead/"+messageId);	
		getMarkMessageAsReadReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMarkMessageAsReadReq.send();		
	}
		
	function callOutToGetAttachments(_messageData){		
		utm.setActivityIndicator(win , 'Loading Attachment...');	
		for(i=0;i < _messageData.Attachments.length;i++){		
			
			
			var getAttachmentsReq = Ti.Network.createHTTPClient({
				validatesSecureCertificate:utm.validatesSecureCertificate 
				,onload: function()
				{
					var response = eval('('+this.responseText+')');
					
					if(this.status ==200){
						populateImageViews(response);
					}
					getAttachmentsReq=null;
					utm.setActivityIndicator(win , '');		
				},		
				onerror:function(e){
					utm.handleError(e,this.status,this.responseText); 		
					getAttachmentsReq=null;	
					utm.setActivityIndicator(win , '');
				}
				,timeout:utm.netTimeout
			});	
			
						
			getAttachmentsReq.open("GET",utm.serviceUrl+"Attachment/"+_messageData.Attachments[i].Id);	
			getAttachmentsReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
			getAttachmentsReq.send();				
			
		}		
		
		if( _messageData.Attachments.length ==1){
			scrollVu.visible=true;
			showPagingControl:false;
		}else if( _messageData.Attachments.length > 1){
			scrollVu.visible=true;
			showPagingControl=true;
	    		pagingControlOnTop=true;
		}
	}
	

	function populateImageViews(_attachment){
		var imageSrc = _attachment.Attachment;	

		try{
			var singleImageView = Ti.UI.createImageView();
			singleImageView.setImage(Ti.Utils.base64decode(imageSrc));
			imageViews.push(singleImageView);
			scrollVu.width = singleImageView.width;
			scrollVu.height = singleImageView.height;
			scrollVu.views=imageViews;	
		}catch(e){
			alert('Device out of memory error - your device does not have enough memory available to load the attachment.');	
			//could fail but nothing we can do with it
		}
	}

	return win;
};


module.exports = messageDetail_window;