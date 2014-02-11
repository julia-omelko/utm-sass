var MembersWin = function(_tabGroup) {
	var myHortId = utm.User.UserProfile.PrimaryMyHort;
	var myHortData = {};
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Members', true);
	
	var scrollView = Ti.UI.createScrollView({
		top: utm.viewableTop,
		scrollType : 'vertical',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		height: Ti.Platform.displayCaps.platformHeight
	});
	self.add(scrollView);

	var editButton = Ti.UI.createLabel({
		text: 'Edit',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	editButton.addEventListener('click', function(e){
		tableView.setEditing(!tableView.getEditing());
		editButton.setText((tableView.getEditing() ? 'done' : 'edit'));
	});
	self.setLeftNavButton(editButton);
	
	var newButton = Ti.UI.createImageView({
		image: '/images/icons/add.png',
		height: 22,
		width: 22
	});
	newButton.addEventListener('click',function(e){
		var InviteWin = require('/ui/common/InviteMembers');
		var inviteWin = new InviteWin(_tabGroup,myHortData);
		inviteWin.addEventListener('close',function(e){
			loadMyHortDetail();
		});
		_tabGroup.getActiveTab().open(inviteWin);
	});
	self.setRightNavButton(newButton);

	var tableView = Ti.UI.createTableView({
		top: utm.viewableTop,
		editable: false,
		allowsSelectionDuringEditing: true,
		height: utm.viewableArea
	});
	self.add(tableView);
	
	tableView.addEventListener('click',function(e){
		if (e.source.memberData != null) {
			if (e.source.memberData.InviteCode != null) {
				var MemberDetailWin = require('/ui/common/MemberPending');
				var memberDetailWin = new MemberDetailWin(_tabGroup, e.source.memberData, myHortData.myHort);
			} else {
				var MemberDetailWin = require('/ui/common/MemberDetail');
			var memberDetailWin = new MemberDetailWin(_tabGroup, e.source.memberData);
			}
			memberDetailWin.addEventListener('close',function(e){
				loadMyHortDetail();
			});
			_tabGroup.getActiveTab().open(memberDetailWin);
		}
	});
	
	tableView.addEventListener('delete', function(e) {
		if (e.rowData.memberData.InviteCode != null) {
			deletePending(e.rowData.memberData);
		} else {
			deleteMember(e.rowData.memberData);
		}
	});
	
	
	function deleteMember(_memberData) {
		var deleteMemberReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				if (this.status === 200) {
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				deleteMyHortReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				deleteMyHortReq = null;
			},
			timeout : utm.netTimeout
		});
		
		deleteMemberReq.open("POST", utm.serviceUrl + "MyHort/DeleteUserFromMyHort?myhortMemberId=" + _memberData.Id);
		deleteMemberReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMemberReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMemberReq.send();
	}
	
	function deletePending(_memberData) {
		var deletePendingReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				deletePendingReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				deletePendingReq = null;
			},
			timeout : utm.netTimeout
		});
		deletePendingReq.open("DELETE", utm.serviceUrl + "MyHort/DeleteInvite/" + _memberData.Id);
		deletePendingReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deletePendingReq.send();
	}


	function loadMyHortDetail() {
		self.showAi();
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					myHortData = response;
					getPendingMembers(response.myHort.Members);
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMyHortDetailReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMyHortDetailReq = null;
			},
			timeout : utm.netTimeout
		});
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + myHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	function displayMyHortData(_members) {
		_members.sort(sort_by('NickName', true, function(a){return a.toUpperCase();}));
		var aAlpha = [];
		var aMember = [];
		var letter = '';
		for (var i=0; i<_members.length; i++) {
			var letter2 = _members[i].NickName.charAt(0).toUpperCase();
			if (letter !== letter2) {
				aAlpha[aAlpha.length] = letter2;
				letter = letter2;
			}
		}
		for (var i=0; i<aAlpha.length; i++) {
			aMember[i] = [];
			for (var j=0; j<_members.length; j++) {
				var letter = _members[j].NickName.charAt(0).toUpperCase();
				if (aAlpha[i] === letter) {
					aMember[i][aMember[i].length] = _members[j];
				}
			}
		}
		var MemberViewSection = require('/ui/common/baseui/MemberViewSection');
		var tableData = [];
		for (var i=0; i<aAlpha.length; i++) {
			tableData[i] = new  MemberViewSection(aAlpha[i],aMember[i]);
		}
		tableView.setData(tableData);
		self.hideAi();
	}
	
	var sort_by = function(field, reverse, primer) {
	   var key = primer ? function(x) {return primer(x[field]);} : function(x) {return x[field];};
	   reverse = [-1, 1][+!!reverse];
	   return function (a, b) {
	       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	   }; 
	};
	
	function getPendingMembers(_members) {
		var getMyHortPendingReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					for (var i=0; i<response.length; i++) {
						response[i].NickName = response[i].EmailAddress.split('@')[0];
						response[i].Avatar = 0;
					}
					_members = _members.concat(response);
					displayMyHortData(_members);
					getMyHortPendingReq = null;
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
					getMyHortPendingReq = null;
				}
			},
			onerror : function(e) {
				if (this.status != undefined && this.status === 404) {
					alert('The group you are looking for does not exist.');
				} else {
					utm.handleHttpError(e, this.status, this.responseText);
				}
			},
			timeout : utm.netTimeout
		});
		getMyHortPendingReq.open("GET", utm.serviceUrl + "MyHort/Pending?myHortId=" + myHortId);
		getMyHortPendingReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortPendingReq.send();	
	}
	
	
	loadMyHortDetail();




	return self;
};
module.exports = MembersWin;

