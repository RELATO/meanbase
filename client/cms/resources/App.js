var app = angular.module('app', ['ngResource', 'ngRoute', 'crudApp']);

app.config(['$locationProvider', '$httpProvider', '$routeProvider', function($locationProvider, $httpProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
}]);