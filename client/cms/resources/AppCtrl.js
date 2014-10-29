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

	// CRUD.comment.deleteByIds(['5450999f09bfe6dab34714b5', '5450999f09bfe6dab34714b6'], function(response) {console.log(response);});
	CRUD.comment.updateByIds(['545099a009bfe6dab34714b7', '5450a1633dd16ef5b5a9292d'], {author: 'JPM2'}, function(response) {console.log(response);});
}]);