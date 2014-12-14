module.exports = function(app, mongoose, models, responder, CRUD) {
	// Define the Collection we will be viewing and manipulating information in
	CRUD.setModel(mongoose.model('Page'));
	responder.setType('page');

	function deletePageCommentsMenus(req, res) {
		CRUD.deleteAndDependancies(req, res, 'comments', mongoose.model('Comment'), function(res, error, found, callbackParams) {
			var i = 0, urls = [];
			while(i < callbackParams.length) {
				urls = urls.concat(callbackParams[i].url);
				i++;
			}
			mongoose.model('Menu').remove({url: {$in: urls}}, function(error, found) {
				responder.respond(res, error, found, responder.delete);
			});
		});
	}

	app.get('/server/pages/approved', function(req, res) {
		var populateQuery = [{path: 'comments', match: {approved: true}}];
		CRUD.find(req, res, populateQuery);
	});

	app.route('/server/pages')
		.post(function(req, res) {
			if(req.body.url.charAt(0) != '/') {req.body.url = '/'+req.body.url;}
			var newDocument = new models.Page(req.body);
			CRUD.create(req, res, newDocument, function() {
				res.send('Created Page');
			});
		})
		.get(function(req, res) {
			var populateQuery = [{path: 'comments'}];
			CRUD.find(req, res, populateQuery);
		})
		.put(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			deletePageCommentsMenus(req, res);
		});

	// Find, Edit, and Delete only one by url
	app.route('/server/:url')
		.get(function(req, res) {
			var populateQuery = [{path: 'comments', match: {approved: true}}];
			CRUD.find(req, res, populateQuery);
		})
		.put(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			deletePageCommentsMenus(req, res);
		});

	// Routes for home page
	app.route('/server/')
		.get(function(req, res) {
			req.params.url = '';
			CRUD.find(req, res);
		})
		.put(function(req, res) {
			req.params.url = '';
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			req.params.url = '';
			deletePageCommentsMenus(req, res);
		});
};