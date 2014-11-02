module.exports = function(app, mongoose, models) {

	var model = mongoose.model('Menu');

	// Import a server response object with prebuilt functions to make sending messages to client simplier
	var response = require('./response')('menu');

	app.route('/server/menus')
		.post(function(req, res) {
			var data = new models.Menu(req.body);
			data.save(function(error, found) {
				response.respond(res, error, found, response.create);	
			});
		})
		.get(function(req, res) {
			if(isEmpty(req.query)) {
				// Find Menus Based on Query
				model.find(req.query, function(error, found) {
					response.respond(res, error, found, response.findBy);	
				});
			} else {
				// Find All Menus
				model.find(function(error, found) {
					response.respond(res, error, found, response.findAll);	
				});
			}
		})
		.delete(function(req, res) {
			if(isEmpty(req.body)) {
				model.remove(function(error, found) {
					response.respond(res, error, found, response.deleteAll);
				});
			} else {
				model.remove(req.body, function(error, found) {
					response.respond(res, error, found, response.deleteBy);
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
		});

};