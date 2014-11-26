var validate = require('./validation')();

module.exports = function(app, mongoose) {	

	// Connect to meanbase
	var mongoURL = 'mongodb://localhost/meanbase';
	mongoose.connect(mongoURL);
	var db = mongoose.connection;
	var Schema = mongoose.Schema;

	// Test Connection
	db.on('error', console.error.bind(console, 'mongoose connection error'));
	db.once('open', function callback() {
		console.log('Mongodb and Mongoose running and connected to ' + mongoURL);
	});


	this.models = {};

	// Define Models
	models.Comment = require('./models/Comment')(Schema, models, validate, mongoose);
	models.Image = require('./models/Images')(Schema, models, validate, mongoose);
	models.gallerySchema = require('./models/Gallery')(Schema, models, validate, mongoose);
	models.contentSchema = require('./models/Content')(Schema, models, validate, mongoose);
	models.Page = require('./models/Page')(Schema, models, validate, mongoose);
	models.Menu = require('./models/Menu')(Schema, models, validate, mongoose);
	models.User = require('./models/User')(Schema, models, validate, mongoose);
	models.Extension = require('./models/Extension')(Schema, models, validate, mongoose);
	models.Theme = require('./models/Theme')(Schema, models, validate, mongoose);
	models.Role = require('./models/Role')(Schema, models, validate, mongoose);
	require('../config/globals')(models);

	require('./data/addRoles')(Schema, models, mongoose);
	require('./data/addPage')(Schema, models, mongoose);
	
	return models;
};


