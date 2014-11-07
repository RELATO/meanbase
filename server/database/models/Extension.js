module.exports = function(Schema, models, validate, mongoose) {
	// Extensions
	var extensionsSchema = new Schema({
		id: Schema.ObjectId,
		author: String,
		email: String,
		name: String,
		data: Object
	});
	return mongoose.model('Extension', extensionsSchema);
};