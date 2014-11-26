module.exports = function(Schema, models, validate, mongoose) {
	// Menu
	var gallerySchema = new Schema({
		images: [{type:Schema.ObjectId, ref: 'Images'}],
		order: {
			type: String,
			default: "Descending"
		},
		orderBy: {
			type: String,
			default: 'date'
		}
	});
	return gallerySchema;
};