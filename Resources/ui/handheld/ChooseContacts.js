var ChooseContacts_window =function() {
	
	var chooseContactsView = Titanium.UI.createWindow({
	   width:'auto'
	   ,height:'auto'
	   ,layout:'vertical'
	   ,title:L('send_choose_contacts')
	   ,backgroundColor:utm.backgroundColor
	   ,barColor:utm.barColor
	});		
	
	var selectedContacts =[];
	
	var chooseContactsLabel = Ti.UI.createLabel({
			text:L('send_select_recipient')+'(s)',
			top:6,
			width:'auto',
			height:30,
			textAlign:'center'
	});
	chooseContactsView.add(chooseContactsLabel);		
		
	// create table view
	var tableview = Titanium.UI.createTableView({
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		height:'50%'
	});
	chooseContactsView.add(tableview);	
	
	tableview.addEventListener('click', function(e)
	{
		// event data
		var index = e.index;
		var section = e.section;
		
		setTimeout(function()
		{
			log('row clicked:'+section.rows[index]);
			log('row data:'+e.rowData.UserId);
			// set current check
			
			if(section.rows[index].getHasCheck()){
				section.rows[index].hasCheck = false;
				
			}else{
				section.rows[index].hasCheck = true;	
			}
			checkEnableSendButton();
						
		},250);	
	});
	
	function checkEnableSendButton(){
		var checkedCount=0;
		var checkRows = tableview.data[0].rows;
		for (var ii=0;ii<checkRows.length;ii++)
		{
			var curRow = checkRows[ii];
			if(curRow.getHasCheck()){
				checkedCount++;
			}
		}
		
		if(checkedCount>0){
			writeMessageButton.enabled =true;
		}else{
			writeMessageButton.enabled =false;
		}
	}
	
	var writeMessageButton = Ti.UI.createButton({
		title:L('send_write_your_message'),
		enabled:false,
		top:34,
		width:'auto',
		height:30
	});	
	chooseContactsView.add(writeMessageButton);
	
	writeMessageButton.addEventListener('click',function()
	{		
		selectedContacts=[];

		var checkRows = tableview.data[0].rows;
		for (var ii=0;ii<checkRows.length;ii++)
		{
			var curRow = checkRows[ii];
			if(curRow.getHasCheck()){
				selectedContacts.push({userId:curRow.UserId, nickName:curRow.nickName,userData:curRow.userData});
			}
		}	
		
		Ti.App.fireEvent("app:contactsChoosen", {
	        sentToContactList: selectedContacts
	    });	
		
	});
	
	
	Ti.App.addEventListener('app:getContacts',function(){
	//************* get Contacts*************
		tableview.data=[];//Clear out the list
		setActivityIndicator('Getting your MyHort Contacts...');
		log('call server and get contact list for myHortId:'+utm.targetMyHortID);
	
		var getMembersReq = Ti.Network.createHTTPClient({
		     validatesSecureCertificate:utm.validatesSecureCertificate 
			,onload : function(e) {
				setActivityIndicator('');
		         Ti.API.info("Received text: " + this.responseText);
		        var json = this.responseData;
				var response = JSON.parse(json);
				//Received text: [{"UserId":1004,"MyHortId":1003,"MemberType":"Primary","NickName":"Ant","HasMobile":true,"HasEmail":true,"HasFaceBook":false,"HasTwitter":false}]
				
				if(this.status ==200){					
					log("data returned:"+response);
					var data = [];
					utm.curUserCurMyHortHasTwitter = false;
					
					for (var i=0;i<response.length;i++)
					{
						var row = Ti.UI.createTableViewRow({UserId:response[i].UserId, id:i, nickName:response[i].NickName,height:35,userData:response[i]});
						
						var l = Ti.UI.createLabel({left:5, font:{fontSize:16}, height:30,color:'#000',text:response[i].NickName});
						row.add(l);
						
						if(utm.User.UserProfile.UserId ===response[i].UserId ){
							if(response[i].HasTwitter){
								utm.curUserCurMyHortHasTwitter=true;
							}
						}
						
						data[i] = row;
					}
				
					tableview.data=data;
					
				}else if(this.status == 400){				
					recordError(response.Message+ ' ExceptionMessag:'+response.ExceptionMessage);			
				}else{
					log("error");				
				}		
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {		      
		     	setActivityIndicator('');  
		        	handleError(e,this.status,this.responseText); 
		     }
		     ,timeout:utm.netTimeout
		});	
		getMembersReq.open("GET",utm.serviceUrl+"Members/"+utm.targetMyHortID +'?$orderby=NickName');
		getMembersReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	
		getMembersReq.send();	
		
	});
	
	chooseContactsView.restForm=function(){		
		if(tableview.data==undefined || tableview.data[0] ==undefined) return;
		if(tableview.data[0].rows ==undefined) return;
		var checkRows = tableview.data[0].rows;
		for (var ii=0;ii<checkRows.length;ii++)
		{
			var curRow = checkRows[ii];
			if(curRow.getHasCheck()){
				curRow.setHasCheck(false);
			}
		}			
		writeMessageButton.enabled =false;
	}
	
	
	return chooseContactsView;
	
	
}
module.exports = ChooseContacts_window;
