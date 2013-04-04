function createMyHortWindow(_myHortData, utm, _isOwner) {

	var win = Ti.UI.createWindow({
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor,
		title:'Members',
		layout : 'vertical'
	});
	
	var colHeader = Ti.UI.createView({
		layout:'horizontal',
		height:20,
		top:5
	});
	win.add(colHeader);
	
	var nickNameLbl = Ti.UI.createLabel({
		text : 'Nickname',
		font : {
			fontWeight : 'bold',
			fontSize : 16
		},
		color : utm.color_org
	})
	colHeader.add(nickNameLbl);
	
	var memberTypeLbl = Ti.UI.createLabel({
		text : 'Member Type',
		font : {
			fontWeight : 'bold',
			fontSize : 16
		},
		color : utm.color_org,
		left:15		
	})
	colHeader.add(memberTypeLbl);
	
	var acceptsLbl = Ti.UI.createLabel({
		text : 'Accepts',
		font : {
			fontWeight : 'bold',
			fontSize : 16
		},
		color : utm.color_org,
		left:40
	})
	colHeader.add(acceptsLbl);

	var tableView = Titanium.UI.createTableView({
		height : '100%'
	});
	win.add(tableView);

	//Load list on focus event
	win.addEventListener("focus", function() {
		loadMembers();
	});

	function loadMembers() {
		populateTable(_myHortData.Members);
	}

	function populateTable(myHortMembersData) {
		tableView.setData([]);
		var tableData = [];
		for (var i = 0; i < myHortMembersData.length; i++) {
			if( _isOwner || myHortMembersData[i].MemberType !=='Invisible'){
				var row = Ti.UI.createTableViewRow({
					className : 'row',
					row : clickName = 'row',
					objName : 'row',
					touchEnabled : false,
					height : 55,
					hasChild : false,
					myHortMembersRowData : myHortMembersData[i]
				});
	
				var hView = Ti.UI.createView({
					layout : 'composite',
					backgroundColor : '#fff',
					objName : 'hView'
				});
	
				var nickName = Ti.UI.createLabel({
					backgroundColor : '#fff',
					color : '#000',
					font : {
						fontSize : 14,
						fontWeight : 'bold'
					},
					objName : 'myHortName',
					text : myHortMembersData[i].NickName,
					touchEnabled : false,
					//top : 5,
					left : 2,
					width : 110,
					height : 15,
					ellipsize : false
				});
				hView.add(nickName);
	
				//Member Type
				var memberType = Ti.UI.createLabel({
					backgroundColor : '#fff',
					color : '#000',
					objName : 'memberType',
					text : myHortMembersData[i].MemberType,
					touchEnabled : false,
					left : 115,
					height : 15,
					ellipsize : false
				});
				hView.add(memberType);
	
				var iconView = Ti.UI.createView({
					layout:'horizontal'
					,left:utm.SCREEN_WIDTH - 80			
				});			
				hView.add(iconView);
				
				if(myHortMembersData[i].HasMobile){}
					var phoneIcon = Ti.UI.createImageView({
							image :  '/images/phone_black.png',
							width : myHortMembersData[i].HasMobile?14:0,
							height : 24,
							right:myHortMembersData[i].HasMobile?3:0,
							top:15, 
							visible:myHortMembersData[i].HasMobile
					});
					iconView.add(phoneIcon);
				myHortMembersData[i].HasMobile	
				
				var emailIcon = Ti.UI.createImageView({
						image :  '/images/email_black.png',
						width : myHortMembersData[i].HasEmail?24:0,
						height : 16,
						right:myHortMembersData[i].HasEmail?3:0,
						top:15,
						visible:myHortMembersData[i].HasEmail
				});
				iconView.add(emailIcon);
				
				var twitterIcon = Ti.UI.createImageView({
						image :  '/images/twitter_black.png',
						width : myHortMembersData[i].HasTwitter?24:0,
						height : 24,
						right:myHortMembersData[i].HasTwitter?3:0,
						top:15,
						visible:myHortMembersData[i].HasTwitter
				});
				iconView.add(twitterIcon);
	
				row.add(hView);
				tableData.push(row);
			}
		}

		tableView.setData(tableData);

	}
	
	if(_isOwner){
		//Add Click to Details for drilldown
		tableView.addEventListener('click', function(e) {
			utm.MemberDetailsWindow = require('screens/MyHortMemberDetail');
			utm.memberDetailsWindow = new utm.MemberDetailsWindow(e.rowData.myHortMembersRowData,utm);
			utm.navController.open(utm.memberDetailsWindow);
		});
	}

	//This event handler resets the member detail after its been updated in MyHortMemberDetail	
	Ti.App.addEventListener('app:myHortMemberDetailReload', function(e){
		for (i=0;i< _myHortData.Members.length;i++){
			if(_myHortData.Members[i].Id === e.Id){
				_myHortData.Members[i]=e;
				break;
			}	
		}
		loadMembers();
	});

	return win;

}

module.exports = createMyHortWindow;
