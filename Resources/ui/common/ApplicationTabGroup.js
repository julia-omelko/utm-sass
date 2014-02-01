function ApplicationTabGroup() {
	//create module instance
	var self = Ti.UI.createTabGroup({
		backgroundColor: 'white'
	});
	utm.winStack = [];
	
	var	MessagesWin = require('ui/common/Messages'),
		MembersWin = require('ui/common/Members'),
		GroupsWin = require('ui/common/Groups'),
		SettingsWin = require('ui/common/Settings'),
		LogoutWin = require('ui/common/Logout');
	
	
	var win1 = new MessagesWin(self),
		win2 = new MembersWin(self),
		win3 = new GroupsWin(self),
		win4 = new SettingsWin(self),
		win5 = new LogoutWin(self);
	
	var tab1 = Ti.UI.createTab({
		title: 'Messages',
		icon: '/images/tabicon/messages@2x.png',
		window: win1
	});
	win1.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: 'Members',
		icon: '/images/tabicon/members@2x.png',
		window: win2
	});
	win2.containingTab = tab2;
	
	var tab3 = Ti.UI.createTab({
		title: 'Groups',
		icon: '/images/tabicon/groups@2x.png',
		window: win3
	});
	win3.containingTab = tab3;
	
	var tab4 = Ti.UI.createTab({
		title: 'Settings',
		icon: '/images/tabicon/settings@2x.png',
		window: win4
	});
	win4.containingTab = tab4;
	
	var tab5 = Ti.UI.createTab({
		title: 'Logout',
		icon: '/images/tabicon/logout@2x.png',
		window: win5
	});
	win5.containingTab = tab5;
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	self.addTab(tab5);
	
	return self;
};

module.exports = ApplicationTabGroup;
