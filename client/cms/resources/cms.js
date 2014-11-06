var cms = angular.module('cms', ['ngResource', 'ngRoute', 'crudApp', 'angularFileUpload']);

// cms.config(['$locationProvider', '$routeParams', '$routeProvider', function($locationProvider, $routeParams, $routeProvider) {
//         $locationProvider.html5Mode(true);
//         $routeProvider.when('cms/:page', {
// 			templateUrl: '/cms/templates/sc-' + $routeParams.page,
// 			controller: 'cmsCtrl'
// 		});
// }]);

cms.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
	$locationProvider.html5Mode(true);
	var templates = '/cms/templates/sc-';
    $routeProvider.when('/cms', {
		templateUrl: templates + "settings",
		controller: 'settingsCtrl'
	}).when('/cms/users', {
		templateUrl: templates + 'users',
		controller: 'usersCtrl'
	}).when('/cms/settings', {
		templateUrl: templates + 'settings',
		controller: 'settingsCtrl'
	}).when('/cms/plugins', {
		templateUrl: templates + 'plugins',
		controller: 'pluginsCtrl'
	}).when('/cms/media', {
		templateUrl: templates + 'media',
		controller: 'mediaCtrl'
	}).when('/cms/analytics', {
		templateUrl: templates + 'analytics',
		controller: 'analyticsCtrl'
	}).when('/cms/comments', {
		templateUrl: templates + 'comments',
		controller: 'commentsCtrl'
	}).when('/cms/:page', {
		templateUrl: function(params) {
			return templates + params.page;
		},
		controller: 'cmsCtrl'
	}).otherwise({
		redirectTo: '/'
	});
}]);