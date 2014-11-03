angular.module('crudApp').service('menu', ['$http', function($http) {
	function Requests() {
		this.create = function(url, data, callback) {
			$http.post('/server/menus', data).success(function(data) {
				callback(data);
			}).error(function(error) {
				callback(error);
			});
		};

		this.findBy = function(paramaters, callback) {
			$http.get('/server/menus', {params: paramaters}).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.findAll = function(callback) {
			$http.get('/server/menus').success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.updateBy = function(identifier, replacementData, callback) {
			$http.put('/server/menus', {identifier: identifier, replacementData: replacementData}).success(function(response) {
				if(callback) {callback(response);}
			}).error(function(error) {
				if(callback) {callback(error)};
			});
		};

		this.updateAll = function(data, callback) {
			if(data.identifier) {
				callback("You have included an identifier in a update all request. Please remove the identifier if you wish to update all or use .updateBy({identifier: {}, replacementData: {}}) for updating by a criteria.");
			} else {
				$http.put('/server/menus', data).success(function(response) {
					callback(response);
				}).error(function(error) {
					callback(error);
				});
			}
		};

		this.deleteBy = function(data, callback) {
			$http({
			    method: "DELETE",
			    url: '/server/menus',
			    data: data,
			    headers: {"Content-Type": "application/json;charset=utf-8"}
  			}).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.deleteAll = function(callback) {
			$http.delete('/server/menus').success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};
	}
  return new Requests();
}]);