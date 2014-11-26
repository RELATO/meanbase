app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
	var templates = 'themes/Default/templates/';
    $routeProvider.when('/', {
		templateUrl: templates + "front-page",
		controller: 'pageCtrl'
	}).when('/blog', {
		template: '<ng-include src="templateUrl()"></ng-include>',
		controller: 'blogCtrl'
	}).when('/:page', {
		template: '<ng-include src="templateUrl()"></ng-include>',
		controller: 'pageCtrl'
	}).otherwise({
		redirectTo: '/'
	});
}]);