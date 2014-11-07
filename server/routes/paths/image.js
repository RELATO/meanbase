var fs = require('fs');
module.exports = function(app, mongoose, models, responder, CRUD) {

	CRUD.setModel(mongoose.model('Image'));
	responder.setType('image');

	// Page: Create Read Update Delete
	app.route('/server/images')
		.post(function(req, res) {
			var image = new models.Image({
				url: req.files.file.name,
			}); 
			CRUD.create(req, res, image, function(response, error, found) {
				res.send(JSON.stringify(found));
			});
			
		})
		.get(function(req, res) {
			res.setHeader('content-type', 'image');
			CRUD.find(req, res);
		})
		.get(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			CRUD.find(req, res, {}, function(res, error, found) {
				CRUD.delete(req, res, function(res, error, foundNumber) {
					if(foundNumber) {
						var i = 0;
						while(i < found.length) {
							fs.unlink('./client/images/' + found[i].url, function (error) {
								if (error)
									return res.send('Deleted entries, but not images themselves:', error);
								else if(i == found.length)
									res.send('Deleted entries and corresponding images.');
							});
							i++;
						} //while
					} else {
						res.send('Could not find any images matching that criteria.');
					}
				}); //CRUD.delete
			});
		});
};