var MessageDetailWin = function(_tabGroup,_messageData) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Message', '');

	var trashButton = Ti.UI.createImageView({
		image: '/images/icons/trash.png',
		height: 22,
		width: 22
	});
	self.setRightNavButton(trashButton);
	
	var backButton = Ti.UI.createLabel({
		text: 'back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close({animated:true});
	});
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width:'100%',
		height:'100%',
		showVerticalScrollIndicator:true,
		contentHeight:'auto',
		layout:'vertical'
	});
	self.add(scrollingView);
	
	var userView = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth-50,
		left: 25,
		height: Ti.UI.SIZE
	});
	scrollingView.add(userView);
	
	var avatar = Ti.UI.createImageView({
		top: 25,
		left: 0,
		image: '/images/avatar/1.png',
		width: 80,
		height: 80,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	userView.add(avatar);
	
	var fromLabel = Ti.UI.createLabel({
		text: ((_messageData.mode === 'received') ? _messageData.FromUserName : _messageData.ToHeader),
		font: {fontFamily: utm.fontFamily, fontWeight: 'bold'},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-100-25),
		left: 100,
		top: 30
	});
	userView.add(fromLabel);
	
	var dateLabel = Ti.UI.createLabel({
		text: getDateTimeFormat(_messageData.DateSent),
		font: {fontFamily: utm.fontFamily},
		color: utm.secondaryTextColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: (Ti.Platform.displayCaps.platformWidth-100-25),
		left: 100,
		top: 50
	});
	userView.add(dateLabel);
	
	var utmMessageHeader = Ti.UI.createLabel({
		text: 'UTM message',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	scrollingView.add(utmMessageHeader);
	
	var utmMessage = Ti.UI.createLabel({
		text: _messageData.UtmText,
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily},
		color: 'black'		
	});
	scrollingView.add(utmMessage);
	
	
	var originalMessageHeader = Ti.UI.createLabel({
		text: 'Original message',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	scrollingView.add(originalMessageHeader);
	
	var originalMessage = Ti.UI.createLabel({
		text: '',
		top: 10,
		left: 25,
		width: Ti.Platform.displayCaps.platformWidth-50,
		font: {fontFamily: utm.fontFamily},
		color: 'black',
		height: Ti.UI.SIZE	
	});
	scrollingView.add(originalMessage);
	
	var replyBtn = Ti.UI.createButton({
		title: 'Reply',
		top: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
	replyBtn.addEventListener('click', function() {
		getSubscriptionInfo('getReplyToUserData', _messageData.FromUserId); 
	});	
	
	
	var getMessageDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate,
		onload: function() {
			var response = eval('('+this.responseText+')');
			
			if (this.status === 200) {
				//Ti.API.info("message data returned:" + JSON.stringify(response));
				
				if (_messageData.HasAttachments) {
					callOutToGetAttachments(_messageData);
				} else {
					//Mark Message as Read
					//utm.log('Mark Message as Read (no attachments):' + !_messageData.WasRead);
					if (!_messageData.WasRead) {
						setMessageAsRead(_messageData.Id);
					}
				} 	
				
				originalMessage.setText(response.Message);
				scrollingView.add(replyBtn);

			} else {
				//utm.recordError(response.Message);
			}	
			getMessageDetailReq = null;
		},		
		onerror:function(e){	
			if (this.status != undefined && this.status === 404) {
				alert('The message you are looking for does not exist.');	
				Ti.App.fireEvent('app:refreshMessages', {showProgress:false});
			}else{
         		utm.handleError(e,this.status,this.responseText);
         	}  
			getMessageDetailReq = null;       			
		},
		timeout:utm.netTimeout
	});	
	if (_messageData.mode === 'received') {
		getMessageDetailReq.open("GET",utm.serviceUrl+"ReceivedMessages/"+_messageData.Id);	
	} else {
		getMessageDetailReq.open("GET",utm.serviceUrl+"SentMessages/"+_messageData.Id);
	}	
	getMessageDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
	getMessageDetailReq.send();	
	
	
	function setMessageAsRead(messageId) {
		var getMarkMessageAsReadReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate:utm.validatesSecureCertificate,
			onload: function() {
				//utm.messageWindow.refreshMessages();
			},		
			onerror:function(e) {
				//utm.handleError(e,this.status,this.responseText); 			
			}
			,timeout:utm.netTimeout
		});	
		getMarkMessageAsReadReq.open("POST",utm.serviceUrl+"Messages/MarkAsRead/"+messageId);	
		getMarkMessageAsReadReq.setRequestHeader('Authorization-Token', utm.AuthToken);	
		getMarkMessageAsReadReq.send();		
	}
	
	function getSubscriptionInfo(_callback,_fromUserId) {
		var subscriptionInfoReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate:utm.validatesSecureCertificate, 
			onload : function() {
				var response = eval('('+this.responseText+')');
		
				if (this.status == 200) {		
					utm.User.UserProfile.MessagesRemaining = response.MessagesRemaining;
					utm.User.UserProfile.SubscriptionEnds = response.SubscriptionEnds;
					utm.User.UserProfile.HasSubscription = response.HasSubscription;
					if (utm.User.UserProfile.HasSubscription === false) {
						utm.User.UserProfile.SubscriptionEnds = null;
					}
					
					if (!isSubscriptionValid(utm.User.UserProfile.SubscriptionEnds) && utm.User.UserProfile.MessagesRemaining < 1) { 
						showSubscriptionInstructions();				
					} else {					
						//Subscription is ok so fire the callback to allow send or reply to continue
						fn = eval(_callback);
						if (_fromUserId) {
							fn.call(null,_fromUserId);						
						} else {
							fn.call();
						}	
					}			
				} else {
					utm.handleError(e, this.status, this.responseText);
					//utm.recordError("Status="+this.status + "   Message:"+this.responseText);
				}
			},
			onerror : function(e) {		
				utm.handleError(e, this.status, this.responseText);
			},
			timeout:utm.netTimeout
		});
		
		subscriptionInfoReq.open("GET", utm.serviceUrl + "SubscriptionInfo");
		subscriptionInfoReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		subscriptionInfoReq.send();
	};
	
	function showSubscriptionInstructions(){
		var SubscriptionInfoWin = require('/ui/handheld/SubscribeInfo');
		subscriptionInfoWin = new SubscriptionInfoWin();
		
		subscriptionInfoWin.open();
		subscriptionInfoWin.updateMessage();
	}
	
	function getReplyToUserData(replyingToUserId) {

		var getMembersReq = Ti.Network.createHTTPClient({
		    validatesSecureCertificate:utm.validatesSecureCertificate, 
			onload : function(e) {
		        
				var response = eval('('+this.responseText+')');
				
				if (this.status == 200) {					
					if (response.length === 0) {
						alert('Unable to send a message to this member, the member is no longer a member of this MyHort.');
						return;
					}
					
					//utm.log("data returned:"+response);
					var data = [];
					utm.curUserCurMyHortHasTwitter = false;
					utm.curUserCurMyHortHasFacebook = false;
					utm.curUserCurMyHortNickName  = _messageData.ToHeader;
					
					var selectedContacts = [];
					
					selectedContacts.push({
						//userId: response[0].UserId, 
						//nickName: response[0].NickName,
						userData: response[0]
					});
					
					var ComposeWin = require('/ui/common/Compose');
					var composeWin = new ComposeWin(_tabGroup,selectedContacts,'Reply',_messageData.Id);
					utm.winStack.push(composeWin);
					_tabGroup.getActiveTab().open(composeWin);
					
					
					//Ti.App.fireEvent("app:contactsChoosen", {
				    //    sentToContactList: selectedContacts
				    //});	
					
			    	//Ti.App.fireEvent("app:showWriteMessageView", {mode:'reply', messageData: _messageData});
					
				} else if (this.status == 400) {				
					utm.recordError(response.Message+ ' ExceptionMessage:' + response.ExceptionMessage);			
				} else {
					utm.log("error");				
				}		
				
				getMembersReq = null;
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {		        
		     	alert(e);
		        	utm.handleError(e,this.status,this.responseText); 
		        	getMembersReq = null;
		     }
		     ,timeout:utm.netTimeout
		});	
		getMembersReq.open("GET",utm.serviceUrl+"Members/"+_messageData.MyHortId +'?$filter=UserId eq '+replyingToUserId );
		getMembersReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	
		getMembersReq.send();			
	};
	
	
	
	return self;
};
module.exports = MessageDetailWin;

