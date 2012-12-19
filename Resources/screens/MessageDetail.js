function messageDetail_window(_messageData,_curMode) {
	var moment = require('lib/moment');
	var win = Ti.UI.createWindow({backgroundColor:'#fff',visible:true,layout:'vertical' });
			
	var messageArea = Ti.UI.createLabel({
	  color: '#900',
	  text: '',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  width: 'auto', height: 0
	});
	win.add(messageArea);
	
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
	var utmMessageValue = Ti.UI.createLabel({
		text:'',
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14},
		top:2,
		height:'auto',
		textAlign:'left'
	});
	win.add(utmMessageValue);
	
	utm.backToMessagesButton = Ti.UI.createButton({title:'Messages'});
	utm.backToMessagesButton.addEventListener('click', function()
	{	log('backToMessagesButton fired');
	  	Ti.App.fireEvent("app:backToMessageWindow", {});
		//utm.containerWindow.leftNavButton = utm.emptyView;
	});
	
	utm.containerWindow.leftNavButton = utm.backToMessagesButton;
	
	if(_curMode=='recieved'){
		toLabel.text='From:'+_messageData.FromUserName;
	}else{
		toLabel.text='From:'+_messageData.ToHeader;
	}
	
	
	// ##################### Call out to get message detail #####################
	var getMessageDetailReq = Ti.Network.createHTTPClient({
		onload: function()
		{
			var json = this.responseData;
			var response = JSON.parse(json);
			
			if(this.status ==200){
				log("message data returned:"+response);
				utmMessageValue.text = response.Message;
				//Mark Message as Read
				if(_curMode=='recieved'){
					setMessageAsRead(_messageData.Id);
				}	
				
			}else if(this.status == 400){
				recordError(response.Message)
			}else{
				recordError(response.Message)
			}		
		},		
		onError:function(e){
         	recordError('Send Message Service Error:'+e.error);			
		}
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
		var json = this.responseData;
		var response = JSON.parse(json);
	},		
	onError:function(e){
		log('Mark Message as Read Service Error:'+e.error);
     	alert('Mark Message as Read Service Error:'+e.error);			
	}
	
});	

function setMessageAsRead(messageId){
	
	//setTimeout(function(){callMessageAsRead(_messageData)}, 2500);	
	getMarkMessageAsReadReq.open("POST",utm.serviceUrl+"Messages/"+messageId);	
	getMarkMessageAsReadReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
	getMarkMessageAsReadReq.send();		
}


module.exports = messageDetail_window;