module.exports = function(app, mongoose, models, responder, CRUD) {

	CRUD.setModel(mongoose.model('User'));
	responder.setType('user');

	app.route('/server/users')
		.post(function(req, res) {
			var data = new models.User(req.body);
			CRUD.create(req, res, data);
		})
		.get(function(req, res) {
			var populateQuery = {path: 'access'};
			CRUD.find(req, res, populateQuery);
		})
		.put(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			CRUD.delete(req, res);
		});
};