app.controller('blogCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'resolveData', '$sanitize', function($scope, $rootScope, $http, $location, CRUD, resolveData, $sanitize) {

	$rootScope.page = resolveData.data[0];
	// console.log('resolveData',resolveData);
	
	CRUD.menu.find({}, function(response) {
		$scope.menus = response.response;
	});

	CRUD.page.find({template: 'post'}, function(response) {
		var i = 0;
		var posts = []
		while(i < response.response.length) {
			console.log('response.response[i]',response.response[i]);
			posts = posts.concat(response.response[i]);
			i++;
		}
		$scope.posts = posts;
		console.log('posts', posts);
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