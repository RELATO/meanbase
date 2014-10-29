module.exports = function(app, mongoose, models) {

	// Define the Collection we will be viewing and manipulating information in
	var model = mongoose.model('Comment');
	// Import a server response object with prebuilt functions to make sending messages to client simplier
	var response = require('./response')('comment');

	function isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}

	// Add custom functions for Comment Routes onto server response object
	response.findByUrl = function(res, found) {
		if(found) {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(found.comments));
		} else {
			res.send('Could not find any comments for that url.');
		}
	}; 

	response.createAndUpdate = function(res, found) {
		if(found) {
			res.send('Added comment to ' + found.title);
		} else {
			res.send('Could not add the comment.');
		}
	}; 

	response.deleteOne = function(res, found) {
		if(found) {
			mongoose.model('Page').findOneAndUpdate({comments: found._id}, {$pull: {comments: found._id}}, function(error, found) {
				if(error) {
					res.send(error);
				} else {
					if(found) {
						res.send(found);
					} else {
						res.send('Failed: Could not delete that comment from the page.');
					}
				}
			});
		} else {
			res.send('Could not find that comment to delete.');
		}
	}; 

	response.deleteBy = function(res, found) {
		if(found) {
			res.send('Deleted ' + found + ' comments from all associated pages.');
		} else {
			res.send('Deleted the comments links to the pages, but were unable to delete the comments themselves.');
		}
	}; 

	response.deleteAll = function(res, foundComments) {
		if(foundComments) {
			mongoose.model('Page').update({}, { $set: { comments: [] }}, {multi: true}, function(error, found) {
				if(error) {
					res.send('error: ', error);
				} else {
					if(found) {
						// Delete those Comments
						res.send('Removed all ' + foundComments + ' comments from ' + found  + ' pages.');
					} else {
						res.send('Failed: Could not delete those comments from those pages.');
					}
				}
			});
		} else {
			res.send('Could not delete any comments.');
		}
	};

	// Post a comment to a url
	app.post('/server/:url/comment', function(req, res) {
		// Saves the comments to Comment collection and adds an _id to the Page Collection
		var data = new models.Comment(req.body);
		data.save(function(error) {
			if(error) {
				res.send(error);
			} else {
				mongoose.model('Page').findOneAndUpdate({url: req.params.url}, {$push: {comments: data._id}}, function(error, found) {
					response.respond(res, error, found, response.createAndUpdate);
				});
			}
		});
	});

	// Get, Edit, and Delete comments by paramaters
	app.route('/server/comments')
	.get(function(req, res) {
		if(req.query.id) {
			// Find One by ID
			model.findOne({_id: req.query.id}, function(error, found) {
				response.respond(res, error, found, response.findOne);
			});
		} else if(req.query) {
			// Find Multiple Comments Matching Query
			model.find(req.query, function(error, found) {
				response.respond(res, error, found, response.findBy);	
			});
		} else {
			// Find All Comments
			model.find(function(error, found) {
				response.respond(res, error, found, response.findAll);
			});
		}
	})
	.put(function(req, res) {
		if(req.body.id) {
			// Find One Comment by ID and Update
			model.findOneAndUpdate({_id: req.body.id}, {$set: req.body}, function(error, found) {
				response.respond(res, error, found, response.updateOne);
			});
		} else if(req.body.identifier) {
			// Update Multiple Comments by identifier {identifier: {}, replacementData: {}}
			model.update(req.body.identifier, {$set: req.body.replacementData}, {multi: true}, function(error, found) {
				response.respond(res, error, found, response.updateBy);	
			});
		} else {
			// Update All Comments
			model.update({}, {$set: req.body}, {multi: true}, function(error, found) {
				response.respond(res, error, found, response.updateAll);
			});
		}
	})
	.delete(function(req, res) {
		if(req.body.id) {
			// Remove One Comment by ID
			model.findOneAndRemove({_id: req.body.id}, function (error, found) { 
				response.respond(res, error, found, response.deleteOne);
			});
		} else if (!req.body.id && req.body.ids) {
			// Delete comments by id array
			mongoose.model('Page').update({comments: {$in: ids}}, {$pullAll: {comments: ids}}, {multi: true}, function(error, found) {
				if(error) {
					res.send('error: ', error);
				} else {
					if(found) {
						// Delete those comments
						model.remove({_id: {$in: ids}}, function(error, found) {
							response.respond(res, error, found, response.deleteBy);
						});
					} else {
						res.send('Failed: Could not delete those comments from those pages.');
					}
				}
			});
		} else if (!isEmpty(req.body)) {
			// Delete Multiple Comments
			model.find(req.body, function(error, found) {
				if(error) {
					res.send(error);
				} else {
					if(found) {
						var ids = [];
						var i = 0;
						while(i < found.length) {
							ids.push(found[i].id);
							i++;
						}
						mongoose.model('Page').update({comments: {$in: ids}}, {$pullAll: {comments: ids}}, {multi: true}, function(error, found) {
							if(error) {
								res.send('error: ', error);
							} else {
								if(found) {
									// Delete those Comments
									model.remove({_id: {$in: ids}}, function(error, found) {
										response.respond(res, error, found, response.deleteBy);
									});
								} else {
									res.send('Failed: Could not delete those comments from those pages.');
								}
							}
						});
					} else {
						res.send('Could not find any comments with that criteria.');
					}
				}
			});
		} else {
			// Delete all Comments
			model.remove(function(error, found) {
				response.respond(res, error, found, response.deleteAll);
			});
		}
	});

	// Get all comments for a particular url
	app.get('/server/:url/comments', function(req, res) {
		mongoose.model('Page').findOne({url: req.params.url}).populate('comments').exec(function(error, found) {
			response.respond(res, error, found, response.findByUrl);
		});
	});
};