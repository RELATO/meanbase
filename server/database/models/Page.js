module.exports = function(Schema, models, validate, mongoose) {
	// Pages
	var pageSchema = new Schema({
		author: String,
		visibility: {
			type: String,
			default: 'Everyone',
			trim: true
		},
		editability: {
			type: String,
			trim: true
		},
		created: {
			type: Date, 
			default: Date.now
		},
		updated: Date,
		url: {
			type: String,
			unique: true,
			trim: true
		},
		tabTitle: {
			type: String,
			trim: true
		},
		template: {
			type: String,
			required: true,
			trim: true
		},
		title: {
			type: String,
			trim: true,
			default: "Title"
		},
		content: {
			type: Object,
			default: {}
		},
		description: String,
		summary: String,
		galleries: [models.gallerySchema],
		comments: [{type:Schema.ObjectId, ref: 'Comment'}], 
		// menuId: {type: Schema.ObjectId, ref: 'Menu'},
		meta: Object,
		published: {
			type: Boolean,
			default: false
		},
		likes: Number
	});
	return mongoose.model('Page', pageSchema);
};