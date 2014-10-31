app.controller('mainCtrl', ['$scope', '$http', '$location', 'CRUD', function($scope, $http, $location, CRUD) {
	CRUD.page.findOne($location.url(), function(response) {$scope.page = response;});
	CRUD.comment.findByUrl($location.url(), function(response) {$scope.comments = response;});
}]);