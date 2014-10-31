cms.controller('commentsCtrl', ['$scope', '$http', '$location', 'CRUD', function($scope, $http, $location, CRUD) {
	CRUD.page.findAll(function(response) {$scope.comments = response;});
}]);