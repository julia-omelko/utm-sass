function myHortDetail_window(_myHortData,utm) {

	var InputField = require('ui/common/baseui/InputField');
	var MyHortPendingWindow = require('ui/handheld/MyHortPending');
	var MyHortInviteWindow = require('ui/handheld/MyHortInvite');
	//var Social = require("com.0x82.social");
	
	var twitterEnabledForUser = false;
	utm.MyHortDetails = false;

	var win = Ti.UI.createWindow({
		layout : 'vertical',
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor
	});

	//-----------------Top Buttons  ----------------------
	var topButtonBar = Titanium.UI.createButtonBar({
		labels : ['Invite', 'Pending Invites'],
		top : 3,
		backgroundColor : '#336699',
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : 40,
		width : '95%',
		enable:false
	});
	win.add(topButtonBar);

	//-----------------MyHort Name  ----------------------
	var myHortNameGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 3,
		bottom : 3,
		height : 50
	});
	win.add(myHortNameGroup);

	var myHortNamelbl = Ti.UI.createLabel({
		text : 'MyHort ',
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		},
		height : 'auto',
		top : 2,
		textAlign : 'left'
	});
	myHortNameGroup.add(myHortNamelbl);

	var myHortName = Ti.UI.createLabel({
		text : _myHortData.FriendlyName,
		width : utm.SCREEN_WIDTH - 100,
		font : {
			fontSize : 14,
		},
		height : 'auto',
		top : 2,
		textAlign : 'left'
	});
	myHortNameGroup.add(myHortName);

	//----------Email--------------------
	var email = new InputField('Email', 80, '', 210, Ti.UI.KEYBOARD_EMAIL);
	win.add(email);

	//----------Twitter On off Switch--------------------
	var twitterGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 3,
		height : 50
	});
	var twitterLabel = Ti.UI.createLabel({
		text : 'Twitter',
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		},
		width : 100,
		textAlign : 'left'
	});
	twitterGroup.add(twitterLabel);

	var twitterSwitch = Ti.UI.createSwitch({
		value : false,
		enabled:false
	});
	twitterGroup.add(twitterSwitch);

	twitterSwitch.addEventListener('change', function(e) {		
		if(e.value){
		//	authTwitter();
		}
	});
	win.add(twitterGroup);

	//----------Facebook--------------------
	var faceBook = new InputField('FaceBook', 80, '', 210);
	win.add(faceBook);

	//----------Mobile # --------------------
	var mobile = new InputField('Mobile', 80, '', 210, Ti.UI.KEYBOARD_DECIMAL_PAD);
	win.add(mobile);

	var saveButton = Ti.UI.createButton({
		title : 'Save MyHort',
		top : 3,
		enabled : false
	});
	saveButton.addEventListener('click', function() {
		utm.log('saveButton fired');
		updateMyHortData();
	});
	win.add(saveButton);

	function authTwitter() {

		var twitter = social.create({
			site : 'Twitter', // <-- this example is for Twitter. I'll expand this to other sites in the future.
			consumerKey : '8qiy2PJv3MpVyzuhfNXkOw', // <--- you'll want to replace this
			consumerSecret : 'Qq0rth4MHGB70nh20nSzov2zz6GbVxuVndCh2IxkRWI' // <--- and this with your own keys!
		});

		twitter.share({
			message : 'Hello, world!',
			success : function() {
				alert('Tweeted!');
			},
			error : function(error) {
				alert('Oh no! ' + error);
			}
		});
	}

	function updateMyHortData() {
		saveButton.enabled=false;
		utm.myHortDetails.PrimaryUser.Email = email.getValue();
		utm.myHortDetails.PrimaryUser.Mobile = mobile.getValue();
		utm.myHortDetails.PrimaryUser.FaceBook = faceBook.getValue();
		//TODO Handle Twitter diff myHortDetails.PrimaryUser.TwitterToken=;

		if (twitterSwitch.getValue()) {
			if (!twitterEnabledForUser) {
				//original value has changed so now we need to enable twitter
				authTwitter();
			}

		} else {
			if (twitterEnabledForUser) {
				//Original value has changes so we need to deactivate twitter
				utm.myHortDetails.PrimaryUser.TwitterToken = '';
				utm.myHortDetails.PrimaryUser.TwitterSecret = '';
			}
		}

		utm.setActivityIndicator('Updating...');
		updateMyHortDetailReq.open("POST", utm.serviceUrl + "MyHort/UpdateMyHortDetails");
		updateMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		updateMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);

		updateMyHortDetailReq.send(JSON.stringify(utm.myHortDetails));
	}

	// ##################### Call out to get myHort detail #####################
	var getMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {			
			
			win.visible = true;
			var json = this.responseData;
			utm.myHortDetails = JSON.parse(json);

			if (this.status == 200) {
				utm.log("myHort data returned:" + utm.myHortDetails);

				//Now that we have date set all the values
				email.setValue(utm.myHortDetails.PrimaryUser.Email);
				mobile.setValue(utm.myHortDetails.PrimaryUser.Mobile);
				faceBook.setValue(utm.myHortDetails.PrimaryUser.FaceBook);

				if (utm.myHortDetails.PrimaryUser.TwitterToken != '') {
					twitterSwitch.setValue(true);
					twitterEnabledForUser = true;
				} else {
					twitterSwitch.setValue(false);
					twitterEnabledForUser = false;
				}
				saveButton.enabled = true;
				//TODO handle errors better
			} else if (this.status == 400) {
				utm.recordError(utm.myHortDetails.MyHort)
			} else {
				utm.recordError(utm.myHortDetails.MyHort)
			}
			topButtonBar.enabled=true;
			utm.setActivityIndicator('');
		},
		onerror : function(e) {
			utm.setActivityIndicator('');
			if (this.status != undefined && this.status === 404) {
				alert('The myHort you are looking for does not exist.');
			} else {
				utm.handleError(e, this.status, this.responseText);
			}
		},
		timeout : utm.netTimeout
	});

	// ##################### Call out to Update myHort  #####################
	var updateMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			
			var json = this.responseData;
			if (this.status == 200) {
				utm.setActivityIndicator('Update Complete');
				utm.navGroup.close(utm.myHortDetailWindow);
				Ti.App.fireEvent("app:showMyHortWindow", {});
				utm.setActivityIndicator('');
				//TODO handle errors better
			} else if (this.status == 400) {
				utm.recordError('error')
			} else {
				utm.recordError(utm.myHortDetails.MyHort)
			}
		},
		onerror : function(e) {
			utm.setActivityIndicator('');
			if (this.status != undefined && this.status === 404) {
				alert('MyHort Update Failed');
				Ti.App.fireEvent('app:refreshMyHorts', {
					showProgress : false
				});
			} else {
				utm.handleError(e, this.status, this.responseText);
				saveButton.enabled=true;
			}
		},
		timeout : utm.netTimeout
	});

	win.addEventListener("focus", function() {
		utm.log('Focus MyHortDetails');
		loadMyHortDetail();
	});

	function loadMyHortDetail() {
		utm.setActivityIndicator('Getting your MyHort Details...');
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + _myHortData.MyHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}

	topButtonBar.addEventListener('click', function(e) {

		if (e.index === 0) {
			//Invite
			utm.myHortInviteWindow = new MyHortInviteWindow( _myHortData,utm);
			utm.myHortInviteWindow.open({
				modal : true,
				modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,
				modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET,
				navBarHidden : true
			});			
			
			
		} else if (e.index === 1) {
			//Show Pending			
			utm.myHortPendingWindow = new MyHortPendingWindow( _myHortData.MyHortId,utm);
			utm.myHortPendingWindow.open({
				modal : true,
				modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,
				modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET,
				navBarHidden : true
			});			
		}

	});
	

	return win;
};

module.exports = myHortDetail_window;
