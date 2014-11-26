app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
	var templates = 'themes/ThirdTheme/templates/';
    $routeProvider.when('/', {
		templateUrl: templates + "front-page",
		controller: 'pageCtrl',
		resolve: {
			resolveData: getPage
		}
	}).when('/blog', {
		template: '<ng-include src="templateUrl()"></ng-include>',
		controller: 'blogCtrl',
		resolve: {
			resolveData: getPages
		}
	}).when('/:page', {
		template: '<ng-include src="templateUrl()"></ng-include>',
		controller: 'pageCtrl',
		resolve: {
			resolveData: getPage
		}
	}).otherwise({
		redirectTo: '/'
	});
}]);

function getPage($http, $location) {
	return $http.get('/server/pages/approved', {params: {url: $location.url()}}).success(function(response) {
		return response.data;
	}).error(function(error) {
		return error;
	});
}

function getPages($http, $location) {
	return $http.get('/server/pages', {params: {url: $location.url()}}).success(function(response) {
		return response.data;
	}).error(function(error) {
		return error;
	});
}



// app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
// 	var templates = 'themes/SecondTheme/templates/';
//     $routeProvider.when('/', {
// 		templateUrl: templates + "front-page",
// 		controller: 'mainCtrl'
// 	}).when('/:page', {
// 		templateUrl: templates + "page",
// 		controller: 'mainCtrl'
// 	}).otherwise({
// 		redirectTo: '/'
// 	});
// }]);