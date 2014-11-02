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
		}
	});
	return mongoose.model('Menu', menuSchema);
};