angular.module('crudApp').service('comment', ['$http', function($http) {
	function Requests() {
		this.create = function(url, data, callback) {
			$http.post('/server/' + url + '/comment', data).success(function(data) {
				callback(data);
			}).error(function(error) {
				callback(error);
			});
		};

		this.findOne = function(id, callback) {
			$http.get('/server/comments', {params: {id: id}}).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.findByUrl = function(url, callback) {
			$http.get('/server' + url + '/comments').success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.findBy = function(paramaters, callback) {
			$http.get('/server/comments', {params: paramaters}).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.findAll = function(callback) {
			$http.get('/server/comments').success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.updateOne = function(data, callback) {
			$http.put('/server/comments', data).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.updateBy = function(identifier, replacementData, callback) {
			$http.put('/server/comments', {identifier: identifier, replacementData: replacementData}).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.updateAll = function(data, callback) {
			if(data.identifier) {
				callback("You have included an identifier in a update all request. Please remove the identifier if you wish to update all or use .updateBy({identifier: {}, replacementData: {}}) for updating by a criteria.");
			} else {
				$http.put('/server/comments', data).success(function(response) {
					callback(response);
				}).error(function(error) {
					callback(error);
				});
			}
		};

		this.deleteOne = function(id, callback) {
			$http.delete('/server/comments', id).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.deleteBy = function(data, callback) {
			$http({
			    method: "DELETE",
			    url: '/server/comments',
			    data: data,
			    headers: {"Content-Type": "application/json;charset=utf-8"}
  			}).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.deleteByIds = function(ids, callback) {
			$http({
			    method: "DELETE",
			    url: '/server/comments',
			    data: {ids: ids},
			    headers: {"Content-Type": "application/json;charset=utf-8"}
  			}).success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};

		this.deleteAll = function(callback) {
			$http.delete('/server/comments').success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
		};
	}
  return new Requests();
}]);