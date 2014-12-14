app.controller('pageCtrl', ['$scope', '$rootScope', '$location', 'CRUD', '$sanitize', 'theme', function($scope, $rootScope, $location, CRUD, $sanitize, theme) {
	
	$scope.addComment = function(comment) {
		theme.comment(comment);
	};

}]);