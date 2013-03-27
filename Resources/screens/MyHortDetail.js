function myHortDetail_window(_myHortData,utm,isOwner) {

	var InputField = require('ui/common/baseui/InputField');
	var MyHortMembersWindow = require('ui/handheld/MyHortMembers');
	var MyHortPendingWindow = require('ui/handheld/MyHortPending');
	var MyHortInviteWindow = require('ui/handheld/MyHortInvite');
	var social = require("lib/social");
	
	var twitter = social.create({
			site : 'Twitter', // <-- this example is for Twitter. I'll expand this to other sites in the future.
			consumerKey : '8qiy2PJv3MpVyzuhfNXkOw', // <--- you'll want to replace this
			consumerSecret : 'Qq0rth4MHGB70nh20nSzov2zz6GbVxuVndCh2IxkRWI' // <--- and this with your own keys!
		});
	
	var twitterEnabledForUser = false;
	utm.MyHortDetails = false;

	var win = Ti.UI.createWindow({
		layout : 'vertical',
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor
	});

	var scrollingView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
	});
	win.add(scrollingView);

	var view = Ti.UI.createView({
		height : 2000,
		layout : 'vertical'
	});

	scrollingView.add(view);
	
	var buttons = [
    {title:'Members', enabled:false},
    {title:'Invite', enabled:false},
     {title:'Pending Invites', enabled:false}
];

	//-----------------Top Buttons  ----------------------
	var topButtonBar = Titanium.UI.createButtonBar({
		labels : buttons,
		top : 3,
		backgroundColor : '#336699',
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : isOwner? 40: 0,
		width : '95%',		
		visible :isOwner
	});
	
	function enableButtonBar(_enable){
		buttons[0].enabled = _enable;
		buttons[1].enabled = _enable;
		buttons[2].enabled = _enable;
		topButtonBar.labels = buttons;  
	}
	
	view.add(topButtonBar);

	//-----------------MyHort Name  ----------------------
	var myHortNameGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 3,
		bottom : 3,
		height : 50
	});
	view.add(myHortNameGroup);

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
	view.add(email);

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
		enabled:true
	});
	twitterGroup.add(twitterSwitch);

	twitterSwitch.addEventListener('change', function(e) {		
		if(e.value){
			if(!twitter.isAuthorized()){
				authTwitter();
			}
			twitterEnabledForUser=true;
		}else{
			//twitter.deauthorize(); NOTE this deauthrizes for ALL MYHORTS - dont want to do that uless its the only myhort with twitter set.
			
				var dialog = Ti.UI.createAlertDialog({
					cancel : 1,
					buttonNames : ['For this MyHort?', 'For ALL MyHorts?', L('cancel')],
					message : 'You can Deauthorize the YouThisMe application for this MyHort only or for ALL your MyHorts that your a member of. ',
					title : 'Deactivate Options'
				});
				dialog.addEventListener('click', function(e) {
					if (e.index === 0) {
						utm.TwitterToken = '';
	    					utm.TwitterTokenSecret = '';    	
					} else if (e.index === 1) {
						twitter.deauthorize(); 
					} else if (e.index === 2) {
						Ti.API.info('The cancel button was clicked');
					}
				});
				dialog.show();
			
			}
		
	});
	view.add(twitterGroup);

	//----------Facebook--------------------
	var faceBook = new InputField('FaceBook', 80, '', 210);
	view.add(faceBook);

	//----------Mobile # --------------------
	var mobile = new InputField('Mobile', 80, '', 210, Ti.UI.KEYBOARD_DECIMAL_PAD);
	view.add(mobile);

	var saveButton = Ti.UI.createButton({
		title : 'Save',
		top : 3,
		enabled : true
	});
	saveButton.addEventListener('click', function() {
		utm.log('saveButton fired');
		updateMyHortData();
	});
	view.add(saveButton);

	function authTwitter() {
		twitter.authorize();
	}

	function updateMyHortData() {
		saveButton.enabled=false;
		utm.setActivityIndicator('Update MyHort...');
		
		
		utm.curMyHortDetails.Email = email.getValue();
		utm.curMyHortDetails.Mobile = mobile.getValue();
		utm.curMyHortDetails.FaceBook = faceBook.getValue();
		//TODO Handle Twitter diff myHortDetails.PrimaryUser.TwitterToken=;

		if (twitterSwitch.getValue()) {
			///if (!twitterEnabledForUser) {
				//original value has changed so now we need to enable twitter
				//authTwitter();
				if(!twitter.isAuthorized()){
					authTwitter();
				}
				twitterEnabledForUser=true;
				utm.curMyHortDetails.TwitterToken = utm.TwitterToken;
				utm.curMyHortDetails.TwitterSecret = utm.TwitterTokenSecret ;
				
			//}

		} else {
			if (twitterEnabledForUser) {
				//Original value has changes so we need to deactivate twitter
				utm.curMyHortDetails.TwitterToken = '';
				utm.curMyHortDetails.TwitterSecret = '';
			}
		}
				
		if(utm.myHortDetails.IsOwner){
			 utm.myHortDetails.PrimaryUser = utm.curMyHortDetails;
			 utm.myHortDetails.MyInformation='';
			
		}else{
			utm.myHortDetails.MyInformation=utm.curMyHortDetails;
			utm.myHortDetails.PrimaryUser='';
		}	
		
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
			var response = eval('('+this.responseText+')');
			utm.myHortDetails = response;

			if (this.status == 200) {
				
				if(utm.myHortDetails.IsOwner){
					utm.curMyHortDetails = utm.myHortDetails.PrimaryUser;
					topButtonBar.visable=true;
					
				}else{
					utm.curMyHortDetails = utm.myHortDetails.MyInformation;
					topButtonBar.visable=false;
				}	
							
				//Now that we have date set all the values
				email.setValue(utm.curMyHortDetails.Email);
				mobile.setValue(utm.curMyHortDetails.Mobile);
				faceBook.setValue(utm.curMyHortDetails.FaceBook);

				if (utm.curMyHortDetails.TwitterToken != '' & utm.curMyHortDetails.TwitterToken != null) {
					twitterSwitch.setValue(true);
					twitterEnabledForUser = true;
				} else {
					twitterSwitch.setValue(false);
					twitterEnabledForUser = false;
				}
				
				enableButtonBar(true);
				//TODO handle errors better
			} else if (this.status == 400) {
				utm.recordError('Error')
			} else {
				utm.recordError('Error')
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
				Ti.App.fireEvent("app:showMyHortWindow", {});
				utm.setActivityIndicator('');
				//TODO handle errors better
			} else if (this.status == 400) {
				utm.recordError('error')
			} else {
				utm.recordError(utm.myHortDetails.MyHort)
			}
			saveButton.enabled=true;
			utm.setActivityIndicator('');
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
			}
			saveButton.enabled=true;
			utm.setActivityIndicator('');
		},
		timeout : utm.netTimeout
	});

	win.addEventListener("open", function() {
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
			utm.myHortMembersWindow = new MyHortMembersWindow( _myHortData,utm);
			
			utm.navController.open(utm.myHortMembersWindow);
			/*
			utm.myHortMembersWindow.open({
				modal : true,
				modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,
				modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET,
				navBarHidden : true
			});			*/
			
			
		} else if (e.index === 1) {
			//Invite
			utm.myHortInviteWindow = new MyHortInviteWindow( _myHortData,utm);
			utm.myHortInviteWindow.open({
				modal : true,
				modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,
				modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET,
				navBarHidden : true
			});			
			
			
		} else if (e.index === 2) {
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
