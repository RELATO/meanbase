module.exports = function(app, mongoose, models, responder, CRUD) {

	CRUD.setModel(mongoose.model('Role'));
	responder.setType('role');

	app.route('/server/roles')
		.post(function(req, res) {
			var data = new models.Role(req.body);
			CRUD.create(req, res, data);
		})
		.get(function(req, res) {
			CRUD.find(req, res);
		})
		.put(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			CRUD.delete(req, res);
		});
};