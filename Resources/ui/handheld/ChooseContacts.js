var ChooseContacts_window = function(utm) {

	var allChecked = false;
	var selectedContacts = [];
	
	if(utm.iPhone){
		var chooseContactsView = Titanium.UI.createWindow({
			layout : 'vertical',
			title : L('send_choose_contacts'),
			backgroundColor : utm.backgroundColor,
			barColor : utm.barColor
		});
	}
	
	if(utm.Android){
		//create the base screen and hide the Android navbar
		var chooseContactsView = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
	    });

 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.barColor,
		    text : L('send_choose_contacts'),
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
		
		//add the navbar to the screen
		chooseContactsView.add(my_navbar);
		
		//add activityIndicator to window
		chooseContactsView.add(utm.activityIndicator)
	}
	
	var topView = Ti.UI.createView({top:4,layout:'horizontal', width:'100%', height : Titanium.UI.SIZE});
	var mainView = Ti.UI.createView({layout:'vertical', width:'100%', height : '75%'});

	chooseContactsView.add(topView);
	chooseContactsView.add(mainView);

	var chooseAllLabel = Ti.UI.createLabel({
		text : '[Choose All]',
		right : 4,
		width : '100%',
		height : '30dp',
		font: { fontSize:'18dp' },
		textAlign : 'right'
	});
	topView.add(chooseAllLabel);
	chooseAllLabel.addEventListener('click', function(e) {
		checkAll(!allChecked);
	});

	// create table view
	var tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		height : '100%'
	});
	mainView.add(tableview);

	tableview.addEventListener('click', function(e) {
		// event data
		var index = e.index;
		var section = e.section;

		setTimeout(function() {
			utm.log('row clicked:' + section.rows[index]);
			utm.log('row data:' + e.rowData.UserId);
			// set current check

			if (section.rows[index].getHasCheck()) {
				section.rows[index].hasCheck = false;

			} else {
				section.rows[index].hasCheck = true;
			}
			checkEnableSendButton();

		}, 250);
	});

	function checkEnableSendButton() {
		var checkedCount = 0;
		var checkRows = tableview.data[0].rows;
		for (var ii = 0; ii < checkRows.length; ii++) {
			var curRow = checkRows[ii];
			if (curRow.getHasCheck()) {
				checkedCount++;
			}
		}

		if (checkedCount > 0) {
			writeMessageButton.enabled = true;
		} else {
			writeMessageButton.enabled = false;
		}
	}

	var writeMessageButton = Ti.UI.createButton({
		title : L('send_write_your_message'),
		enabled : false,
		top:10
	});
	chooseContactsView.add(writeMessageButton);

	writeMessageButton.addEventListener('click', function() {
		selectedContacts = [];

		var checkRows = tableview.data[0].rows;
		for (var ii = 0; ii < checkRows.length; ii++) {
			var curRow = checkRows[ii];
			if (curRow.getHasCheck()) {
				selectedContacts.push({
					userId : curRow.UserId,
					nickName : curRow.nickName,
					userData : curRow.userData
				});
			}
		}

		Ti.App.fireEvent("app:contactsChoosen", {
			sentToContactList : selectedContacts
		});

	});

	Ti.App.addEventListener('app:getContacts', function() {
		//************* get Contacts*************
		tableview.data = [];
		chooseAllLabel.text = '[Choose All]';
		allChecked = false;
		writeMessageButton.enabled=false;
		//Clear out the list
		utm.setActivityIndicator('Getting your MyHort Contacts...');
		utm.log('call server and get contact list for myHortId:' + utm.targetMyHortID);

		var getMembersReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				utm.setActivityIndicator('');
				Ti.API.info("Received text: " + this.responseText);
				var response = eval('('+this.responseText+')');
				//Received text: [{"UserId":1004,"MyHortId":1003,"MemberType":"Primary","NickName":"Ant","HasMobile":true,"HasEmail":true,"HasFaceBook":false,"HasTwitter":false}]

				if (this.status == 200) {
					utm.log("data returned:" + response);
					var data = [];
					utm.curUserCurMyHortHasTwitter = false;

					for (var i = 0; i < response.length; i++) {
						var row = Ti.UI.createTableViewRow({
							UserId : response[i].UserId,
							id : i,
							nickName : response[i].NickName,
							height : '35dp',
							userData : response[i]
						});

						var l = Ti.UI.createLabel({
							left : 5,
							font : {
								fontSize : '16dp'
							},
							height : '30dp',
							color : '#000',
							text : response[i].NickName
						});
						row.add(l);

						if (utm.User.UserProfile.UserId === response[i].UserId) {
							if (response[i].HasTwitter) {
								utm.curUserCurMyHortHasTwitter = true;
							}
						}

						data[i] = row;
					}

					tableview.data = data;

				} else if (this.status == 400) {
					utm.recordError(response.Message + ' ExceptionMessag:' + response.ExceptionMessage);
				} else {
					utm.log("error");
				}
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				utm.setActivityIndicator('');
				utm.handleError(e, this.status, this.responseText);
			},
			timeout : utm.netTimeout
		});
		getMembersReq.open("GET", utm.serviceUrl + "Members/" + utm.targetMyHortID + '?$orderby=NickName');
		getMembersReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);
		getMembersReq.send();

	});

	chooseContactsView.restForm = function() {
		
		if (tableview.data == undefined || tableview.data[0] == undefined)
			return;
		if (tableview.data[0].rows == undefined)
			return;
		var checkRows = tableview.data[0].rows;
		for (var ii = 0; ii < checkRows.length; ii++) {
			var curRow = checkRows[ii];
			if (curRow.getHasCheck()) {
				curRow.setHasCheck(false);
			}
		}
		writeMessageButton.enabled = false;
	}
	
	function checkAll(_allChecked) {
		var checkRows = tableview.data[0].rows;
		for (var ii = 0; ii < checkRows.length; ii++) {
			var curRow = checkRows[ii];
			curRow.setHasCheck(_allChecked);
		}
		allChecked = !allChecked;

		if (_allChecked) {
			chooseAllLabel.text = '[Unchoose All]';
			writeMessageButton.enabled=true;
		} else {
			chooseAllLabel.text = '[Choose All]';
			writeMessageButton.enabled=false;
		}
	}

	return chooseContactsView;
}

module.exports = ChooseContacts_window;
