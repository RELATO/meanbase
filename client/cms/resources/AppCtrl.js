app.controller('AppCtrl', ['$scope', '$http', '$location', 'CRUD', function($scope, $http, $location, CRUD) {

	CRUD.page.findOne($location.url(), function(response) {$scope.page = response;});
	// CRUD.page.updateAll({template: 'page'}, function(response) {console.log(response)});
	var newPage = {
		author: 'Jon',
		visibility: 'Level 3',
		editability: 'Level 3',
		url: 'about',
		tabTitle: 'About SimpleCMS',
		template: 'Page',
		title: 'About',
		content: 'SimpleCMS is currently under developement and expected to continue! Horray!',
		likes: 0,
		summary: "SimpleCMS is on it's way",
		description: "About page for SimpleCMS"
	};
}]);