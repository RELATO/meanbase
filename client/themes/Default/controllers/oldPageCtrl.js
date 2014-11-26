app.controller('pageCtrl', ['$scope', '$rootScope', '$location', 'CRUD', 'resolveData', '$sanitize', 'theme', function($scope, $rootScope, $location, CRUD, resolveData, $sanitize, theme) {

	$rootScope.page = resolveData.data[0];

	$scope.templateUrl = function() {
		return 'themes/Default/templates/' + resolveData.data[0].template;
	}

	$scope.addComment = function(comment) {
		theme.comment(comment);
	};

}]);