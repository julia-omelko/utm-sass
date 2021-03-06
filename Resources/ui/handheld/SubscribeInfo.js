var subscribe_window = function(utm) {
	
var moment = require('lib/moment');
var Header = require('ui/common/Header');
var win = new Header(utm,L('account_info'), L('button_back'));

// This surpressess the timeout period - TV
utm.inSubscriptionMode = true;

var scrollingView = Ti.UI.createScrollView({
	layout: 'vertical',
	scrollType : 'vertical'
});
win.add(scrollingView);
var instructionLbl = Ti.UI.createLabel({ 
	top:10,
	left:10,
	right:10,
	font:{fontSize:'15dp'},
	color:utm.textColor
});
scrollingView.add(instructionLbl);
 
 
 if(utm.Android){
 	var message='';

	if(utm.User.UserProfile.MessagesRemaining <1){
		message= 'You have no more messages available \n';
	}
	
	
	if( utm.User.UserProfile.SubscriptionEnds != null){
		var now = new Date();	
		var subDate = utm.User.UserProfile.SubscriptionEnds.substring(0,10);
		subDate=subDate.replace(/-/g, '/');
		subDate = new Date(subDate);
		if( subDate < now){			
			message+='\nYour subscription has run out as of '  + 	utm.User.UserProfile.SubscriptionEnds.substring(0,	10) +'\n';			
		}	
	}
	
	
	message+='\nTo update - go to www.youthisme.com and login in to update your subscription';
	
	instructionLbl.text=message;
 	
 	
 }else{		 
		 
		// verify products
		if (!Storekit.canMakePayments) {
			alert('This device cannot make purchases!');
		} else {
		 	var aButton = [];
		 	var aDesc = [];
		 	for (var i=0;i<utm.products.length;i++) {
		 		requestProduct(utm.products[i]);
		 	}
		}
		
		// once verified, create buttons
		function productReturned(_product) {
			var productButton = Ti.UI.createButton({
				title : _product.title,
				top : 20,
				height : 70,
				width : 260,	
				enabled : true,
				padding : 5
			});
			productButton.addEventListener('click', function () {
				//Storekit.purchaseProduct(_product);
				Storekit.purchase({
					product: _product,
					applicationUsername: utm.User.UserProfile.UserId
				});
			});
			scrollingView.add(productButton);
			var productDesc = Ti.UI.createLabel({
				width : 260,	
				font: {fontSize:'16dp'},
				textAlign:'center',
				text: _product.description
			});
			scrollingView.add(productDesc);
		};
		
		
		
		/**
		 * Requests a product. Use this to get the information you have set up in iTunesConnect, like the localized name and
		 * price for the current user.
		 * @param identifier The identifier of the product, as specified in iTunesConnect.
		 * @param success A callback function.
		 * @return A Ti.Storekit.Product.
		 */
		function requestProduct(identifier) {
			Storekit.requestProducts([identifier], function (evt) {
				if (!evt.success) {
					alert('ERROR: We failed to talk to Apple!');
				} else if (evt.invalid) {
					alert('ERROR: We requested an invalid product!');
				} else {
					productReturned(evt.products[0]);
				}
			});
		}
		
		
		
		
		win.addEventListener('close',function(e){
			utm.inSubscriptionMode = false;
		});
		
		
		win.updateMessage = function(){
			message='';
			 if ( utm.User.UserProfile.MessagesRemaining < 1 ){
					message = 'You have no more messages available \n';
			}else{
				if (utm.User.UserProfile.SubscriptionEnds === null) {
					message = 'You have ' + utm.User.UserProfile.MessagesRemaining + ' messages remaining \n';
				}else{
					message='\nYour subscription renews or expires on '  + 	utm.User.UserProfile.SubscriptionEnds.substring(0,	10) +'\n';		
				}	
			}
			
			instructionLbl.text = message;
		};
		win.updateMessage();
			
		Ti.App.addEventListener('updateMessageCount',function(e){
			utm.User.UserProfile.MessagesRemaining = e.MessagesRemaining;
			utm.User.UserProfile.SubscriptionEnds = e.SubscriptionEnds;
			win.updateMessage();
		});
	}
	
	return win;

};
module.exports = subscribe_window;
