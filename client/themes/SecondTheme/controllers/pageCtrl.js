app.controller('pageCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'resolveData', '$sanitize', function($scope, $rootScope, $http, $location, CRUD, resolveData, $sanitize) {

	$rootScope.page = resolveData.data[0];
	
	CRUD.menu.findAll(function(response) {
		$scope.menus = response;
	});

	$scope.templateUrl = function() {
		return 'themes/SecondTheme/templates/' + resolveData.data[0].template;
	}

	$scope.getClass = function(path) {
	    if ($location.path() == path) {
	      return "active"
	    } else {
	      return ""
	    }
	}

}]);