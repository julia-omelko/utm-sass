var MembersWin = function(_tabGroup) {
	var myHortId = 3312;
	var myHortData = {};
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Members', '');
	
	var scrollView = Ti.UI.createScrollView({
		scrollType : 'vertical',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		height: Ti.Platform.displayCaps.platformHeight
	});
	self.add(scrollView);

	var editButton = Ti.UI.createLabel({
		text: 'edit',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
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
		_tabGroup.getActiveTab().open(inviteWin);
	});
	self.setRightNavButton(newButton);

	var tableView = Titanium.UI.createTableView({
		editable: true,
		allowsSelectionDuringEditing: true,
		height: 454,
		top: 0
	});
	self.add(tableView);
	
	tableView.addEventListener('click',function(e){
		var MemberDetailWin = require('/ui/common/MemberDetail');
		var memberDetailWin = new MemberDetailWin(_tabGroup, e.rowData.memberData);
		_tabGroup.getActiveTab().open(memberDetailWin);
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




	return self;
};
module.exports = MembersWin;

