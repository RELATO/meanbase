module.exports = function(Schema, models, validate, mongoose) {
	// Menu
	return contentSchema = new Schema({
		area: {
			type: String,
			trim: true,
			required: true
		},
		content: {
			type: String,
		}
	});
};