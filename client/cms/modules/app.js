var app = angular.module('app', ['ngResource', 'ngRoute', 'crudApp', 'ngSanitize', 'app.directives', 'ng-sortable', 'ui.bootstrap']);

app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
        // $locationProvider.html5Mode(true);
        $locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
}]);