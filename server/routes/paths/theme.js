module.exports = function(app, mongoose, models, responder, CRUD) {

	CRUD.setModel(mongoose.model('Theme'));
	responder.setType('theme');

	app.route('/server/themes')
		.post(function(req, res) {
			var data = new models.Theme(req.body);
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

	app.put('/server/themes/:theme/activate', function(req, res) {
		mongoose.model('Theme').update({active: true}, {active: false}, function(error) {
			if(error) {
				res.send(error);
			} else {
				mongoose.model('Theme').findOneAndUpdate({url: req.params.theme}, {$set: {active: true}}, function(error, found) {
					if (error) {
					    res.send(error);
					} else {
						if(found) {
							THEME = found.url;
							res.send(found.title + ' was activated.');
						} else {
							res.send('That theme could not be activated.');
						}
					}
				});
			}
		});
	});
};