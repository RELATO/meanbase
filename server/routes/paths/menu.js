module.exports = function(app, mongoose, models, responder, CRUD) {

	CRUD.setModel(mongoose.model('Menu'));
	responder.setType('menu');

	app.route('/server/menus')
		.post(function(req, res) {
			var data = new models.Menu(req.body);
			CRUD.create(req, res, data);
		})
		.get(function(req, res) {
			CRUD.findAndSort(req, res, {position: 1});
		})
		.put(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			CRUD.delete(req, res);
		});
};