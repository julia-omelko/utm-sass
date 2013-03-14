function messageDetail_window(_messageData,_curMode,utm) {
	var moment = require('lib/moment');
	var win = Ti.UI.createWindow({
		layout:'vertical'
		,backgroundColor:utm.backgroundColor
		,barColor:utm.barColor,
		visible:false
	 });
	var navGroup=false;
			
	
	//-----------------Sent On  ----------------------
	var toDate = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14, fontWeight:'bold'},
		height:'auto',
		top:2,
		textAlign:'left'
	});
	win.add(toDate);
	
	//-----------------To/From  ----------------------
	var toLabel = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14, fontWeight:'bold'},
		height:'auto',
		top:2,
		textAlign:'left'
	});
	win.add(toLabel);
	
	var grayLine1 = Ti.UI.createLabel({text:' ',backgroundColor:'gray',width:'100%',	height:.5,top:2});
	win.add(grayLine1);
	
	
	//-----------------UTM Message Label  ----------------------
	var utmMessageLabel = Ti.UI.createLabel({
		text:'UTM Message:',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14, fontWeight:'bold'},
		top:4,
		height:'auto',
		textAlign:'left'
	});
	win.add(utmMessageLabel);
	
	//-----------------UTM Message Value  ----------------------
	var utmMessageValue = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14},
		top:2,
		height:'auto',
		textAlign:'left'
	});
	win.add(utmMessageValue);
	
	var grayLine2 = Ti.UI.createLabel({text:' ',backgroundColor:'gray',width:'100%',	height:.5,top:2});
	win.add(grayLine2);
	
	//-----------------Real Message Label  ----------------------
	var realMessageLabel = Ti.UI.createLabel({
		text:'Real Message:',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14, fontWeight:'bold'},
		top:3,
		height:'auto',
		textAlign:'left'
	});
	win.add(utmMessageLabel);
	
	//-----------------Real Message Value ----------------------
	var realMessageValue = Ti.UI.createTextArea({
		value:'',
		width:'100%',
		font: {fontSize:14},
		color:utm.textFieldColor,
		top:2,
		height:'auto',
		textAlign:'left',
		editable:false
	});
	win.add(realMessageValue);
	
	//-----------------Reply To Button ----------------------
	var replyButton = Ti.UI.createButton({title:'Reply', visible:false, top:3});
	replyButton.addEventListener('click', function()
	{	utm.log('replyButton fired');
	
		getReplyToUserData(_messageData.FromUserId);
	
	  //	Ti.App.fireEvent("app:showWriteMessageView", {mode:'reply', messageData: _messageData});
		//utm.containerWindow.leftNavButton = utm.emptyView;
		
	});
	win.add(replyButton);

// ##################### Call out to get Reply To User Data #####################

	function getReplyToUserData(replyingToUserId) {

		var getMembersReq = Ti.Network.createHTTPClient({
		     validatesSecureCertificate:utm.validatesSecureCertificate 
			,onload : function(e) {
		         Ti.API.info("Received text: " + this.responseText);
		        var json = this.responseData;
				var response = JSON.parse(json);
				//Received text: [{"UserId":1004,"MyHortId":1003,"MemberType":"Primary","NickName":"Ant","HasMobile":true,"HasEmail":true,"HasFaceBook":false,"HasTwitter":false}]
				
				if(this.status ==200){					
					utm.log("data returned:"+response);
					var data = [];
					utm.curUserCurMyHortHasTwitter = false;
					
					var selectedContacts=[];
					
					selectedContacts.push({userId:response.UserId, nickName:response.nickName,userData:response[0]});
					
					Ti.App.fireEvent("app:contactsChoosen", {
				        sentToContactList: selectedContacts
				    });	
				    
				    	Ti.App.fireEvent("app:showWriteMessageView", {mode:'reply', messageData: _messageData});
					
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
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {		        
		        	handleError(e,this.status,this.responseText); 
		     }
		     ,timeout:utm.netTimeout
		});	
		getMembersReq.open("GET",utm.serviceUrl+"Members/"+_messageData.MyHortId +'?$filter=UserId eq '+replyingToUserId );
		getMembersReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	
		getMembersReq.send();			
	}

	
	// ##################### Call out to get message detail #####################
	var getMessageDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate 
		,onload: function()
		{	utm.setActivityIndicator('');
			win.visible=true;
			var json = this.responseData;
			var response = JSON.parse(json);
			
			if(this.status ==200){
				utm.log("message data returned:"+response);
				if(response.Message.length > 200){
					realMessageValue.height='55%'
				}else{
					realMessageValue.height='auto';
				}
				
				//Now that we have date set all the values
				toDate.text = 'Sent On: '+moment(_messageData.DateSent).fromNow();
				utmMessageValue.text=_messageData.UtmText;	
				realMessageValue.value = response.Message;
				
				//Mark Message as Read
				utm.log('Mark Message as Read'+ ! _messageData.WasRead);
				if(  _messageData.WasRead !=1){
					//#124 Fix issue with message list not refreshing IF message is marked as Read
					setMessageAsRead(_messageData.Id);
				}
				
				if(_curMode=='recieved'){
					toLabel.text='From:'+_messageData.FromUserName;
					replyButton.visible=true;
				}else{
					toLabel.text='To:'+_messageData.ToHeader;
					replyButton.visible=false;
				}
					
				
			}else if(this.status == 400){
				utm.recordError(response.Message)
			}else{
				utm.recordError(response.Message)
			}		
		},		
		onerror:function(e){	
			utm.setActivityIndicator('');	
			if(this.status != undefined && this.status ===404)
			{
				alert('The message you are looking for does not exist.');	
				Ti.App.fireEvent('app:refreshMessages', {showProgress:false});
			}else{
         		handleError(e,this.status,this.responseText);
         	}         			
		}
		,timeout:utm.netTimeout
	});	
	if(_curMode=='recieved'){
		getMessageDetailReq.open("GET",utm.serviceUrl+"ReceivedMessages/"+_messageData.Id);	
	}else{
		getMessageDetailReq.open("GET",utm.serviceUrl+"SentMessages/"+_messageData.Id);
	}
	
	utm.setActivityIndicator('Getting your message...');	
	getMessageDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
	getMessageDetailReq.send();		

	
	return win;
};

var getMarkMessageAsReadReq = Ti.Network.createHTTPClient({
	validatesSecureCertificate:utm.validatesSecureCertificate 
	,onload: function()
	{
		Ti.App.fireEvent('app:refreshMessages', {showProgress:false});
		
	},		
	onerror:function(e){
		handleError(e,this.status,this.responseText); 			
	}
	,timeout:utm.netTimeout
});	

function setMessageAsRead(messageId){
	
	//setTimeout(function(){callMessageAsRead(_messageData)}, 2500);	
	getMarkMessageAsReadReq.open("POST",utm.serviceUrl+"Messages/"+messageId);	
	getMarkMessageAsReadReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
	getMarkMessageAsReadReq.send();		
}


module.exports = messageDetail_window;