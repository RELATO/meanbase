app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', function($scope, $rootScope, $http, $location, CRUD, ckeditorService) {

	$scope.inEditMode = false;

	// Edit Mode
	$('#sc-editMode').click(function(e){
		if($scope.inEditMode == false) {
			$scope.inEditMode = true;

			jQuery('.sc-editable').attr('contenteditable', true);
			CKEDITOR.inlineAll();
			for(i in CKEDITOR.instances) {
				CKEDITOR.instances[i].firstSnapshot = CKEDITOR.instances[i].getData();
			}	

			$('#sc-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('sc-light-green');
			$('#sc-cancel, #sc-trash').toggleClass('sc-hidden');
			$('#sc-page-settings').toggleClass('sc-hidden');
		} else { //Save Changes
			$scope.inEditMode = false;

			var content = $scope.page.content || {}, title = $scope.page.title || {};
			for(i in CKEDITOR.instances) {
				var storage = {};
				if(CKEDITOR.instances[i].name != "page-title") {
					storage[CKEDITOR.instances[i].name] = CKEDITOR.instances[i].getData();
					content = $.extend(content, storage);
				} else {
					title = CKEDITOR.instances[i].getData();
				}
			    CKEDITOR.instances[i].destroy();
			}

			// var tabTitle = $('#sc-browser-tab-title').value;
			// console.log($('#sc-browser-tab-title').value);

			// console.log(contentAreas, title);
			// $push: {content: contentAreas},
			CRUD.page.updateOne($location.url(), {title: title, content: content, tabTitle: tabTitle}, function(response) {
				console.log(response);
			});

			jQuery('.sc-editable').removeAttr('contenteditable');
			$('#sc-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('sc-light-green');
			$('#sc-cancel, #sc-trash').toggleClass('sc-hidden');
			$('#sc-page-settings').toggleClass('sc-hidden');
			// 
		}
	});

	// Reject Changes
	$('#sc-cancel').click(function(e){
		if($scope.inEditMode) {
			$scope.inEditMode = false;
			for(i in CKEDITOR.instances) {
				CKEDITOR.instances[i].setData(CKEDITOR.instances[i].firstSnapshot);
			    CKEDITOR.instances[i].destroy();
			}
			jQuery('.sc-editable').removeAttr('contenteditable');
			$('#sc-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('sc-light-green');
			$('#sc-cancel, #sc-trash').toggleClass('sc-hidden');
			$('#sc-page-settings').toggleClass('sc-hidden');
		}
	});

	// Reject Changes
	$('#sc-new-template li').click(function(e){
		console.log($(e.target).text());
		var template = {
	        "author": "jpm",
	        "editability": "Level 3",
	        "url": "page-template",
	        "tabTitle": "Page Template",
	        "template": $(e.target).text(),
	        "title": "Title",
	        "summary": "",
	        "description": "",
	        "visibility": "Level 3"
		};

		CRUD.page.create(template, function(response) {
			console.log(response);
			$location.url('/page-template');
		});
	});

	// Delete by Url
	$('#sc-trash').click(function(e){
		CRUD.page.deleteOne($location.url(), function(response) {
			console.log(response);
			$location.url('/');
		});
	});
}]);