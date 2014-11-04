module.exports = function(app, mongoose, models, responder, CRUD) {

	CRUD.setModel(mongoose.model('Comment'));
	responder.setType('comment');

	// Post a comment to a url
	app.post('/server/:url/comment', function(req, res) {
		req.body.url = req.params.url;
		var data = new models.Comment(req.body);
		
		CRUD.createAndLink(req, res, data, req.params, 'comments', mongoose.model('Page'));
	});

	// Get, Edit, and Delete comments by paramaters
	app.route('/server/comments')
		.post(function(req, res) {
			req.params.url = req.body.url;
			req.body.url = null;
			var data = new models.Comment(req.body);
			CRUD.createAndLink(req, res, data, req.params, 'comments', mongoose.model('Page'));
		})
		.get(function(req, res) {
			CRUD.find(req, res);
		})
		.put(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			CRUD.deleteAndUnlink(req, res, 'comments', mongoose.model('Page'));
		});

	// Get all comments for a particular url
	app.get('/server/:url/comments', function(req, res) {
		CRUD.find(req, res);
	});
};