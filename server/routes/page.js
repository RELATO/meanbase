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
					response.respond(res, error, foundPages, response.deleteByAndDependancies, model, mongoose.model('Comment'), 'comments');
				});
			} else {
				// Delete all Pages
				model.remove(function(error, found) {
					response.respond(res, error, found, response.deleteAllAndDependancies, model, mongoose.model('Comment'));
				});
			}
		});

	// Find, Edit, and Delete only one by url
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
				response.respond(res, error, foundPage, response.deleteOneAndDependancies, model, mongoose.model('Comment'), 'comments');
			});
		});
};