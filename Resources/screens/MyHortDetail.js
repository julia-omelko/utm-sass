function myHortDetail_window(_myHortData, utm, isOwner) {

	var InputField = require('ui/common/baseui/InputField');
	var MyHortMembersWindow = require('ui/handheld/MyHortMembers');
	var MyHortPendingWindow = require('ui/handheld/MyHortPending');
	var MyHortInviteWindow = require('ui/handheld/MyHortInvite');
	var social = require("lib/social");
	utm.facebookToken = '';

	var twitter = social.create({
		site : 'Twitter', // <-- this example is for Twitter. I'll expand this to other sites in the future.
		consumerKey : utm.twitterConsumerKey, // <--- you'll want to replace this
		consumerSecret : utm.twitterConsumerSecret // <--- and this with your own keys!
	});

	var twitterEnabledForUser = false;
	var facebookEnabledForUser = false;

	Titanium.Facebook.appid = utm.facebookAppId;
	Titanium.Facebook.permissions = ['publish_stream', 'read_stream'];

	utm.MyHortDetails = false;

	//####################   iOS Button Bar #################### 
	if (utm.iPhone || utm.iPad) {
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
			height : utm.SCREEN_HEIGHT * 1.25,
			layout : 'vertical'
		});

		scrollingView.add(view);

		if (isOwner) {
			var buttons = [{
				title : 'Members',
				enabled : false
			}, {
				title : 'Invite',
				enabled : false
			}, {
				title : 'Pending Invites',
				enabled : false
			}];
		} else {
			var buttons = [{
				title : 'Members',
				enabled : false
			}, {
				title : 'Invite',
				enabled : false
			}, {
				title : 'Pending Invites',
				enabled : false
			}];
		}

		//-----------------Top Buttons  ----------------------
		var topButtonBar = Titanium.UI.createButtonBar({
			labels : buttons,
			top : 3,
			backgroundColor : '#336699',
			style : Titanium.UI.iPhone.SystemButtonStyle.BAR//,
			//height : isOwner? 40: 0,
			//visible :isOwner
		});

		function enableButtonBar(_enable) {
			buttons[0].enabled = _enable;
			if (isOwner) {
				buttons[1].enabled = _enable;
				buttons[2].enabled = _enable;
			}
			topButtonBar.labels = buttons;
		}


		view.add(topButtonBar);
	}
	//#################### Android Tab Bar #################### 
	if (utm.Android) {
		//create the base screen and hide the Android navbar
		var win = Titanium.UI.createWindow({
			layout : 'vertical',
			backgroundColor : utm.backgroundColor,
			navBarHidden : true
		});

		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
			height : 50,
			width : '100%',
			backgroundColor : utm.barColor,
			text : 'MyHort Info',
			color : utm.backgroundColor,
			font : {
				fontSize : utm.androidTitleFontSize,
				fontWeight : utm.androidTitleFontWeight
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			top : 0
		});

		//add the navbar to the screen
		win.add(my_navbar);

		var scrollingView = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : false
		});

		win.add(scrollingView);

		var view = Ti.UI.createView({
			height : utm.SCREEN_HEIGHT * 1.25,
			layout : 'vertical'
		});

		scrollingView.add(view);

		var spacer = Math.round(Ti.Platform.displayCaps.platformWidth * 0.33);
		var btnWidth = spacer - 2;
		var btnHeight = 34;
		var leftPos = Math.round((Ti.Platform.displayCaps.platformWidth - btnWidth * 3) * 0.5)

		// TAB BAR aka Button Bar for Android
		var tabBar = Ti.UI.createView({
			width : '100%',
			height : 40,
			left : 0,
			bottom : 0,
			layout : 'horizontal'
		});
		view.add(tabBar);
		// TAB 1
		var tab1 = Ti.UI.createView({
			width : btnWidth,
			height : btnHeight,
			left : leftPos,
			top : 2,
			backgroundColor : '#336699',
			borderColor : '#000000',
			borderWidth : 1,
			borderRadius : 2
		});
		var tab1Label = Ti.UI.createLabel({
			text : 'Members',
			color : '#FFF'
		});
		tab1.add(tab1Label);
		tabBar.add(tab1);

		// TAB 2
		var tab2 = Ti.UI.createView({
			width : btnWidth,
			height : btnHeight,
			top : 2,
			backgroundColor : '#336699',
			borderColor : '#000000',
			borderWidth : 1
		});
		var tab2Label = Ti.UI.createLabel({
			text : 'Invite',
			color : '#FFF'
		});
		tab2.add(tab2Label);
		tabBar.add(tab2);

		// TAB 3
		var tab3 = Ti.UI.createView({
			width : btnWidth,
			height : btnHeight,
			top : 2,
			backgroundColor : '#336699',
			borderColor : '#000000',
			borderWidth : 1,
			borderRadius : 2
		});
		var tab3Label = Ti.UI.createLabel({
			text : 'Pending Invites',
			color : '#FFF'
		});
		tab3.add(tab3Label);
		tabBar.add(tab3);
		
		//add activityIndicator to view
		view.add(utm.activityIndicator)
	}
	
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
			fontSize : '14dp',
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
			fontSize : '14dp',
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
		left : 8,
		height : '50dp'
	});
	view.add(twitterGroup);
	
	var twitterLabel = Ti.UI.createLabel({
		text : 'Twitter',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		width : '80dp',
		textAlign : 'left'
	});
	twitterGroup.add(twitterLabel);

	var twitterSwitch = Ti.UI.createSwitch({
		value : false,
		enabled : true
	});
	twitterGroup.add(twitterSwitch);

	twitterSwitch.addEventListener('change', function(e) {
		if (e.value) {
			if (!twitter.isAuthorized()) {
				authTwitter();
			}
			twitterEnabledForUser = true;
		} else {
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


	//----------Facebook--------------------
	var faceBookGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 8,
		height : '50dp',
		visible : true
	});
	view.add(faceBookGroup);

	var faceBookLabel = Ti.UI.createLabel({
		text : 'Facebook',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		width : '80dp',
		textAlign : 'left'
	});
	faceBookGroup.add(faceBookLabel);

	var facebookSwitch = Ti.UI.createSwitch({
		value : false,
		enabled : true
	});
	faceBookGroup.add(facebookSwitch);

	facebookSwitch.addEventListener('change', function(e) {
		if (e.value) {
			Ti.Facebook.setForceDialogAuth(true);
			Ti.Facebook.authorize();
			facebookEnabledForUser = true;
		} else {
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['For this MyHort?', 'For ALL MyHorts?', L('cancel')],
				message : 'You can Deauthorize the YouThisMe application for this MyHort only or for ALL your MyHorts that your a member of. ',
				title : 'Deactivate Options'
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					Ti.Facebook.logout();
					//Ti.Facebook.setForceDialogAuth(false);
				} else if (e.index === 1) {
					Ti.Facebook.logout();
					//Ti.Facebook.setForceDialogAuth(false);
				} else if (e.index === 2) {
					Ti.API.info('The cancel button was clicked');
				}
			});
			dialog.show();
		}
	});

	Ti.Facebook.addEventListener('login', function(e) {
		if (e.success) {
			utm.facebookToken = Ti.Facebook.getAccessToken();
		} else if (e.error) {
			utm.facebookToken == '';
			alert(e.error);
		} else if (e.cancelled) {
			// alert("Canceled");
		}
	});

	//----------Mobile # --------------------
	var mobile = new InputField('Mobile', 80, '', 210, Ti.UI.KEYBOARD_DECIMAL_PAD);
	view.add(mobile);

	var saveButton = Ti.UI.createButton({
		title : 'Save',
		top : 3,
		enabled : true
	});
	saveButton.addEventListener('click', function() {
		if(checkAtLeastOneTypeOfMessageSet()){
			updateMyHortData();
		}
	});
	view.add(saveButton);

	function authTwitter() {
		twitter.authorize();
	}
	
	function checkAtLeastOneTypeOfMessageSet(){
		
		if(email.getValue() != '') return true;
		if(mobile.getValue() != '') return true;
		if(facebookSwitch.getValue()) return true;
		if(twitterSwitch.getValue()) return true; 
				
		alert('You must choose at least one of the message type to send to contacts in this MyHort');		
		return false;	
	}
	

	function updateMyHortData() {
		saveButton.enabled = false;
		utm.setActivityIndicator('Update MyHort...');

		utm.curMyHortDetails.Email = email.getValue();
		utm.curMyHortDetails.Mobile = mobile.getValue();
	
		

		//TODO Handle Twitter diff myHortDetails.PrimaryUser.TwitterToken=;

		if (twitterSwitch.getValue()) {
			///if (!twitterEnabledForUser) {
			//original value has changed so now we need to enable twitter
			//authTwitter();
			if (!twitter.isAuthorized()) {
				authTwitter();
			}
			twitterEnabledForUser = true;
			utm.curMyHortDetails.TwitterToken = utm.TwitterToken;
			utm.curMyHortDetails.TwitterSecret = utm.TwitterTokenSecret;

			//}

		} else {
			if (twitterEnabledForUser) {
				//Original value has changes so we need to deactivate twitter
				utm.curMyHortDetails.TwitterToken = '';
				utm.curMyHortDetails.TwitterSecret = '';
			}
		}

		if (facebookSwitch.getValue()) {
			utm.curMyHortDetails.FaceBook = Ti.Facebook.getAccessToken();
		} else {
			utm.curMyHortDetails.FaceBook = '';
		}

		if (utm.myHortDetails.IsOwner) {
			utm.myHortDetails.PrimaryUser = utm.curMyHortDetails;
			utm.myHortDetails.MyInformation = '';

		} else {
			utm.myHortDetails.MyInformation = utm.curMyHortDetails;
			utm.myHortDetails.PrimaryUser = '';
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
			var response = eval('(' + this.responseText + ')');
			utm.myHortDetails = response;

			if (this.status == 200) {

				if (utm.myHortDetails.IsOwner) {
					utm.curMyHortDetails = utm.myHortDetails.PrimaryUser;
					topButtonBar.visable = true;

				} else {
					utm.curMyHortDetails = utm.myHortDetails.MyInformation;
					topButtonBar.visable = false;
				}

				//Now that we have date set all the values
				email.setValue(utm.curMyHortDetails.Email);
				mobile.setValue(utm.curMyHortDetails.Mobile);
				//	faceBook.setValue(utm.curMyHortDetails.FaceBook);

				if (utm.curMyHortDetails.TwitterToken != '' & utm.curMyHortDetails.TwitterToken != null) {
					twitterSwitch.setValue(true);
					twitterEnabledForUser = true;
				} else {
					twitterSwitch.setValue(false);
					twitterEnabledForUser = false;
				}

				if (utm.curMyHortDetails.FaceBook != '' & utm.curMyHortDetails.FaceBook != null) {
					facebookSwitch.setValue(true);
					facebookEnabledForUser = true;
				} else {
					facebookSwitch.setValue(false);
					facebookEnabledForUser = false;
				}

				enableButtonBar(true);
				//TODO handle errors better
			} else if (this.status == 400) {
				utm.recordError('Error')
			} else {
				utm.recordError('Error')
			}
			topButtonBar.enabled = true;
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
	
	function updateOwnerMemberDetails(){

		for (x=0;x< _myHortData.Members.length;x++){
			if (_myHortData.Members[x].MemberType == 'Primary'){
				_myHortData.Members[x].HasEmail = email.getValue() !='';
				_myHortData.Members[x].HasMobile=mobile.getValue() !='';
				_myHortData.Members[x].HasTwitter=twitterSwitch.getValue();
				_myHortData.Members[x].HasFaceBook=facebookSwitch.getValue();
				break;
			}
		}
	}
	

	// ##################### Call out to Update myHort  #####################
	var updateMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {

			var json = this.responseData;
			if (this.status == 200) {
				utm.setActivityIndicator('Update Complete');
				Ti.App.fireEvent("app:showMyHortWindow", {});
				utm.setActivityIndicator('');
				updateOwnerMemberDetails();
				//loadMyHortDetail();
			
			} else if (this.status == 400) {
				utm.recordError('error')
			} else {
				utm.recordError(utm.myHortDetails.MyHort)
			}
			saveButton.enabled = true;
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
			saveButton.enabled = true;
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

	if (utm.iPhone || utm.iPad) {
		topButtonBar.addEventListener('click', function(e) {

			if (e.index === 0) {
				//Invite
				utm.myHortMembersWindow = new MyHortMembersWindow(_myHortData, utm, isOwner);
				utm.navController.open(utm.myHortMembersWindow);

			} else if (e.index === 1) {
				//Invite
				utm.myHortInviteWindow = new MyHortInviteWindow(_myHortData, utm);
				utm.navController.open(utm.myHortInviteWindow);

			} else if (e.index === 2) {
				//Show Pending
				utm.myHortPendingWindow = new MyHortPendingWindow(_myHortData.MyHortId, utm);
				utm.myHortPendingWindow.open({
					modal : true,
					modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,
					modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET,
					navBarHidden : true
				});
			}

		});
	}
	if (utm.Android) {
		// Add event listeners for tabs
		tab1.addEventListener('click', function() {
			//Members
			utm.myHortMembersWindow = new MyHortMembersWindow(_myHortData, utm, isOwner);
			utm.navController.open(utm.myHortMembersWindow);
		});
		tab2.addEventListener('click', function() {
			//Invite
			if (isOwner){
				utm.myHortInviteWindow = new MyHortInviteWindow(_myHortData, utm);
				utm.navController.open(utm.myHortInviteWindow);
			}
		});
		tab3.addEventListener('click', function() {
			//Show Pending
			if (isOwner){
				utm.myHortPendingWindow = new MyHortPendingWindow(_myHortData.MyHortId, utm);
				utm.myHortPendingWindow.open({
					modal : true,
					navBarHidden : true
				});
			}
		});
	}

	function authFacebook() {
		Titanium.Facebook.forceDialogAuth = false;

		Titanium.Facebook.addEventListener('login', updateLoginStatus);
		Titanium.Facebook.addEventListener('logout', updateLoginStatus);

	}

	return win;
};

module.exports = myHortDetail_window;
