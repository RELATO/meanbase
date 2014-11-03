module.exports = function(app, mongoose, models, response) {
	// Page: Create Read Update Delete
	app.route('/server/users')
		.post(function(req, res) {
			var data = new models.User({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
				gravatar: req.body.gravatar,
				meta: req.body.meta,
				lastVisited: Date.now()
			});
			data.save(function(error, found) {
				if(error) {
					res.send(error);
				} else {
					if(found) {
						res.send('Created ' + found.username);
					} else {
						res.send('Could not create that user.');
					}
				}
			});
		})
		.get(function(req, res) {
			if(req.query.user) {
				mongoose.model('User').findOne({username: req.query.user}, function(error, found) {
					if(error) {
						res.send(error);
					} else {
						if(found) {
							res.json(found);
						} else {
							res.send('Could not find any users with that username.');
						}
					}
				});
			} else {
				mongoose.model('User').find(function(error, found) {
					if(found) {
						res.json(found);
					} else {
						res.send('Could not find any users.');
					}
				});
			}
		})
		.put(function(req, res) {
			if(req.body.user) {
				mongoose.model('User').findOneAndUpdate({username: req.body.user}, {$set: req.body}, function(error, found) {
					if (error) {
					    res.send(error);
					} else {
						if(found) {
							res.send(found.username + ' was updated.');
						} else {
							res.send('Could not find a theme with that url to update.');
						}
					    
					}
				});
			} else {
				res.send('Please send a username by which to find a user to update.');
			}
			
		})
		.delete(function(req, res) {
			if(req.body.user) {
				mongoose.model('User').findOneAndRemove({username: req.body.user}, function (error, found) { 
					if (error) {
					    res.send(error);
					} else {
						if(found) {
							res.send('Deleted ' + found.username);
						} else {
							res.send('A user with that username could not be found.');
						}
					}
				});
			} else {
				mongoose.model('User').remove(function(error) {
					if(error) {
						res.send('error');
					} else {
						res.send('Deleted all users in the database.');
					}
				});
			}
		});
};