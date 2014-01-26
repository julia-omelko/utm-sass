var MemberGroupDetailWin = function(_tabGroup,_groupData) {
	var myHortId = 3312;
	
	var aExisting = [];
	for (var i=0; i<_groupData.Members.length; i++) {
		aExisting[aExisting.length] = _groupData.Members[i].UserId;
	}
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Add Members to Group', '');

	var backButton = Ti.UI.createLabel({
		text: 'back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close();
	});
	self.setLeftNavButton(backButton);
	
	var tableView = Ti.UI.createTableView({
		height: 454 - 60 - 40,
		top: 0
	});
	self.add(tableView);
	tableView.addEventListener('click',function(e){
		e.rowData.setHasCheck((e.rowData.getHasCheck() ? false : true));
	});
	
	function loadMyHortDetail() {
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status == 200) {
					Ti.API.info(response);
					myHortData = response;
					displayMyHortData(response);
				}
			},
			onerror : function(e) {
				if (this.status != undefined && this.status === 404) {
					alert('The myHort you are looking for does not exist.');
				} else {
					//utm.handleError(e, this.status, this.responseText);
				}
			},
			timeout : utm.netTimeout
		});
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + myHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	function displayMyHortData(myHortData) {
		myHortData.myHort.Members.sort(sort_by('NickName', true, function(a){return a.toUpperCase();}));
		
		var aNew = [];
		for (var i=0; i<myHortData.myHort.Members.length; i++) {
			if (aExisting.indexOf(myHortData.myHort.Members[i].UserId) === -1) {
				aNew[aNew.length] = myHortData.myHort.Members[i];
			}
		}
		myHortData.myHort.Members = aNew;
		
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
		tableView.setData(tableData);
	}
	
	var sort_by = function(field, reverse, primer) {
	   var key = primer ? function(x) {return primer(x[field]);} : function(x) {return x[field];};
	   reverse = [-1, 1][+!!reverse];
	   return function (a, b) {
	       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	   }; 
	};
	
	
	loadMyHortDetail();

	
	var invisibleView = Ti.UI.createView({
		height: 30,
		width: Ti.UI.FILL,
		bottom: 60,
		backgroundColor: utm.backgroundColor,
		font: {fontFamily: utm.fontFamily},
		color: utm.textColor
	});
	var invisibleLabel = Ti.UI.createLabel({
		left: 25,
		text: 'Invisible to others',
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE
	});
	invisibleView.add(invisibleLabel);
	var invisibleSwitch = Ti.UI.createSwitch({
		right: 25,
		value: true
	});
	invisibleView.add(invisibleSwitch);
	self.add(invisibleView);
	
	
	var saveButton = Ti.UI.createButton({
		title: 'Add to group',
		bottom: 10,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
	saveButton.addEventListener('click', function() {
		inviteMyHort();
	});	
	self.add(saveButton);
	
	function inviteMyHort() {

		if (invisibleSwitch.getValue()) {
			var memberType = 'Invisible';
		} else { 
			var memberType = 'Secondary';
		}
		
		var sections = tableView.getData();
		var aInvites = [];
		for (var i=0; i<sections.length; i++) {
			for (var j=0; j<sections[i].rows.length; j++) {
				if (sections[i].rows[j].getHasCheck()) {
					aInvites.push(sections[i].rows[j].memberData.UserId);
				}
			}
		}
		
		var primaryMemberNickName = '';
		var primaryMember = getPrimaryMember(_groupData.Members);
		var primaryMemberNickName = primaryMember.NickName;
		
		var myHortInviteModel = {
			MyHortInfo: _groupData,
			UsersToInvite: aInvites.join(','),
			InviteMessage: '',
			FromNickName: primaryMemberNickName,
			MemberType: memberType,
			InviteCode: 'autogen'
		};
		
		var inviteMyHortReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload: function() {
				alert('Your invitation has been sent.');
				inviteMyHortReq = null;
				self.close();
			},
			onerror : function(e) {
				inviteMyHortReq = null;
			}
		});
		inviteMyHortReq.open("POST", utm.serviceUrl + "MyHort/Invite");
		inviteMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		inviteMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		inviteMyHortReq.send(JSON.stringify(myHortInviteModel));
	}

	function getPrimaryMember(_members) {
		for (var ii=0; ii<_members.length; ii++) {
			if (_members[ii].MemberType === 'Primary') {
				return _members[ii];
			}
		}
	}

	
	return self;
};

module.exports = MemberGroupDetailWin;

