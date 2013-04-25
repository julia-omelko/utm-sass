function createMyHortWindow(_myHortData, utm, _isOwner) {

	if (utm.iPhone || utm.iPad) {
		var win = Ti.UI.createWindow({
			backgroundColor : utm.backgroundColor,
			barColor : utm.barColor,
			title:'Members',
			layout : 'vertical'
		});
	}

	if (utm.Android) {
		//create the base screen and hide the Android navbar
		var win = Titanium.UI.createWindow({
			layout : 'vertical',
			backgroundColor : utm.backgroundColor,
			navBarHidden : true
		});

		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
			height : 50,
			width : '100%',
			backgroundColor : utm.barColor,
			text : 'Members',
			color : utm.backgroundColor,
			font : {
				fontSize : utm.androidTitleFontSize,
				fontWeight : utm.androidTitleFontWeight
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			top : 0
		});

		//add the navbar to the screen
		win.add(my_navbar);		
	}
	
	var colHeader = Ti.UI.createView({
		layout:'horizontal',
		height:'20dp',
		top:5
	});
	win.add(colHeader);
	
	var nickNameLbl = Ti.UI.createLabel({
		text : 'Nickname',
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		},
		color : utm.color_org
	})
	colHeader.add(nickNameLbl);
	
	var memberTypeLbl = Ti.UI.createLabel({
		text : 'Visible',
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		},
		color : utm.color_org,
		left:'30dp'		
	})
	colHeader.add(memberTypeLbl);
	
	var acceptsLbl = Ti.UI.createLabel({
		text : 'Accepts',
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		},
		color : utm.color_org,
		left:'50dp'
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
					//height : '55dp',
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
						fontSize : '14dp',
						fontWeight : 'bold'
					},
					objName : 'myHortName',
					text : myHortMembersData[i].NickName,
					touchEnabled : false,
					//top : 5,
					left : 2,
					width : '110dp',
					height : '15dp',
					ellipsize : false
				});
				hView.add(nickName);
	
				//Member Type
				var memberType = Ti.UI.createLabel({
					backgroundColor : '#fff',
					color : '#000',
					objName : 'memberType',
					touchEnabled : false,
					left : '115dp',
					height : '15dp',
					font : {
						fontSize : '14dp'
					},
					ellipsize : false
				});
				hView.add(memberType);
				
				if(myHortMembersData[i].MemberType==='Invisible'){
					memberType.text = 'No'
				}else if(myHortMembersData[i].MemberType==='Secondary'){
					memberType.text = 'Yes'
				}// leave primary blank
				
	
				var iconView = Ti.UI.createView({
					layout:'horizontal'
					,left:utm.SCREEN_WIDTH - 100			
				});			
				hView.add(iconView);
				
				if(myHortMembersData[i].HasMobile){}
					var phoneIcon = Ti.UI.createImageView({
							image :  '/images/phone_black.png',
							width : myHortMembersData[i].HasMobile?14:0,
							height : '24dp',
							right:myHortMembersData[i].HasMobile?3:0,
							top:15, 
							visible:myHortMembersData[i].HasMobile
					});
					iconView.add(phoneIcon);
				myHortMembersData[i].HasMobile	
				
				var emailIcon = Ti.UI.createImageView({
						image :  '/images/email_black.png',
						width : myHortMembersData[i].HasEmail?24:0,
						height : '16dp',
						right:myHortMembersData[i].HasEmail?3:0,
						top:15,
						visible:myHortMembersData[i].HasEmail
				});
				iconView.add(emailIcon);
				
				var twitterIcon = Ti.UI.createImageView({
						image :  '/images/twitter_black.png',
						width : myHortMembersData[i].HasTwitter?24:0,
						height : '24dp',
						right:myHortMembersData[i].HasTwitter?3:0,
						top:15,
						visible:myHortMembersData[i].HasTwitter
				});
				iconView.add(twitterIcon);
				
				var facebookIcon = Ti.UI.createImageView({
						image :  '/images/facebook_black.png',
						width : myHortMembersData[i].HasFaceBook?24:0,
						height : '24dp',
						right:myHortMembersData[i].HasFaceBook?3:0,
						top:15,
						visible:myHortMembersData[i].HasFaceBook
				});
				iconView.add(facebookIcon);
	
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
