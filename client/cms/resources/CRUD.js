angular.module('crudApp').service('CRUD', ['$http', 'page', 'user', 'role', 'theme', 'comment', 'site', 'menu', function($http, page, user, role, theme, comment, site, menu) {
	function Requests() {
		this.menu = menu;
	  	this.page = page;
	  	this.user = user;
	  	this.role = role;
	  	this.theme = theme;
	  	this.comment = comment;
	  	this.site = site;
	}
  return new Requests();
}]);