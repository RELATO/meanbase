module.exports = function(Schema, models, validate, mongoose) {
	// Roles
	var roleSchema = new Schema({
		role: {
			type: String,
			required: true,
			unique: true,
			trim: true
		},
		permissions: {
			editContent: {
				type: Boolean,
				required: true,
				default: false
			},
			publishContent: {
				type: Boolean,
				required: true,
				default: false
			},
			deleteContent: {
				type: Boolean,
				required: true,
				default: false
			},
			manageMedia: {
				type: Boolean,
				required: true,
				default: false
			},
			restrictAccess: {
				type: Boolean,
				required: true,
				default: false
			},
			manageExtensions: {
				type: Boolean,
				required: true,
				default: false
			},
			moderateComments: {
				type: Boolean,
				required: true,
				default: false
			},
			manageUsers: {
				type: Boolean,
				required: true,
				default: false
			},
			manageRoles: {
				type: Boolean,
				required: true,
				default: false
			},
			changeSiteSettings: {
				type: Boolean,
				required: true,
				default: false
			},
			importExportData: {
				type: Boolean,
				required: true,
				default: false
			},
			deleteSite: {
				type: Boolean,
				required: true,
				default: false
			},
			allPrivilages: {
				type: Boolean,
				required: true,
				default: false
			},
		}
	});
	return mongoose.model('Roles', roleSchema);
};