module.exports = function(Schema, models, validate, mongoose) {
	// Images
	var imagesSchema = new Schema({
		url: {
			type: String,
			required: true,
			validate: validate.url
		},
		order: Number,
		alt: {
			type: String,
			trim: true
		}, 
		caption: {
			type: String,
			trim: true
		},
		title: {
			type: String,
			trim: true
		}
	});
	return mongoose.model('Images', imagesSchema);
};