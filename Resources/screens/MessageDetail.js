function messageDetail_window(_messageData) {
	var win = Ti.UI.createWindow({backgroundColor:'#fff',visible:true,layout:'vertical' });
		
	var messageArea = Ti.UI.createLabel({
	  color: '#900',
	  text: '',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  width: 'auto', height: 0
	});
	win.add(messageArea);
	
	//-----------------From  ----------------------
	var toDate = Ti.UI.createLabel({
		text:'Sent On:'+_messageData.DateSent,
		width:utm.SCREEN_WIDTH-10,
		font: {fontSize:14, fontWeight:'bold'},
		height:'auto',
		top:2,
		textAlign:'left'
	});
	win.add(toDate);
	
	//-----------------From  ----------------------
	var toLabel = Ti.UI.createLabel({
		text:'From:'+_messageData.ToUserId,
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
	
	
	// ##################### Call out to get message detail #####################
	var getMessageDetailReq = Ti.Network.createHTTPClient({
		
		onError:function(e){
			log('Get Message Service Error:'+e.error);
         	alert('Get Message Service Error:'+e.error);			
		}
	});	
	
	getMessageDetailReq.open("GET",utm.serviceUrl+"ReceivedMessages/"+_messageData.Id);	
	getMessageDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
	getMessageDetailReq.send();		
	
	getMessageDetailReq.onload = function()
	{
		var json = this.responseData;
		var response = JSON.parse(json);
		var tableData = [];
		
		if(this.status ==200){
			log("message data returned:"+response);
			utmMessageValue.text = response.Message;
			//Mark Message as Read
			getMarkMessageAsReadReq();
			
		}else if(this.status == 400){
			messageArea.setText("Error:"+this.responseText);
		}else{
			messageArea.test="error";
		}		
	};
	
	return win;
};

var getMarkMessageAsReadReq = Ti.Network.createHTTPClient({
			
	onError:function(e){
		log('Mark Message as Read Service Error:'+e.error);
     	alert('Mark Message as Read Service Error:'+e.error);			
	}
	
});	

function setMessageAsRead(){
	setTimeout(function()
	{
		getMarkMessageAsReadReq.open("POST",utm.serviceUrl+"Messages/"+_messageData.Id);	
		getMarkMessageAsReadReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMarkMessageAsReadReq.send();			
	},2500);		
}

function isJSON(data) {
    var isJson = false
    try {
        // this works with JSON string and JSON object, not sure about others
       var json = $.parseJSON(data);
       isJson = typeof json === 'object' ;
    } catch (ex) {
        log('data is not JSON:'+data);
    }
    return isJson;
}

module.exports = messageDetail_window;