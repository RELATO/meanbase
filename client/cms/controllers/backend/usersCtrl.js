cms.controller('usersCtrl', ['$scope', '$http', '$location', 'CRUD', function($scope, $http, $location, CRUD) {

	CRUD.user.find({}, function(response) {
		if(!response.error) {
			$scope.users = response.response;
		}
	});	

	CRUD.role.find({}, function(response) {
		if(!response.error) {
			$scope.roles = response.response;
		}
	});	

	function getRole(id) {
		var i = 0;
		while(i < $scope.roles.length) {
			if($scope.roles[i]._id == id) {
				return $scope.roles[i];
			}
			i++;
		}
	}

	$scope.userFilter = '';

	$scope.updatePermissions = function() {
		var i = 0;
		while(i < $scope.roles.length) {
			if($scope.roles[i]._id == $scope.selectedRole) {
				$scope.permissions = $scope.roles[i].permissions;
			}
			i++;
		}
	};

	$scope.updateRole = function(roleForm) {
		console.log('$scope.selectedRole', $scope.selectedRole);
		if($scope.selectedRole) {
			CRUD.role.update({_id: $scope.selectedRole}, {permissions: $scope.permissions}, function(response) {
				console.log(response.response);
			});
		}
	};

	$scope.createRole = function() {
		var roleName = prompt('Role Name?');
		if(roleName) {
			CRUD.role.create({role: roleName, permissions: $scope.permissions}, function(response) {
				console.log(response.response);
			});
		}
	};

	$scope.deleteRole = function() {
		if($scope.selectedRole) {
			var confirmed = confirm('Are you sure you want to delete this role? All users currently using this role will be switched to basic.');
			if(confirmed) {
				var basicId;
				CRUD.role.find({role: 'Basic'}, function(response) {
					if(!response.error) {
						basicId = response.response[0]._id;
						console.log('basicId', basicId);
						CRUD.user.update({access: $scope.selectedRole}, {access: basicId}, function(response) {
							console.log('Updated Users');
							CRUD.role.delete({_id: $scope.selectedRole}, function(response) {
								console.log(response.response);
							});
						});
					}
				});
			}
		}
	};


	$scope.filterUsers = function(user) {
		return (user.username + user.email + user.access.role + user.active + user.lastVisited).toLowerCase().indexOf($scope.userFilter.toLowerCase()) >= 0;
	};

	$scope.createUser = function() {
		CRUD.user.create($scope.new, function(response) {
			response.response.access = getRole($scope.new.access);
			$scope.users.push(response.response);
		});
	};

	$scope.updateUser = function(user) {
		var newInfo = {};
		angular.copy(user, newInfo);
		newInfo.access = user.access;
		console.log('user', newInfo);
		CRUD.user.update({_id: user._id}, newInfo, function(response) {
			console.log(response.response);
		});
	};

	$scope.deleteUser = function(user, index) {
		CRUD.user.delete({_id: user._id}, function(response) {
			if(!response.error) {
				$scope.users.splice(index, 1);
			}
		});
	};
}]);