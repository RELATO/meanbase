module.exports = function(Schema, models, validate, mongoose) {
	// Users
	var usersSchema = new Schema({
		username: {
			type: String,
			trim: true,
			unique: true,
			validate: validate.username
		},
		email: {
	        type: String,
	        trim: true,
	        unique: true,
	        validate: validate.email,
	        required: 'Email address is required'
		},
		password: {
			type: String,
			required: true
		},
		access: {
			type:Schema.ObjectId, 
			ref: 'Role',
			required: true
		},
		signedIn: {
			type: Boolean,
			default: true
		},
		gravatar: String,
		active: {
			type: Boolean,
			default: true
		},
		meta: Object,
		lastVisited: {
			type: Date, 
			default: Date.now
		}
	});
	return mongoose.model('User', usersSchema);
};