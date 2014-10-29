var app = angular.module('app', ['ngResource', 'ngRoute']);

app.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
}]);

// app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

// 	$locationProvider.html5Mode(true);
// 	$routeProvider
// 		.when('/abouting', {
// 			templateUrl: 'themes/SecondTheme/templates/page',
// 			controller: 'mainCtrl'
// 		});
// 	// .otherwise({
// 	// 	redirectTo: '/'
// 	// });
// }]);