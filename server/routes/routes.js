module.exports = function(app, mongoose, models) {
	var commentRoutes = require('./comment')(app, mongoose, models);
	var siteRoutes = require('./site')(app, mongoose, models);
	var themeRoutes = require('./theme')(app, mongoose, models);
	var userRoutes = require('./user')(app, mongoose, models);
	var roleRoutes = require('./role')(app, mongoose, models);
	var pageRoutes = require('./page')(app, mongoose, models);


	app.get('/login', function(req, res) {
		res.render('cms/templates/sc-login');
	});

	app.get('*', function(req, res) {
		res.render('themes/' + THEME + '/index');
	});
};
