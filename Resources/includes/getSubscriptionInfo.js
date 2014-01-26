function getSubscriptionInfo(_callBack,_fromUserId) {
	subscriptionInfoReq = Ti.Network.createHTTPClient({
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
					fn = eval(_callBack);
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
};
