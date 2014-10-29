module.exports = function(Schema, models, validate, mongoose) {
	// Menu
	var menuSchema = new Schema({
		title: String,
		url: {
			type: String,
			trim: true,
			validate: validate.url,
			required: true
		},
		location: {
			type: String,
			trim: true
		},
		pageId: {type: Schema.ObjectId, ref: 'Page'}
	});
	return mongoose.model('Menu', menuSchema);
};