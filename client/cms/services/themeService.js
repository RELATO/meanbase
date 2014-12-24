app.service('theme', ['$location', 'CRUD', '$http', function($location, CRUD, $http) {
	function theme() {
		this.getMenus = function() {
			var allMenus = $.Deferred();
			CRUD.menu.find({}, function(response) {
				var i = 0;
				var menus = {};
				while(i < response.response.length) {
					if(menus[response.response[i].location] == undefined) {
						menus[response.response[i].location] = [];
					}
					menus[response.response[i].location].push(response.response[i]);
					i++;
				}
				allMenus.resolve(menus);
			});
			return allMenus.promise();
		}; //getMenus

		this.findMenuById = function(menus, id) {
			var found;
			for (var property in menus) {
			    if (menus.hasOwnProperty(property)) {
			    	for(var menu in menus[property]) {
			    		if(menus[property][menu].id == id) {
			    			found = {data: menus[property][menu], index: menu};
			    		}
			    	}
			    }
			}
			return found;
		};

		this.setMenus = function(menus) {
			var condensedMenus = [];
			for (var property in menus) {
			    if (menus.hasOwnProperty(property)) {
			    	for(var menu in menus[property]) {
			    		console.log('menu', menus[property][menu]);
			    		condensedMenus.push(menus[property][menu]);
			    	}
			    }
			}
			// console.log('condensedMenus', condensedMenus);
			CRUD.menu.delete({}, function(response) {
				for(var i in condensedMenus) {
					CRUD.menu.create(condensedMenus[i], function(response) {
						console.log('response', response);
					});
				}
			});
		};

		this.getAllArticles = function() {
			var allArticles = $.Deferred();
			console.log('getall');
			CRUD.page.find({template: 'article'}, function(response) {
				var i = 0;
				var articles = []
				while(i < response.response.length) {
					articles = articles.concat(response.response[i]);
					i++;
				}
				allArticles.resolve(articles);
			});
			return allArticles.promise();
		}; //getallArticles

		this.comment = function(comment) {
			var comment = {
				author: comment.author,
				ip: '186.136.5.1',
				date: Date.now(),
				email: comment.email,
				content: comment.content,
				url: $location.url()
			};
			CRUD.comment.create(comment, function(response) {

				console.log(response.response);
			});
		}; //createComment

		this.getPage = function() {
			var page = $.Deferred();
			$http.get('/server/pages/approved', {params: {url: $location.url()}}).success(function(response) {
				console.log('getPage', response);
				page.resolve(response[0]);
			}).error(function(error) {
				page.resolve(error[0]);
			});
			return page.promise();
		}; //getPage

		this.getRoles = function() {
			var roles = $.Deferred();
			CRUD.role.find({}, function(response) {
				roles.resolve(response.response);
			});
			return roles.promise();
		};

		this.isActive = function(path, classtoAdd) {
			if(!classtoAdd) { classtoAdd = 'active'; }
			if ($location.path() == path) {
				return classtoAdd;
			} else {
				return "";
			}
		}; //isActive

	}
	return new theme();
}]);