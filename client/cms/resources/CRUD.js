app.service('CRUD', ['$http', 'page', 'user', 'role', 'theme', 'comment', 'site', function($http, page, user, role, theme, comment, site) {
	function Requests() {
	  	this.page = page;
	  	this.user = user;
	  	this.role = role;
	  	this.theme = theme;
	  	this.comment = comment;
	  	this.site = site;
	}
  return new Requests();
}]);