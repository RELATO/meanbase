app.controller('pageCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'resolveData', '$sanitize', function($scope, $rootScope, $http, $location, CRUD, resolveData, $sanitize) {

	$rootScope.page = resolveData.data[0];
	
	CRUD.menu.find({}, function(response) {
		$scope.menus = response.response;
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

	$scope.author = "JP";
	$scope.email = "milesjonpaul@gmail.com";
	$scope.content = "Hello World!";

	$scope.addComment = function() {
		var commit = {
			author: $scope.author,
			ip: '186.136.5.1',
			date: Date.now(),
			email: $scope.email,
			content: $scope.content,
			url: $location.url()
		};
		CRUD.comment.create(commit, function(response) {
			console.log(response.response);
		});
	};

}]);