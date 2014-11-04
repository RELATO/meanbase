angular.module('crudApp').service('CRUD', ['$http', 'rest', 'user', 'role', 'theme', 'comment', 'site', function($http, rest, user, role, theme, comment, site) {
	function Requests() {
		this.menu = rest('menus');
	  	this.page = rest('pages');
	  	this.user = user;
	  	this.role = role;
	  	this.theme = theme;
	  	this.comment = rest('comments');
	  	this.site = site;
	}
  return new Requests();
}]);