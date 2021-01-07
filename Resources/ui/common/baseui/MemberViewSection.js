function MemberTableSection(_letter,_tableData){

	var self = Ti.UI.createTableViewSection({
		headerTitle: _letter
	});
	var aRow = [];
	for (var i=0; i<_tableData.length; i++) {
		var MemberViewSection = require('/ui/common/baseui/MemberViewRow');
		aRow[i] = new MemberViewSection(_tableData[i]);
		self.add(aRow[i]);
	}
	
    return self;
 }
 module.exports = MemberTableSection;
 