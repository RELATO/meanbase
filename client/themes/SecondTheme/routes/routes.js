app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
	var template = 'themes/SecondTheme/templates/';

    $routeProvider.when('/', {
		templateUrl: template + "front-page",
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

// function getPage($http, $location) {
// 	return $http.get('/server/pages/approved', {params: {url: $location.url()}}).success(function(response) {
// 		return response.data;
// 	}).error(function(error) {
// 		return error;
// 	});
// }