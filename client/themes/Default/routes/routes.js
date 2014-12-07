app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
	var template =  'themes/Default/templates/';

    $routeProvider.when('/', {
		templateUrl: template + "front-page",
		controller: 'pageCtrl'
	}).when('/:page', {
		template: '<ng-include src="templateUrl()"></ng-include>',
		controller: 'pageCtrl'
	}).otherwise({
		redirectTo: '/'
	});
}]);