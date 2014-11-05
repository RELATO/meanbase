module.exports = function(Schema, models, validate, mongoose) {
	//Comments
	var commentsSchema = new Schema({
		author: String,
		ip: {
			type: String,
			validate: validate.ip
		},
		date: {
			type: Date, 
			default: Date.now
		},
		approved: {
			type: Boolean,
			default: false,
			required: true
		},
		gravatar: {
			type: String
		},
		email: {
			type: String,
			validate: validate.email
		},
		content: {
				type: String,
				required: true
		},
		meta: Object,
		likes: Number
	});
	var model = mongoose.model('Comment', commentsSchema);

	return model;
};