var ChooseContacts_window = function(utm) {

	var allChecked = false;
	var selectedContacts = [];
	
	if(utm.iPhone || utm.iPad){
		var win = Titanium.UI.createWindow({
			layout : 'vertical',
			title : L('send_choose_contacts'),
			backgroundColor : utm.backgroundColor,
			barColor : utm.barColor
		});
	}
	
	if(utm.Android){
		//create the base screen and hide the Android navbar
		var win = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
	    });

 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : '44dp',
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text : L('send_choose_contacts'),
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
		
		//add the navbar to the screen
		win.add(my_navbar);
		
		//add activityIndicator to window
		if (utm.iPhone || utm.iPad)
			win.add(utm.activityIndicator);
	}
	 
	var mainView = Ti.UI.createView({layout:'vertical', width:'100%', height:'80%'});
	var bottomView = Ti.UI.createView({layout:'vertical', width:'100%', height:'20%'});

	win.add(mainView);
	win.add(bottomView);

	var chooseAllButton = Ti.UI.createButton({
		title : 'Choose All',
		enabled : false,
		top:2,
		bottom:2,
		right:2,
		height:'35dp'
	});
	mainView.add(chooseAllButton);

	chooseAllButton.addEventListener('click', function() {
		checkAll(!allChecked);
	});


	// create table view
	var tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		height : '80%'
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
				if(utm.Android){
		          	section.rows[index].backgroundColor= '#ffffff';
		        }

			} else {
				section.rows[index].hasCheck = true;
				if(utm.Android){
		          	section.rows[index].backgroundColor= utm.androidBarColor;
		        }
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
		top:5
	});
	bottomView.add(writeMessageButton);
	
	var helpLabel= Ti.UI.createLabel({
		text:'Choose at least one Recipient'
		,font : {
			fontSize : '12dp'
			}
		});
	bottomView.add(helpLabel);

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
		chooseAllButton.title = 'Choose All';
		allChecked = false;
		writeMessageButton.enabled=false;
		chooseAllButton.enabled=false;
		//Clear out the list
		utm.setActivityIndicator(win , 'Getting your MyHort Contacts...');
		utm.log('call server and get contact list for myHortId:' + utm.targetMyHortID);

		var getMembersReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				utm.setActivityIndicator(win , '');
				Ti.API.info("Received text: " + this.responseText);
				var response = eval('('+this.responseText+')');
				//Received text: [{"UserId":1004,"MyHortId":1003,"MemberType":"Primary","NickName":"Ant","HasMobile":true,"HasEmail":true,"HasFaceBook":false,"HasTwitter":false}]

				if (this.status == 200) {
					utm.log("data returned:" + response);
					var data = [];
					utm.curUserCurMyHortHasTwitter = false;
					utm.curUserCurMyHortHasFacebook = false;
					chooseAllButton.enabled=true;

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
							text : response[i].NickName,
							width:'80%'
						});
						row.add(l);

						if (utm.User.UserProfile.UserId === response[i].UserId) {
							utm.curUserCurMyHortNickName = response[i].NickName;
							if (response[i].HasTwitter) {
								utm.curUserCurMyHortHasTwitter = true;
							}
							if (response[i].HasFaceBook) {
								utm.curUserCurMyHortHasFacebook = true;
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
				utm.setActivityIndicator(win , '');
				utm.handleError(e, this.status, this.responseText);
			},
			timeout : utm.netTimeout
		});
		getMembersReq.open("GET", utm.serviceUrl + "Members/" + utm.targetMyHortID + '?$orderby=NickName');
		getMembersReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);
		getMembersReq.send();

	});

	win.restForm = function() {
		
		if (tableview.data == undefined || tableview.data[0] == undefined)
			return;
		if (tableview.data[0].rows == undefined)
			return;
		var checkRows = tableview.data[0].rows;
		for (var ii = 0; ii < checkRows.length; ii++) {
			var curRow = checkRows[ii];
			if (curRow.getHasCheck()) {
				curRow.setHasCheck(false);
				if(utm.Android){
		          	curRow.backgroundColor= '#ffffff';
		        }
			}
		}
		writeMessageButton.enabled = false;
	};
	
	function checkAll(_allChecked) {
		var checkRows = tableview.data[0].rows;
		for (var ii = 0; ii < checkRows.length; ii++) {
			var curRow = checkRows[ii];
			curRow.setHasCheck(_allChecked);
			
			if(utm.Android){
				if(_allChecked)
	          		curRow.backgroundColor= utm.androidBarColor;
	          	else
	          		curRow.backgroundColor= '#ffffff';	
	        }
			
		}
		allChecked = !allChecked;

		if (_allChecked) {
			chooseAllButton.title = 'Unchoose All';
			writeMessageButton.enabled=true;
		} else {
			chooseAllButton.title = 'Choose All';
			writeMessageButton.enabled=false;
		}
	}

	return win;
};

module.exports = ChooseContacts_window;
