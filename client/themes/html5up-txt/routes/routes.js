app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
	var template =  'themes/html5up-txt/templates/';

    $routeProvider.when('/:page', {
		template: '<ng-include src="templateUrl()"></ng-include>',
		controller: 'pageCtrl'
	}).otherwise({
		redirectTo: '/'
	});
}]);