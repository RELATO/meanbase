var fs = require('fs'),
	fsmonitor = require('fsmonitor');
module.exports = function(app, mongoose, models, responder, CRUD) {

	CRUD.setModel(mongoose.model('Image'));
	responder.setType('image');

	// Page: Create Read Update Delete
	app.route('/server/images')
		.get(function(req, res) {
			res.setHeader('content-type', 'image');
			CRUD.find(req, res);
		})
		.post(function(req, res) {
			CRUD.update(req, res);
		})
		.delete(function(req, res) {
			CRUD.find(req, res, {}, function(res, error, found) {
				if(error) {
					res.send(error);
				} else if(found) {
					var i = 0;
					while(i < found.length) {
						fs.unlink('./client/' + found[i].url, function (error) {
							if (error)
								return console.log('Could not delete those images.', error);
						});
						i++;
					} //while
				} else {
					res.send('Could not find any images matching that query.');
				}
			});
		});

	app.route('/server/images/ckeditor')
		.get(function(req, res) {
			console.log('req.query.CKEditorFuncNum', req.query.CKEditorFuncNum);
			res.render('cms/templates/file-browser', {CKEditorFuncNum: req.query.CKEditorFuncNum});
		});



	fsmonitor.watch('./client/images/', null, function(change) {
	    var i = 0;
	    while(i < change.addedFiles.length) {
	    	var image = new models.Image({
				url: 'images/' + change.addedFiles[i],
			}); 
			image.save(function(error, found) {
				if(error)
					console.log(error);
			});
	    	i++;
	    }

	    var i = 0;
	    while(i < change.removedFiles.length) {
	    	mongoose.model('Image').remove({url: 'images/' + change.removedFiles[i]}, function(error, found) {
				if(error)
					console.log(error);
			});
	    	i++;
	    }
	});
};