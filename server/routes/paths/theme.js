module.exports = function(app, mongoose, models, response) {
	// Page: Create Read Update Delete
	app.route('/server/themes')
		.post(function(req, res) {
			var data = new models.Theme({
				author: req.body.author,
				email: req.body.email,
				title: req.body.title,
				website: req.body.website,
				preview: req.body.preview,
				url: req.body.url
			});
			data.save(function(error, found) {
				if(error) {
					res.send(error);
				} else {
					res.send(found.title + ' was created.');
				}
			});
		})
		.get(function(req, res) {
			mongoose.model('Theme').find(function(error, found) {
				if(found) {
					res.json(found);
				} else {
					res.send('Could not find any Themes.');
				}
			});
		})
		.delete(function(req, res) {
			mongoose.model('Theme').remove(function(error) {
				if(error) {
					res.send('error');
				} else {
					res.send('Deleted all themes in the database.');
				}
			});
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
							res.send(found.title + ' was activated.');
						} else {
							res.send('That theme could not be activated.');
						}
					}
				});
			}
		});
	});

	app.route('/server/themes/:theme')
		.get(function(req, res) {
			mongoose.model('Theme').findOne({url: req.params.theme}, function(error, found) {
				if(found) {
					res.json(found);
				} else {
					res.send('Could not find a theme with that url');
				}
			});
		})
		.put(function(req, res) {
			mongoose.model('Theme').findOneAndUpdate({url: req.params.theme}, {$set: req.body}, function(error, found) {
				if (error) {
				    res.send(error);
				} else {
					if(found) {
						res.send(found.title + ' was updated.');
					} else {
						res.send('Could not find a theme with that url to update.');
					}
				    
				}
			});
		})
		.delete(function(req, res) {
			mongoose.model('Theme').findOneAndRemove({url: req.params.theme}, function (error, found) { 
				if (error) {
				    res.send(error);
				} else {
					if(found) {
						res.send(found.title + ' was deleted.');
					} else {
						res.send('Could not find a page with that url to delete.');
					}
				}
			});
		});
};