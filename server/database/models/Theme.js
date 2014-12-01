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
		templates: {
			type: Object,
			required: true,
			default: {
				"front-page": "front-page",
				"blog": "blog",
				"page": "page",
				"post": "post"
			}
		},
		meta: Object
	});
	return mongoose.model('Theme', themeSchema);
};