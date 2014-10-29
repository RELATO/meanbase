app.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('server/hello-world').success(function(data) {
		$scope.page = data;
	});
}]);