angular.module('crudApp', ['ngResource', 'ngRoute']);

angular.module('crudApp').service('CRUD', ['$http', 'rest', function($http, rest) {
	function Requests() {
		this.menu = rest('menus');
	  	this.page = rest('pages');
	  	this.user = rest('users');
	  	this.role = rest('roles');
	  	this.theme = rest('themes');
	  	this.image = rest('images');
	  	this.comment = rest('comments');
	  	this.site = rest('site');
	}
  return new Requests();
}]);