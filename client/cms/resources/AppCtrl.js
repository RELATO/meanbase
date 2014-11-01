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

			var finalDocument = {
				title: title,
				content: content,
				tabTitle: document.getElementById('sc-browser-tab-title').value,
				url: document.getElementById('sc-url-link-title').value,
				description: document.getElementById('sc-page-description').value
			}

			CRUD.page.updateOne($location.url(), finalDocument, function(response) {
				console.log(response);
			});

			jQuery('.sc-editable').removeAttr('contenteditable');
			$('#sc-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('sc-light-green');
			$('#sc-cancel, #sc-trash').toggleClass('sc-hidden');
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
		}
	});

	// Reject Changes
	$('#sc-new-template li').click(function(e){
		var url = prompt('url (without beginning slash) Ex: about');
		var template = {
	        "author": "jpm",
	        "editability": "Level 3",
	        "url": url,
	        "tabTitle": url,
	        "template": $(e.target).text(),
	        "title": url + " Title",
	        "summary": url,
	        "description": url,
	        "visibility": "Level 3"
		};

		CRUD.page.create(template, function(response) {
			console.log(response);
			$location.url('/' + template.url);
		});
	});

	// Delete by Url
	$('#sc-trash').click(function(e){
		if(confirm('Are use sure you want to delete the page at ' + $location.url())) {
			CRUD.page.deleteOne($location.url(), function(response) {
				$location.url('/');
				$('#sc-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('sc-light-green');
				$('#sc-cancel, #sc-trash').toggleClass('sc-hidden');
				$scope.inEditMode = false;
			});
		}
	});
}]);