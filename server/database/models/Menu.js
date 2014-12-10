module.exports = function(Schema, models, validate, mongoose) {
	// Menu
	var menuSchema = new Schema({
		title: String,
		// _id: {
		// 	type: mongoose.Schema.ObjectId,
		// 	unique: true,
		// 	default: mongoose.Types.ObjectId
		// },
		id: {
			type: Date,
			unique: true,
			default: new Date()
		},
		url: {
			type: String,
			trim: true
		},
		location: {
			type: String,
			trim: true,
			default: 'main'
		},
		position: {
			type: Number,
			default: 0
		},
		classes: {
			type: String,
			default: ''
		},
		target: {
			type: String,
			default: ''
		}
	});
	// menuSchema.index({id: 1, location: 1, position: 1}, { unique: true });
	return mongoose.model('Menu', menuSchema);
};