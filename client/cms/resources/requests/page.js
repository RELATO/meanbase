app.service('page', ['$http', function($http) {
	function Requests() {
		this.create = function(data, callback) {
			$http.post('/server/pages', data).success(function(data) {
				callback(data);
			}).error(function(error) {
				console.log(error);
			});
		};

		this.findOne = function(url, callback) {
			$http.get('/server'+url).success(function(response) {
				callback(response);
			}).error(function(error) {
				console.log(error);
			});
		};

		this.findBy = function(paramaters, callback) {
			$http.get('/server/pages', {params: paramaters}).success(function(response) {
				callback(response);
			}).error(function(error) {
				console.log(error);
			});
		};

		this.findAll = function(callback) {
			$http.get('/server/pages').success(function(response) {
				callback(response);
			}).error(function(error) {
				console.log(error);
			});
		};

		this.updateOne = function(url, data, callback) {
			$http.put('/server'+url, data).success(function(response) {
				callback(response);
			}).error(function(error) {
				console.log(error);
			});
		};

		this.updateBy = function(data, callback) {
			$http.put('/server/pages', data).success(function(response) {
				callback(response);
			}).error(function(error) {
				console.log(error);
			});
		};

		this.updateAll = function(data, callback) {
			if(data.identifier) {
				callback("You have included an identifier in a update all request. Please remove the identifier if you wish to update all or use .updateBy({identifier: {}, replacementData: {}}) for updating by a criteria.");
			} else {
				$http.put('/server/pages', data).success(function(response) {
					callback(response);
				}).error(function(error) {
					console.log(error);
				});
			}
		};

		this.deleteOne = function(url, callback) {
			$http.delete('/server'+url).success(function(response) {
				callback(response);
			}).error(function(error) {
				console.log(error);
			});
		};

		this.deleteBy = function(data, callback) {
			$http.delete('/server/pages', data).success(function(response) {
				callback(response);
			}).error(function(error) {
				console.log(error);
			});
		};

		this.deleteAll = function(callback) {
			$http.delete('/server/pages').success(function(response) {
				callback(response);
			}).error(function(error) {
				console.log(error);
			});
		};
	}
	return new Requests();
}]);