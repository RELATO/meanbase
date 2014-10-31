module.exports = function(app, mongoose, models) {

	GLOBAL.isEmpty = function(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}

	var commentRoutes = require('./comment')(app, mongoose, models);
	var siteRoutes = require('./site')(app, mongoose, models);
	var themeRoutes = require('./theme')(app, mongoose, models);
	var userRoutes = require('./user')(app, mongoose, models);
	var roleRoutes = require('./role')(app, mongoose, models);
	var pageRoutes = require('./page')(app, mongoose, models);


	app.get('/login', function(req, res) {
		res.render('cms/templates/sc-login');
	});

	app.get('/cms', function(req, res) {
		res.render('cms/templates/SimpleCMS');
	});

	app.get('/cms/templates/:template', function (req, res) {
		res.render('cms/templates/' + req.params.template);
	});

	app.get('/cms/:url', function(req, res) {
		res.render('cms/templates/SimpleCMS');
	});

	app.get('/themes/:theme/templates/:template', function(req, res) {
		res.render('themes/' + req.params.theme + '/templates/' + req.params.template);
	});

	app.get('*', function(req, res) {
		res.render('themes/' + THEME + '/index');
	});
};
