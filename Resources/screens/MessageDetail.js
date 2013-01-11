function messageDetail_window(_messageData,_curMode) {
	var moment = require('lib/moment');
	var win = Ti.UI.createWindow({backgroundColor:'#fff',layout:'vertical' });
	var navGroup=false;
			
	
	//-----------------Sent On  ----------------------
	var toDate = Ti.UI.createLabel({
		text:'Sent On: '+moment(_messageData.DateSent).fromNow(),
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14, fontWeight:'bold'},
		height:'auto',
		top:2,
		textAlign:'left'
	});
	win.add(toDate);
	
	//-----------------To/From  ----------------------
	var toLabel = Ti.UI.createLabel({
		//text:'From:'+_messageData.ToUserId,
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
		text:_messageData.UtmText,
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
	var utmMessageLabel = Ti.UI.createLabel({
		text:'Real Message:',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14, fontWeight:'bold'},
		top:3,
		height:'auto',
		textAlign:'left'
	});
	win.add(utmMessageLabel);
	
	//-----------------Real Message Value ----------------------
	var utmMessageValue = Ti.UI.createTextArea({
		value:'',
		width:'100%',
		font: {fontSize:14},
		top:2,
		height:'auto',
		textAlign:'left',
		editable:false
	});
	win.add(utmMessageValue);
	
	//-----------------Reply To Button ----------------------
	var replyButton = Ti.UI.createButton({title:'Reply', visible:false, top:3});
	replyButton.addEventListener('click', function()
	{	log('replyButton fired');
	  	Ti.App.fireEvent("app:showWriteMessageView", {mode:'reply', messageData: _messageData});
		//utm.containerWindow.leftNavButton = utm.emptyView;
		
	});
	win.add(replyButton);

	
	
	// ##################### Call out to get message detail #####################
	var getMessageDetailReq = Ti.Network.createHTTPClient({
		onload: function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			
			if(this.status ==200){
				log("message data returned:"+response);
				if(response.Message.length > 200){
					utmMessageValue.height='55%'
				}else{
					utmMessageValue.height='auto';
				}
				utmMessageValue.value = response.Message;
				//Mark Message as Read
				log('xxxx'+ ! _messageData.WasRead);
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
				recordError(response.Message)
			}else{
				recordError(response.Message)
			}		
		},		
		onerror:function(e){	
         	handleError(e);         			
		}
		,timeout:utm.netTimeout
	});	
	if(_curMode=='recieved'){
		getMessageDetailReq.open("GET",utm.serviceUrl+"ReceivedMessages/"+_messageData.Id);	
	}else{
		getMessageDetailReq.open("GET",utm.serviceUrl+"SentMessages/"+_messageData.Id);
	}
		
	getMessageDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
	getMessageDetailReq.send();		

	
	return win;
};

var getMarkMessageAsReadReq = Ti.Network.createHTTPClient({
	onload: function()
	{
		Ti.App.fireEvent('app:refreshMessages');
		
	},		
	onerror:function(e){
		handleError(e);   			
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