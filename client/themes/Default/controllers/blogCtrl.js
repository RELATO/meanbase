app.controller('blogCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', '$sanitize', 'theme', function($scope, $rootScope, $http, $location, CRUD, $sanitize, theme) {

	theme.getAllPosts().then(function(posts) {
		$scope.posts = posts;
	});

}]);