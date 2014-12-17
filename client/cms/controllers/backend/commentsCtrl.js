cms.controller('commentsCtrl', ['$scope', '$http', '$location', 'CRUD', function($scope, $http, $location, CRUD) {

	CRUD.page.find({template: 'article'}, function(response) {
		var pages = response.response;
		$scope.pages = pages;
		var i = 0;
		var comments = [];
		while(i < pages.length) {
			var x = 0;
			while(x < pages[i].comments.length) {
				pages[i].comments[x].title = pages[i].title;
				x++;
			}
			comments = comments.concat(pages[i].comments);
			i++;
		}
		$scope.comments = comments;
	});	

	$scope.commentFilter = '';

	$scope.filterComments = function(comment) {
		return (comment.content + comment.author + comment.ip + comment.email + comment.date + comment.title).toLowerCase().indexOf($scope.commentFilter.toLowerCase()) >= 0;
	};

	$scope.approveComment = function(comment, index) {
		CRUD.comment.update({_id: comment._id}, {approved: true}, function(response) {
			if(!response.error) {
				$scope.comments[index].approved = true;
			}
		});
	};

	$scope.unapproveComment = function(comment, index) {
		CRUD.comment.update({_id: comment._id}, {approved: false}, function(response) {
			if(!response.error) {
				$scope.comments[index].approved = false;
			}
		});
	};

	$scope.deleteComment = function(comment, index) {
		console.log(comment._id);
		CRUD.comment.delete({_id: comment._id}, function(response) {
			if(!response.error) {
				console.log(response.response);
				$scope.comments.splice(index, 1);
			}
		});
	};

	// $scope.editComment = function(comment, index) {
	// 	CRUD.
	// };
}]);