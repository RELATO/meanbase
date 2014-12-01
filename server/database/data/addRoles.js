module.exports = function(Schema, models, mongoose) {
	
	var basicRoles = [];

	var basic = new models.Role({
		role: 'Basic',
		permissions: {
			editContent: false,
			publishContent: false,
			deleteContent: false,
			manageMedia: false,
			restrictAccess: false,
			manageExtensions: false,
			moderateComments: false,
			manageUsers: false,
			manageRoles: false,
			changeSiteSettings: false,
			importExportData: false,
			deleteSite: false,
			allPrivilages: false
		}
	});

	var level1 = new models.Role({
		role: 'Level 1',
		permissions: {
			editContent: true,
			publishContent: false,
			deleteContent: false,
			manageMedia: false,
			restrictAccess: false,
			manageExtensions: false,
			moderateComments: false,
			manageUsers: false,
			manageRoles: false,
			changeSiteSettings: false,
			importExportData: false,
			deleteSite: false,
			allPrivilages: false
		}
	});

	var level2 = new models.Role({
		role: 'Level 2',
		permissions: {
			editContent: true,
			publishContent: true,
			deleteContent: false,
			manageMedia: true,
			restrictAccess: false,
			manageExtensions: false,
			moderateComments: false,
			manageUsers: false,
			manageRoles: false,
			changeSiteSettings: false,
			importExportData: false,
			deleteSite: false,
			allPrivilages: false
		}
	});

	var level3 = new models.Role({
		role: 'Level 3',
		permissions: {
			editContent: true,
			publishContent: true,
			deleteContent: true,
			manageMedia: true,
			restrictAccess: true,
			manageExtensions: true,
			moderateComments: true,
			manageUsers: false,
			manageRoles: false,
			changeSiteSettings: false,
			importExportData: false,
			deleteSite: false,
			allPrivilages: false
		}
	});

	var level4 = new models.Role({
		role: 'Level 4',
		permissions: {
			editContent: true,
			publishContent: true,
			deleteContent: true,
			manageMedia: true,
			restrictAccess: true,
			manageExtensions: true,
			moderateComments: true,
			manageUsers: true,
			manageRoles: true,
			changeSiteSettings: false,
			importExportData: false,
			deleteSite: false,
			allPrivilages: false
		}
	});

	var level5 = new models.Role({
		role: 'Level 5',
		permissions: {
			editContent: true,
			publishContent: true,
			deleteContent: true,
			manageMedia: true,
			restrictAccess: true,
			manageExtensions: true,
			moderateComments: true,
			manageUsers: true,
			manageRoles: true,
			changeSiteSettings: true,
			importExportData: true,
			deleteSite: false,
			allPrivilages: false
		}
	});

	var master = new models.Role({
		role: 'Master',
		permissions: {
			editContent: true,
			publishContent: true,
			deleteContent: true,
			manageMedia: true,
			restrictAccess: true,
			manageExtensions: true,
			moderateComments: true,
			manageUsers: true,
			manageRoles: true,
			changeSiteSettings: true,
			importExportData: true,
			deleteSite: true,
			allPrivilages: true
		}
	});

	basicRoles.push(basic, level1, level2, level3, level4, level5, master);

	mongoose.model('Role').find({}, function(error, found) {
		if(found.length == 0) {
			var i = 0;
			while(i < basicRoles.length) {
				basicRoles[i].save(function(error, found) {
					if(error)
						console.log(error);
				});
				i++;
			}
		}
	});

};