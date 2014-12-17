var fs = require('fs'),
	fsmonitor = require('fsmonitor');

module.exports = function(app, mongoose, models, responder, CRUD) {

	CRUD.setModel(mongoose.model('Theme'));
	responder.setType('theme');

	app.route('/server/themes')
		// .post(function(req, res) {
		// 	var data = new models.Theme(req.body);
		// 	CRUD.create(req, res, data);
		// })
		.get(function(req, res) {
			CRUD.find(req, res);
		})
		.put(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			CRUD.delete(req, res);
		});

	app.put('/server/themes/:theme/activate', function(req, res) {
		mongoose.model('Theme').update({active: true}, {active: false}, function(error) {
			if(error) {
				res.send(error);
			} else {
				mongoose.model('Theme').findOneAndUpdate({url: req.params.theme}, {$set: {active: true}}, function(error, found) {
					if (error) {
					    res.send(error);
					} else {
						if(found) {
							THEME = found.url;
							TEMPLATES = found.templates;
							res.send(found.title + ' was activated.');
						} else {
							res.send('That theme could not be activated.');
						}
					}
				});
			}
		});
	});


	fsmonitor.watch('./client/', null, function(change) {

	    var i = 0;
	    while(i < change.addedFiles.length) {
	    	console.log('addedFiles[i]', change.addedFiles[i]);
	    	if(change.addedFiles[i].indexOf('theme.json') != -1) {
	    		var obj;
				fs.readFile('client/' + change.addedFiles[i], 'utf8', function (err, data) {
					if (err) throw err;
					if(data) {
						var parsedData = JSON.parse(data);
						if(typeof(parsedData) == 'object') {
							console.log('is object', parsedData.author);
						} else {
							console.log('is not object', typeof(parsedData));
						}
						var newTheme = new models.Theme(parsedData); 
						newTheme.save(function(error, found) {
							if(error)
								console.log(error);
							else {
								if(found) {
									console.log(found);
								} else
									console.log('Could not create the ' + responder.type + '.');
							}
						});
						
					}
				});
	    	}
	    	i++;
	    }

	    var i = 0;
	    while(i < change.removedFiles.length) {
	    	if(change.removedFiles[i].indexOf('theme.json') != -1) {
	    		var removedFoldersArray = change.removedFiles[i].split('/');
	    		var removedFoldersURL = removedFoldersArray[1];
	    		mongoose.model('Theme').remove({url: removedFoldersURL}, function(error, found) {
					if(error)
						console.log(error);
					else {
						if(found) {
							console.log(found);
						} else
							console.log('Could not find a theme with that url to delete.');
					}
				});
	    	}
	    	i++;
	    }


	    var i = 0;
	    while(i < change.modifiedFiles.length) {
	    	if(change.modifiedFiles[i].indexOf('theme.json') != -1) {
	    		console.log('change.modifiedFiles[i]', change.modifiedFiles[i]);
	    		var obj;
				fs.readFile('client/' + change.modifiedFiles[i], 'utf8', function (err, data) {
					if (err) throw err;
					if(data) {
						var parsedData = JSON.parse(data);
						if(typeof(parsedData) == 'object') {
							console.log('is object', parsedData.author);
						} else {
							console.log('is not object', typeof(parsedData));
						}
						var modifiedTheme = parsedData;
						mongoose.model('Theme').findOneAndUpdate({url: modifiedTheme.url}, modifiedTheme, function(error, found) {
							if(found) {
								if(found.active) {
									THEME = found.url;
									TEMPLATES = found.templates;
								}
							}
							console.log('error: ', error, 'found', found);
						});
						
					}
				});
	    	}
	    	i++;
	    }

	    // console.log('change.addedFiles[i]', change.addedFiles[i]);
	    // console.log("Added files:    %j", change.addedFiles);
	    // console.log("Modified files: %j", change.modifiedFiles);
	    // console.log("Removed files:  %j", change.removedFiles);

	    // console.log("Added folders:    %j", change.addedFolders);
	    // console.log("Modified folders: %j", change.modifiedFolders);
	    // console.log("Removed folders:  %j", change.removedFolders);
	});
};