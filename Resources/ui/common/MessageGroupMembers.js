var MessageGroupMembersWin = function(_tabGroup,_myHortData) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Choose Recipients', true);

	var backButton = Ti.UI.createLabel({
		text: 'Back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close();
	});
	self.setLeftNavButton(backButton);
	
	
	var memberTableView = Ti.UI.createTableView({
		height: utm.viewableArea - ((40*utm.sizeMultiplier)+20),
		top: utm.viewableTop
	});
	self.add(memberTableView);
	memberTableView.addEventListener('click',function(e){
		if (e.source.toString() === '[object TableViewRow]') {
			e.source.setHasCheck((e.source.getHasCheck() ? false : true));
		} else {
			e.source.parent.setHasCheck((e.source.parent.getHasCheck() ? false : true));
		}
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
					Ti.API.info(response);
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
		getMyHortDetailReq.open("GET", utm.serviceUrl + "Members/" + _myHortData.MyHortId + '?$orderby=NickName');
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	function displayMyHortData(myHortData) {
		myHortData.sort(sort_by('NickName', true, function(a){return a.toUpperCase();}));
		
		/*for (var i=0; i<myHortData.length; i++) {
			if (myHortData[i].UserId === utm.User.UserProfile.UserId) {
				myHortData.splice(i, 1);
				break;
			}
		}*/
		
		var aAlpha = [];
		var aMember = [];
		var letter = '';
		for (var i=0; i<myHortData.length; i++) {
			var letter2 = myHortData[i].NickName.charAt(0).toUpperCase();
			if (letter !== letter2) {
				aAlpha[aAlpha.length] = letter2;
				letter = letter2;
			}
		}
		for (var i=0; i<aAlpha.length; i++) {
			aMember[i] = [];
			for (var j=0; j<myHortData.length; j++) {
				var letter = myHortData[j].NickName.charAt(0).toUpperCase();
				if (aAlpha[i] === letter) {
					aMember[i][aMember[i].length] = myHortData[j];
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
	
	
	loadMyHortDetail();
	
	
	var StandardButton = require('/ui/common/baseui/StandardButton');
	var composeButton = new StandardButton({title:'Compose'});
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

module.exports = MessageGroupMembersWin;

