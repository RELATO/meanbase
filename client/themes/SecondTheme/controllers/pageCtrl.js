app.controller('pageCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'resolveData', function($scope, $rootScope, $http, $location, CRUD, resolveData) {

	$rootScope.page = resolveData.data;

	CRUD.comment.findByUrl($location.url(), function(data) {
		$scope.comments = data;
	});
	$scope.templateUrl = function() {
		return 'themes/SecondTheme/templates/' + resolveData.data.template;
	}

}]);