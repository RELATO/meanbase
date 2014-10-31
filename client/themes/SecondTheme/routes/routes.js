app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
	var templates = 'themes/SecondTheme/templates/';
    $routeProvider.when('/', {
		templateUrl: templates + "front-page",
		controller: 'mainCtrl'
	}).when('/:page', {
		templateUrl: templates + "page",
		controller: 'mainCtrl'
	}).otherwise({
		redirectTo: '/'
	});
}]);