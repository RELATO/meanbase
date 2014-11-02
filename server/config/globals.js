module.exports = function(models) {
	models.Theme.findOne({active: true}, function(error, found) {
		if(error) {
			GLOBAL.THEME = 'Default';
		} else {
			if(found) {
				GLOBAL.THEME = found.url;
			} else {
				GLOBAL.THEME = 'Default';
			}
		}
	});

	GLOBAL.isEmpty = function(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}
};