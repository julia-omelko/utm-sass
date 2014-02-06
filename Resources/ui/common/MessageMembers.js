var MessageMembersWin = function(_tabGroup) {
	var myHortId = utm.User.UserProfile.PrimaryMyHort;
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Choose Recipients', true);

	var backButton = Ti.UI.createLabel({
		text: 'back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close();
	});
	self.setLeftNavButton(backButton);
	

	
	var mode = 'members';
	var tabBar = Titanium.UI.createView({
		layout : 'horizontal',
		width : '100%',
		height : 27,
		top: 0
	});
	self.add(tabBar);
	var membersButton = Ti.UI.createLabel({
		text: 'members',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
		height: Ti.UI.FILL,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily},
		color: utm.textColor,
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	tabBar.add(membersButton);
	var groupsButton = Ti.UI.createLabel({
		text: 'groups',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
		height: Ti.UI.FILL,
		backgroundColor: utm.backgroundColor,
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily},
		color: utm.secondaryTextColor,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	tabBar.add(groupsButton);
	
	membersButton.addEventListener('click', function(e){
		membersButton.setBackgroundColor('white');
		membersButton.setColor(utm.textColor);
		groupsButton.setBackgroundColor(utm.backgroundColor);
		groupsButton.setColor(utm.secondaryTextColor);
		composeButton.setVisible(true);
		self.remove(groupTableView);
		self.add(memberTableView);
	});
	groupsButton.addEventListener('click', function(e){
		groupsButton.setBackgroundColor('white');
		groupsButton.setColor(utm.textColor);
		membersButton.setBackgroundColor(utm.backgroundColor);
		membersButton.setColor(utm.secondaryTextColor);
		composeButton.setVisible(false);
		self.remove(memberTableView);
		self.add(groupTableView);
	});
	
	
	
	var memberTableView = Ti.UI.createTableView({
		height: utm.viewableArea - 86,
		top: 27
	});
	self.add(memberTableView);
	memberTableView.addEventListener('click',function(e){
		e.rowData.setHasCheck((e.rowData.getHasCheck() ? false : true));
	});
	
	var groupTableView = Ti.UI.createTableView({
		height: utm.viewableArea - 27,
		top: 27
	});
	groupTableView.addEventListener('click',function(e){
		var MessageGroupMembersWin = require('/ui/common/MessageGroupMembers');
		var messageGroupMembersWin = new MessageGroupMembersWin(_tabGroup, e.rowData.groupData);
		utm.winStack.push(messageGroupMembersWin);
		_tabGroup.getActiveTab().open(messageGroupMembersWin);
	});

	
	
	
	var sort_by = function(field, reverse, primer) {
	   var key = primer ? function(x) {return primer(x[field]);} : function(x) {return x[field];};
	   reverse = [-1, 1][+!!reverse];
	   return function (a, b) {
	       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	   }; 
	};




	function loadMyHortDetail() {
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					myHortData = response;
					displayMyHortData(response);
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMyHortDetailReq = null;
			},
			onerror : function(e) {
				if (this.status != undefined && this.status === 404) {
					alert('The group you are looking for does not exist.');
				} else {
					utm.handleHttpError(e, this.status, this.responseText);
				}
				getMyHortDetailReq = null;
			},
			timeout : utm.netTimeout
		});
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + myHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	function displayMyHortData(myHortData) {
		myHortData.myHort.Members.sort(sort_by('NickName', true, function(a){return a.toUpperCase();}));
		
		/*for (var i=0; i<myHortData.myHort.Members.length; i++) {
			if (myHortData.myHort.Members[i].UserId === utm.User.UserProfile.UserId) {
				myHortData.myHort.Members.splice(i, 1);
				break;
			}
		}*/
		
		var aAlpha = [];
		var aMember = [];
		var letter = '';
		for (var i=0; i<myHortData.myHort.Members.length; i++) {
			var letter2 = myHortData.myHort.Members[i].NickName.charAt(0).toUpperCase();
			if (letter !== letter2) {
				aAlpha[aAlpha.length] = letter2;
				letter = letter2;
			}
		}
		for (var i=0; i<aAlpha.length; i++) {
			aMember[i] = [];
			for (var j=0; j<myHortData.myHort.Members.length; j++) {
				var letter = myHortData.myHort.Members[j].NickName.charAt(0).toUpperCase();
				if (aAlpha[i] === letter) {
					aMember[i][aMember[i].length] = myHortData.myHort.Members[j];
				}
			}
		}
		var MemberViewSection = require('/ui/common/baseui/MemberViewSection');
		var tableData = [];
		for (var i=0; i<aAlpha.length; i++) {
			tableData[i] = new  MemberViewSection(aAlpha[i],aMember[i]);
		}
		for (var i=0; i<tableData.length; i++) {
			for (var j=0; j<tableData[i].rows.length; j++) {
				tableData[i].rows[j].setHasChild(false);
			}
		}
		memberTableView.setData(tableData);
		self.hideAi();
	}
	
	function loadMyHorts() {
		var getMyHortsReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				if (this.status === 200) {
					var response = eval('(' + this.responseText + ')');
					if (response !== null) {
						populateTable(response);
					}
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMyHortsReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMyHortsReq = null;
			},
			timeout : utm.netTimeout
		});
		getMyHortsReq.open("GET", utm.serviceUrl + "MyHort?$orderby=FriendlyName");
		getMyHortsReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsReq.send();
	};
	
	var GroupTableRow = require('/ui/common/baseui/GroupViewRow');
	function populateTable(myHortData) {
		var tableData = [];
		for (var i=0; i<myHortData.length; i++) {
			if (myHortData[i].MyHortId !== utm.User.UserProfile.PrimaryMyHort) {
				var row = new GroupTableRow(myHortData[i]);
				tableData.push(row);
			}
		}

		groupTableView.setData(tableData);
	}
	
	
	
	loadMyHortDetail();
	loadMyHorts();
	
		
	var composeButton = Ti.UI.createButton({
		title: 'Compose',
		bottom: 10,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});	
	composeButton.addEventListener('click', function() {
		var selectedContacts = [];
		var aData = memberTableView.getData();
		for (var i=0; i<aData.length; i++) {
			for (var j=0; j<aData[i].rows.length; j++) {
				if (aData[i].rows[j].getHasCheck()) {
					selectedContacts[selectedContacts.length] = {
						userData: aData[i].rows[j].memberData
					};
				}
			}
		}
		
		if (selectedContacts.length) {
			var ComposeWin = require('/ui/common/Compose');
			var composeWin = new ComposeWin(_tabGroup,selectedContacts,'Send');
			utm.winStack.push(composeWin);
			_tabGroup.getActiveTab().open(composeWin);
		} else {
			alert('No members have been selected.');
		}
	});	
	self.add(composeButton);
	
	
	
	return self;
};

module.exports = MessageMembersWin;

