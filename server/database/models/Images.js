module.exports = function(Schema, models, validate, mongoose) {
	// Images
	var imagesSchema = new Schema({
		url: {
			type: String,
			required: true
		},
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
	var model = mongoose.model('Image', imagesSchema);
	return model;
};