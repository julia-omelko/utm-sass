var SettingsWin = function(_tabGroup) {
	var Storekit = require('ti.storekit');
	utm.screenWillLock = false;
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Buy Messages', true);

	var updateDisplay = function() {
		self.fireEvent('reorientdisplay');
	};
	Ti.App.addEventListener('orientdisplay', updateDisplay);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	
	var scrollingView = Ti.UI.createScrollView({
		layout : 'vertical',
		height: utm.viewableArea,
		top: utm.viewableTop,
		width: Ti.UI.FILL
	});
	self.add(scrollingView);
	
	self.addEventListener('reorientdisplay', function(evt) {
		scrollingView.height = utm.viewableArea;
	});	

	var instructionLbl = Ti.UI.createLabel({ 
		top: 15,
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor,	
		textAlight: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	scrollingView.add(instructionLbl);

	if (utm.iPad || utm.iPhone) {	
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
			Ti.API.info(_product);
			Ti.API.info(_product.identifier);
			if (_product.identifier === 'com.youthisme.unlimited') {
				var theButton = 'Unlimited messages for 99 cents per month';
				var theDesc = 'Send as many UTM messages as you\'d like for 99 cents per month.  This is an auto-renewing subscription.';
				
			} else if (_product.identifier === 'com.youthisme.20for99') {
				var theButton = '20 messages for 99 cents';
				var theDesc = 'Send 20 UTM messages for 99 cents.  These messages never expire.';

			} else {
				var theButton = _product.title;
				var theDesc = _product.description;
			}
			var productDesc = Ti.UI.createLabel({
				width: (Ti.Platform.displayCaps.platformWidth-50),
				height: Ti.UI.SIZE,
				top: 35,
				font: {fontFamily: utm.fontFamily, fontSize:'16dp'},
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				text: theDesc
			});
			scrollingView.add(productDesc);
			
			self.addEventListener('reorientdisplay', function(evt) {
				productDesc.width = (Ti.Platform.displayCaps.platformWidth-50);
			});	
			
			var productButton = Ti.UI.createButton({
				title: theButton,
				top: 10,
				width: (Ti.Platform.displayCaps.platformWidth-50),
				height: 40,
				borderRadius: 20,
				font: {fontFamily: utm.fontFamily, fontSize:'14dp'},
				backgroundColor: utm.buttonColor,
				color: 'white',
				style: Ti.UI.iOS.SystemButtonStyle.PLAIN
			});	
			productButton.addEventListener('click', function () {
				Ti.API.info(utm.User.UserProfile.UserId);
				Storekit.purchase({
					product: _product,
					applicationUsername: utm.User.UserProfile.UserId
				});
			});
			scrollingView.add(productButton);
			
			self.addEventListener('reorientdisplay', function(evt) {
				productButton.width = (Ti.Platform.displayCaps.platformWidth-50);
			});	
		};
		
		
		
		/**
		 * Requests a product. Use this to get the information you have set up in iTunesConnect, like the localized name and
		 * price for the current user.
		 * @param identifier The identifier of the product, as specified in iTunesConnect.
		 * @param success A callback function.
		 * @return A Ti.Storekit.Product.
		 */
		function requestProduct(identifier) {
			Storekit.requestProducts([identifier.ProductName], function (evt) {
				
				 
				if (!evt.success) {
					Ti.API.info('NOTE Storekit call to Apple does not work in Simulator');
					alert('ERROR: We failed to talk to Apple!');
				} else if (evt.invalid) {
					alert('ERROR: We requested an invalid product!');
				} else {
					productReturned(evt.products[0]);
				}
				self.hideAi();
			});
		}
		
	} else {
		// Android
		for (var i=0; i<utm.androidProducts.length; i++) {
			var productDesc = Ti.UI.createLabel({
				width: (Ti.Platform.displayCaps.platformWidth-50),
				height: Ti.UI.SIZE,
				top: 20,
				font: {fontFamily: utm.fontFamily, fontSize:'16dp'},
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				text: utm.androidProducts[i].description,
				color: 'black'
			});
			scrollingView.add(productDesc);
		
			self.addEventListener('reorientdisplay', function(evt) {
				productDesc.width = (Ti.Platform.displayCaps.platformWidth-50);
			});	
			
			var productButton = Ti.UI.createButton({
				title: utm.androidProducts[i].title,
				top: 10,
				width: (Ti.Platform.displayCaps.platformWidth-50),
				height: 40*utm.sizeMultiplier,
				borderRadius: 20*utm.sizeMultiplier,
				font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
				backgroundColor: utm.buttonColor,
				color: 'white',
				style: Ti.UI.iOS.SystemButtonStyle.PLAIN,
				_product: i
			});	
			productButton.addEventListener('click', function (evt) {
				Ti.API.info(utm.androidProducts[evt.source._product]);
				currentProduct = utm.androidProducts[evt.source._product];
				
				self.showAi();
				appPayload = 'AppPayloadRandom#' + Math.round(Math.random() * 1000);	
				currentProduct.purchase({
					quantity : 1,
					applicationPayload: appPayload
				});
			});
			productButton.addEventListener('twofingertap', function (evt) {
				Ti.App.fireEvent('App:getPurchases');
			});
			
			scrollingView.add(productButton);
			
			self.addEventListener('reorientdisplay', function(evt) {
				productButton.width = (Ti.Platform.displayCaps.platformWidth-50);
			});	
			self.hideAi();
		}

		Ti.App.addEventListener('App:purchaseStateChange',purchaseStateChange);
		function purchaseStateChange(e){
			self.hideAi();
			//alert(e);
		};
		
		
		function purchaseComplete(_purchase) {
			self.hideAi();
			var theUrl = 'https://www.googleapis.com/androidpublisher/v1.1/applications/com.youthisme.android/inapp/com.youthisme.unlimited/purchases/' + e.purchases[0].purchaseToken + '?key=AIzaSyC8B3yy1P90_NNPVrAZc-rLFiv_SlqlfTM';
		
			Ti.Platform.openURL('http://www.troyweb.com?data=' + JSON.stringify(_purchase));
		}
	}
		
	
	self.updateMessage = function(){
		message='';
		if (utm.User.UserProfile.SubscriptionEnds !== null) {
			message = 'You have unlimited messages \n';
		} else if ( utm.User.UserProfile.MessagesRemaining < 1 ){
			message = 'You have no more messages available \n';
		} else {
			message = 'You have ' + utm.User.UserProfile.MessagesRemaining + ' messages remaining \n';
		}
		instructionLbl.text = message;
	};
	self.updateMessage();
		
	Ti.App.addEventListener('updateMessageCount',function(e){
		utm.User.UserProfile.MessagesRemaining = e.MessagesRemaining;
		utm.User.UserProfile.SubscriptionEnds = e.SubscriptionEnds;
		self.updateMessage();
	});
	
	var tableData = [];
	tableData[0] = Ti.UI.createTableViewRow({
		title: 'Privacy Policy',
		height: 35*utm.sizeMultiplier,
		backgroundColor: 'white',
		hasChild: true,
		color: 'black',
		font: {fontFamily: utm.fontFamily, fontSize:'14dp' }
	});
	tableData[0].addEventListener('click', function(e){
		var WebView = require('/ui/common/WebView');
		//var webView = new WebView('Privacy Policy', 'privacy');
		var webView = new WebView('Privacy Policy', utm.webUrl + '/Home/Privacy');
		_tabGroup.getActiveTab().open(webView);
	});
	tableData[1] = Ti.UI.createTableViewRow({
		title: 'Rules of Use',
		height: 35*utm.sizeMultiplier,
		backgroundColor: 'white',
		hasChild: true,
		color: 'black',
		font: {fontFamily: utm.fontFamily, fontSize:'14dp' }
	});
	tableData[1].addEventListener('click', function(e){
		var WebView = require('/ui/common/WebView');
		//var webView = new WebView('Rules of Use', 'rules'); 
		var webView = new WebView('Rules of Use', utm.webUrl + '/Home/RulesOfUse');
		_tabGroup.getActiveTab().open(webView);
	});
	
	var linkTable = Ti.UI.createTableView({
		data: tableData,
		bottom: 0,
		height: Ti.UI.SIZE
	});
	self.add(linkTable);
	
	
	self.addEventListener('close',function(e){
		utm.screenWillLock = true;
	});
	
	
	self.addEventListener('close', function(e) {
		InAppProducts = null;
		Ti.App.removeEventListener('orientdisplay', updateDisplay);
	});		

	return self;
};
module.exports = SettingsWin;

