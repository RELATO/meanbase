app.controller('pageCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'resolveData', '$sanitize', function($scope, $rootScope, $http, $location, CRUD, resolveData, $sanitize) {

	$rootScope.page = resolveData.data;

	CRUD.comment.findByUrl($location.url(), function(data) {
		$scope.comments = data;
	});

	CRUD.menu.findAll(function(response) {
		$scope.menus = response;
	});
	$scope.templateUrl = function() {
		return 'themes/SecondTheme/templates/' + resolveData.data.template;
	}

	$scope.getClass = function(path) {
	    if ($location.path() == path) {
	      return "active"
	    } else {
	      return ""
	    }
	}

}]);