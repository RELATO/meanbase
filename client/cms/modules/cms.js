var cms = angular.module('cms', ['ngResource', 'ngRoute', 'crudApp', 'angularFileUpload']);

cms.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
	var templates = '/cms/templates/backend/mb-';
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
	}).when('/cms/apps', {
		templateUrl: templates + 'apps',
		controller: 'appsCtrl'
	}).when('/cms/:page', {
		templateUrl: function(params) {
			return templates + params.page;
		},
		controller: 'cmsCtrl'
	}).otherwise({
		redirectTo: '/'
	});
}]);