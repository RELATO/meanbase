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

		this.getAllPosts = function() {
			var allPosts = $.Deferred();
			CRUD.page.find({template: 'post'}, function(response) {
				var i = 0;
				var posts = []
				while(i < response.response.length) {
					posts = posts.concat(response.response[i]);
					i++;
				}
				allPosts.resolve(posts);
			});
			return allPosts.promise();
		}; //getAllPosts

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