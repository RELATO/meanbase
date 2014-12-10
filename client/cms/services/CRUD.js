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

angular.module('crudApp').service('rest', ['$http', function($http) {
	function Rest(urlPath) {
		this.create = function(data, callback) {
			$http.post('/server/' + urlPath, data).success(function(response) {
				callback({error: false, response: response});
			}).error(function(error) {
				callback({error: true, response: response});
			});
		};

		this.find = function(identifier, callback) {
			$http.get('/server/' + urlPath, {params: identifier}).success(function(response) {
				callback({error: false, response: response});
			}).error(function(error) {
				callback({error: true, response: response});
			});
		};

		this.update = function(identifier, replacementData, callback) {
			$http.put('/server/' + urlPath, {identifier: identifier, replacementData: replacementData}).success(function(response) {
				callback({error: false, response: response});
			}).error(function(error) {
				callback({error: true, response: response});
			});
		};

		this.delete = function(identifier, callback) {
			$http.delete('/server/' + urlPath, {
			    params: identifier,
			    headers: {"Content-Type": "application/json;charset=utf-8"}
  			}).success(function(response) {
				callback({error: false, response: response});
			}).error(function(error) {
				callback({error: true, response: response});
			});
		};
	}
	return function(urlPath) { return new Rest(urlPath);};
}]);