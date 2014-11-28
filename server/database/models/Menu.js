module.exports = function(Schema, models, validate, mongoose) {
	// Menu
	var menuSchema = new Schema({
		title: String,
		url: {
			type: String,
			unique: true,
			trim: true
		},
		location: {
			type: String,
			trim: true,
			default: 'main'
		},
		position: {
			type: Number,
			default: 0
		},
		classes: {
			type: String,
			default: ''
		},
		target: {
			type: String,
			default: '_self'
		}
	});
	return mongoose.model('Menu', menuSchema);
};