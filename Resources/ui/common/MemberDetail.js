var MemberDetailWin = function(_tabGroup,_memberData) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Member Detail', '');

	var trashButton = Ti.UI.createImageView({
		image: '/images/icons/trash.png',
		height: 22,
		width: 22
	});
	trashButton.addEventListener('click',function(e){
		alert('delete member');
	});
	self.setRightNavButton(trashButton);
	
	var backButton = Ti.UI.createLabel({
		text: 'back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close({animated:true});
	});
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width:'100%',
		height:'100%',
		showVerticalScrollIndicator:true,
		contentHeight:'auto',
		layout:'vertical'
	});
	self.add(scrollingView);
	
	var userView = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth-50,
		left: 25,
		height: Ti.UI.SIZE
	});
	scrollingView.add(userView);
	
	var avatar = Ti.UI.createImageView({
		top: 25,
		left: 0,
		image: '/images/avatar/1.png',
		width: 80,
		height: 80,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		borderRadius: 2
	});
	userView.add(avatar);
	
	var nicknameLabel = Ti.UI.createLabel({
		text: 'Nickname',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 100,
		top: 30
	});
	userView.add(nicknameLabel);
	
	var nicknameField = Ti.UI.createTextField({
		value: _memberData.NickName,
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-100-25),
		height: 30,
		left: 100,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 50,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	var focused = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	nicknameField.addEventListener('focus', function() {
		nicknameField.add(focused);
	});
	nicknameField.addEventListener('blur', function() { 
		nicknameField.remove(focused);
	});
	userView.add(nicknameField);

	var groupLabel = Ti.UI.createLabel({
		text: 'Groups',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 15
	});
	scrollingView.add(groupLabel);
	
	var tableView = Ti.UI.createTableView({
		height: 200,
		width: '100%',
		top: 15
	});
	scrollingView.add(tableView);
	var tableData = [];
	
	var saveButton = Ti.UI.createButton({
		title: 'Save',
		top: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white'
	});	
	saveButton.addEventListener('click', function() {
		alert('save'); 
	});	
	scrollingView.add(saveButton);
	
	function populateTable(_groups) {
		for (var i=0; i<_groups.length; i++) {
			for (var j=0; j<_groups[i].Members.length; j++) {
				if (_groups[i].Members[j].UserId === _memberData.UserId) {
					tableData[tableData.length] = Ti.UI.createTableViewRow({
						title: _groups[i].FriendlyName,
						height: 40,
						font: {fontFamily: utm.fontFamily}
					});
					break;
				}
			}
		}
		tableView.setData(tableData);
	}
	
	function loadMyHorts() {
		var getMyHortsReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				if (this.status === 200) {
					var response = eval('(' + this.responseText + ')');
					if (response !== null) {
						//Ti.API.info(response);
						//Ti.API.info("MyHort data returned " + response.length + '  myHorts returned');
						populateTable(response);
					}
				}
			},
			onerror : function(e) {
				//utm.handleError(e, this.status, this.responseText);
			},
			timeout : utm.netTimeout
		});
		getMyHortsReq.open("GET", utm.serviceUrl + "MyHort?$orderby=FriendlyName");
		getMyHortsReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsReq.send();
	};
	loadMyHorts();
	
	
	return self;
};
module.exports = MemberDetailWin;

