cms.controller('settingsCtrl', ['$scope', '$http', '$location', 'CRUD', function($scope, $http, $location, CRUD) {
	CRUD.theme.find({}, function(response) {
		console.log(response);
		if(!response.error) {
			$scope.themes = response.response;
			console.log($scope.themes);
		}
	});	

	$scope.activateTheme = function(theme, $index) {
		$http.put('/server/themes/' + theme.url + '/activate').success(function(response) {
			console.log(theme.url + ' actived!');
			var i = 0;
			while(i < $scope.themes.length) {
				$scope.themes[i].active = false;
				i++;
			}
			theme.active = true;
		}).error(function(error) {
			console.log('Could not activate ' + theme.url);
		});
	};
}]);