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
				type: Boolean
			},
			publishContent: {
				type: Boolean
			},
			deleteContent: {
				type: Boolean
			},
			manageMedia: {
				type: Boolean
			},
			restrictAccess: {
				type: Boolean
			},
			manageExtensions: {
				type: Boolean
			},
			moderateComments: {
				type: Boolean
			},
			manageUsers: {
				type: Boolean
			},
			manageRoles: {
				type: Boolean
			},
			changeSiteSettings: {
				type: Boolean
			},
			importExportData: {
				type: Boolean
			},
			deleteSite: {
				type: Boolean
			},
			allPrivilages: {
				type: Boolean
			}
		}
	});
	return mongoose.model('Role', roleSchema);
};