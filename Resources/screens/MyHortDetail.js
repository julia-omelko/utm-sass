function myHortDetail_window(_myHortData, utm, isOwner) {
	
	var MyHortMembersView = require('ui/handheld/MyHortDetail/MyHortMembers');
	var MyHortMyInfoView = require('ui/handheld/MyHortDetail/MyHortMyInfo');

	var self = Titanium.UI.createWindow({
		layout : 'vertical',
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor,
		navBarHidden : ((utm.Android) ? true :false),
		title:  _myHortData.FriendlyName
	});
	
	if (utm.Android) {
		var my_navbar = Ti.UI.createView({
			layout : 'horizontal',
			height : 50,
			width : '100%',
			backgroundColor : utm.androidBarColor,
			color : utm.backgroundColor,
			top : 0
		});
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    text: _myHortData.FriendlyName,
		    top:0
		});
		self.add(my_navbar);
	}
	
	if (isOwner) {
		//Only need these screens if you are the Owner
		var MyHortInviteView = require('ui/handheld/MyHortDetail/MyHortInvite');
		var MyHortPendingView = require('ui/handheld/MyHortDetail/MyHortPending');
		
		var buttons = [{
			title : 'Members'
		}, {
			title : 'Settings'
		}, {
			title : 'Invite'
		}, {
			title : 'Pending'
		}];
	}else{
		var buttons = [{
			title : 'Members'
		}, {
			title : 'Settings'
		}];
	}

	
	if (utm.iPhone || utm.iPad) {

		var topButtonBar = Titanium.UI.createButtonBar({
			labels : buttons,
			top : 3,
			left: 3,
			right: 3,
			//bottom: 6,
			backgroundColor : '#336699',
			style : Titanium.UI.iPhone.SystemButtonStyle.BAR
		});
		topButtonBar.addEventListener('click',function(e){
			swapSubViews(e.index);
		});
		self.add(topButtonBar);
	} else {
		var topButtonBar = Ti.UI.createView({
			top : 3,
			left : 3,
			right: 3,
			layout : 'horizontal',
			height : 55,
			bottom: 6
		});
		self.add(topButtonBar);
		
		var btnWidth = Math.floor((Ti.Platform.displayCaps.platformWidth-21) * 0.25);
		
		var button = [];
		var buttonLabel = [];
		for (var i=0;i<4;i++) {
			button[i] = Ti.UI.createView({
				//top : 2,
				width : btnWidth,
				height : 50,
				left : 3,
				backgroundColor : '#336699',
				borderColor : '#000000',
				borderWidth : 1,
				borderRadius : 2,
				i: i
			});
			buttonLabel[i] = Ti.UI.createLabel({
				text : buttons[i].title,
				color : '#FFF',
				font : {
					fontFamily : 'Arial',
					fontSize : '14dp'
				},
				i: i
			});
			button[0].backgroundColor = '#6699CC';  //Set first button color as default/first-time view
			
			button[i].addEventListener('click',function(e){
				Ti.API.info(JSON.stringify(e));
				for (var j=0;j<4;j++) {
					if (e.source.i === j) {
						button[j].backgroundColor = '#6699CC';
					} else {
						button[j].backgroundColor = '#336699';
					}
					swapSubViews(e.source.i);
				}
			});
			button[i].add(buttonLabel[i]);
			topButtonBar.add(button[i]);
		}
	}

	
	var mainView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		contentWidth:'100%',
		width: Ti.UI.FILL,
		height: ((utm.Android) ? Ti.Platform.displayCaps.platformHeight - 114 : Ti.Platform.displayCaps.platformHeight - 94),
	});
	self.add(mainView);

	function loadMyHortDetail() {
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				utm.setActivityIndicator(self , '');
				var response = eval('(' + this.responseText + ')');
				utm.myHortDetails = response;
				if (this.status == 200) {
					if (utm.myHortDetails.IsOwner) {
						utm.curMyHortDetails = utm.myHortDetails.PrimaryUser;
					} else {
						utm.curMyHortDetails = utm.myHortDetails.MyInformation;
					}
					displayMyHortData();
				} else {
					utm.recordError('Error');
				}
			},
			onerror : function(e) {
				utm.setActivityIndicator(self , '');
				if (this.status != undefined && this.status === 404) {
					alert('The myHort you are looking for does not exist.');
				} else {
					utm.handleError(e, this.status, this.responseText);
				}
			},
			timeout : utm.netTimeout
		});
		utm.setActivityIndicator(self , 'Getting your MyHort Details...');
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + _myHortData.MyHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	function swapSubViews(_index){
		mainView.scrollTo(0,0);
		if (_index === 0) {
			myHortMyInfoView.setVisible(false);
			if (isOwner) {
				myHortInviteView.setVisible(false);
				myHortPendingView.setVisible(false);
			}	
			myHortMembersView.fireEvent('blur');
			if (isOwner) {
				myHortPendingView.fireEvent('blur');
			}	
			myHortMembersView.setVisible(true);
			myHortMembersView.fireEvent('focus');
		} else if (_index === 1) {
			myHortMembersView.setVisible(false);
			if (isOwner) {
				myHortInviteView.setVisible(false);
				myHortPendingView.setVisible(false);
			}	
			myHortMembersView.fireEvent('blur');
			if (isOwner) {
				myHortPendingView.fireEvent('blur');
			}
			myHortMyInfoView.setVisible(true);
		} else if (_index === 2) {
			myHortMembersView.setVisible(false);
			myHortMyInfoView.setVisible(false);
			if (isOwner) {
				myHortPendingView.setVisible(false);
			}	
			myHortMembersView.fireEvent('blur');
			if (isOwner) {
				myHortPendingView.fireEvent('blur');
				myHortInviteView.setVisible(true);
				myHortInviteView.fireEvent('focus');
			}	
			
		} else if (_index === 3) {
			myHortMembersView.setVisible(false);
			myHortMyInfoView.setVisible(false);
			if (isOwner) {
				myHortInviteView.setVisible(false);
			}	
			myHortMembersView.fireEvent('blur');
			if (isOwner) {
				myHortInviteView.fireEvent('blur');
				myHortPendingView.setVisible(true);
				myHortPendingView.fireEvent('focus');
			}
		}
	}
	
	self.addEventListener('invite',function(e){
		button[0].backgroundColor = '#336699';
		button[2].backgroundColor = '#6699CC';
		swapSubViews(2);
	});
	
	
	function displayMyHortData() {
		myHortMembersView = new MyHortMembersView(_myHortData, utm, isOwner, self);
		mainView.add(myHortMembersView);
		myHortMyInfoView = new MyHortMyInfoView(utm.curMyHortDetails, utm, isOwner, self);
		mainView.add(myHortMyInfoView);
		
		if (isOwner) {
			myHortInviteView = new MyHortInviteView(_myHortData, utm, self);
			mainView.add(myHortInviteView);
			myHortPendingView = new MyHortPendingView(_myHortData.MyHortId, utm, self);
			mainView.add(myHortPendingView);
		}
		myHortMembersView.fireEvent('focus');
		
		
		
		
		
		//Now that we have date set all the values
		
		
		
		/*email.setValue(utm.curMyHortDetails.Email);
		mobile.setValue(utm.curMyHortDetails.Mobile);

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
						
		if (utm.myHortDetails.IsOwner) {
			signMessagesSwitch.setValue(utm.myHortDetails.PrimaryUser.AddNicknameToUtms);
		} else {
			signMessagesSwitch.setValue(utm.myHortDetails.MyInformation.AddNicknameToUtms);
		}			
		if(isOwner){
			if(utm.myHortDetails.myHort.Prefix && utm.myHortDetails.myHort.Prefix !=''){
				keyWordPre.value = utm.myHortDetails.myHort.Prefix;
			}else{
				keyWordPost.value = utm.myHortDetails.myHort.Postfix;
			}
		}*/
	}
	
	
	
	loadMyHortDetail();
	
	return self;
};

module.exports = myHortDetail_window;