module.exports = function(Schema, models, validate, mongoose) {
	// Theme
	var themeSchema = new Schema({
		author: String,
		email: String,
		website: String,
		title: String,
		description: String,
		url: {
			type: String,
			unique: true
		},
		preview: String,
		active: {
			type: Boolean,
			required: true,
			default: false
		},
		meta: Object
	});
	return mongoose.model('Theme', themeSchema);
};