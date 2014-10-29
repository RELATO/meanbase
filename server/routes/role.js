module.exports = function(app, mongoose, models) {
	// Page: Create Read Update Delete
	app.route('/server/roles')
		.post(function(req, res) {
			var data = new models.Roles({
				role: req.body.role,
				permissions: {
					editContent: req.body.editContent,
					publishContent: req.body.publishContent,
					deleteContent: req.body.deleteContent,
					manageMedia: req.body.manageMedia,
					restrictAccess: req.body.restrictAccess,
					manageExtensions: req.body.manageExtensions,
					moderateComments: req.body.moderateComments,
					manageUsers: req.body.manageUsers,
					manageRoles: req.body.manageRoles,
					changeSiteSettings: req.body.changeSiteSettings,
					importExportData: req.body.importExportData,
					deleteSite: req.body.deleteSite,
					allPrivilages: req.body.allPrivilages,
				}
			});
			data.save(function(error, found) {
				if(error) {
					res.send(error);
				} else {
					if(found) {
						res.send('Created ' + found.role);
					} else {
						res.send('Could not create that role.');
					}
				}
			});
		})
		.get(function(req, res) {
			if(req.query.role) {
				mongoose.model('Roles').findOne({role: req.query.role}, function(error, found) {
					if(error) {
						res.send(error);
					} else {
						if(found) {
							res.json(found);
						} else {
							res.send('Could not find any role with that name.');
						}
					}
				});
			} else {
				mongoose.model('Roles').find(function(error, found) {
					if(found) {
						res.json(found);
					} else {
						res.send('Could not find any roles.');
					}
				});
			}
		})
		.put(function(req, res) {
			if(req.body.user) {
				mongoose.model('Roles').findOneAndUpdate({role: req.body.role}, {$set: req.body}, function(error, found) {
					if (error) {
					    res.send(error);
					} else {
						if(found) {
							res.send(found.role + ' was updated.');
						} else {
							res.send('Could not find a role with that name to update.');
						}
					    
					}
				});
			} else {
				res.send('Please choose a role to update.');
			}
			
		})
		.delete(function(req, res) {
			if(req.body.role) {
				mongoose.model('Roles').findOneAndRemove({role: req.body.role}, function (error, found) { 
					if (error) {
					    res.send(error);
					} else {
						if(found) {
							res.send('Deleted ' + found.role);
						} else {
							res.send('A role with that name could not be found.');
						}
					}
				});
			} else {
				mongoose.model('Roles').remove(function(error) {
					if(error) {
						res.send('error');
					} else {
						res.send('Deleted all roles in the database.');
					}
				});
			}
		});
};