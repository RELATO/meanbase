module.exports = function(app, mongoose, models) {

	// Define the Collection we will be viewing and manipulating information in
	var model = mongoose.model('Page');

	// Import a server response object with prebuilt functions to make sending messages to client simplier
	var response = require('./response')('page');

	// Add custom functions for Page Routes onto server response object
	response.create = function(res, found) {
		if(found) {
			res.send(found.url + ' was created.');
		} else {
			res.send('Could not create page.');
		}
	}; 

	response.updateOne = function(res, found) {
		if(found) {
			res.send(found.url + ' was updated.');
		} else {
			res.send('Could not find that page to update.');
		}
	}; 

	response.deleteOne = function(res, found) {
		if(found) {
			res.send(found.url + ' was deleted.');
		} else {
			res.send('Could not find that page to delete.');
		}
	}; 

	// Create (1), Find, Edit, Delete multiple or all
	app.route('/server/pages')
		.post(function(req, res) {
			// Create a new Page
			var data = new models.Page(req.body);
			data.save(function(error, found) {
				response.respond(res, error, found, response.create);	
			});
		})
		.get(function(req, res) {
			if(req.query) {
				// Find Pages Based on Query
				model.find(req.query, function(error, found) {
					response.respond(res, error, found, response.findBy);	
				});
			} else {
				// Find All Pages
				model.find(function(error, found) {
					response.respond(res, error, found, response.findAll);	
				});
			}
		})
		.put(function(req, res) {
			if(req.body.identifier) {
				// Update Multiple Pages by identifier
				model.update(req.body.identifier, {$set: req.body.replacementData}, {multi: true}, function(error, found) {
					response.respond(res, error, found, response.updateBy);	
				});
			} else {
				// Update All Pages
				model.update({}, {$set: req.body}, {multi: true}, function(error, found) {
					response.respond(res, error, found, response.updateAll);
				});
			}
			
		})
		.delete(function(req, res) {
			if(!isEmpty(req.body)) {
				// Delete Multiple Pages
				model.find(req.body).populate('comments').exec(function(error, foundPages) {
					if(error) {
						res.send(error);
					} else {
						if(foundPages) {
							// Collect all comment ids in pages

							var ids = [];
							var pageids = [];
							var j = 0;
							while(j < foundPages.length) {
								pageids.push(foundPages[j]._id);
								var i = 0;
								while(i < foundPages[j].comments.length) {
									ids.push(foundPages[j].comments[i]._id);
									i++;
								}
								j++;
							}

							// Delete dependant comments
							mongoose.model('Comment').remove({_id: {$in: ids}}, function(error, found) {
								if(error) {
									res.send(error);
								} else {
									// Delete the Page itself
									model.remove(foundPages, function(error, found) {
										res.send("Deleted those particular pages and all their dependant comments.");
									});
								}
							});
						} else {
							res.send('Could not find any pages with that url.');
						}
					}
				});
			} else {
				// Delete all Pages
				model.remove(function(error, found) {
					if(error) {
						res.send(error);
					} else {
						if(found) {
							// Deleted all comments
							mongoose.model('Comment').remove({}, function(error, found) {
								if(error) {
									res.send(error);
								} else {
									if(found) {
										res.send('Deleted all comments and pages.');
									} else {
										res.send('Could not find any comments to delete.');
									}
								}
							});
						} else {
							res.send('Could not find any pages to delete.');
						}
					}
					// response.respond(res, error, found, response.deleteAll);
				});
			}
		});

	// Find, Edit, Delete one by url
	app.route('/server/:url')
		.get(function(req, res) {
			// Find One Page by url
			model.findOne({url: req.params.url}, function(error, found) {
				response.respond(res, error, found, response.findOne);
			});
		})
		.put(function(req, res) {
			// Update One Page by url
			model.findOneAndUpdate({url: req.params.url}, {$set: req.body}, function(error, found) {
				response.respond(res, error, found, response.updateOne);
			});
		})
		.delete(function(req, res) {
			// Delete One Page by url
			model.findOne({url: req.params.url}).populate('comments').exec(function(error, foundPage) {
				if(error) {
					res.send(error);
				} else {
					if(foundPage) {
						// Collect all comment ids in page
						var ids = [];
						var i = 0;
						while(i < foundPage.comments.length) {
							ids.push(foundPage.comments[i]._id);
							i++;
						}
						// Delete dependant comments
						mongoose.model('Comment').remove({_id: {$in: ids}}, function(error, found) {
							if(error) {
								res.send(error);
							} else {
								// Delete the Page itself
								model.remove(foundPage, function(error, found) {
									res.send("Deleted " + foundPage.title + " and all it's comments.");
								});
							}
						});
					} else {
						res.send('Could not find any pages with that url.');
					}
				}
			});
		});
};