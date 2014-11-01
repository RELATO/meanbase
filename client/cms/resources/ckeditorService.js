app.service('ckeditorService', ['$location', 'CRUD', function($location, CRUD) {
	function inlineEditing() {
	  	this.editMode = function() {
			console.log('edit mode');
			// if($scope.inEditMode == false) {
			// 	$scope.inEditMode = true;
			// 	jQuery('.editable-text').attr('contenteditable', true);
			// 	CKEDITOR.inlineAll();
			// 	for(i in CKEDITOR.instances) {
			// 		CKEDITOR.instances[i].firstSnapshot = CKEDITOR.instances[i].getData();
			// 	}		
			// }
			// console.log('editMode');
		};

		this.saveChanges = function() {
			// $scope.inEditMode = false;
			
			console.log('save');

			// for(i in CKEDITOR.instances) {
			// 	var storageLocation = CKEDITOR.instances[i].name;
			// 	var savedData = CKEDITOR.instances[i].getData();
			// 	var tempObject = {};
			// 	tempObject[storageLocation] = savedData;
			// 	jQuery.extend($scope.siteData.pages[id], tempObject);
			// 	simpleCMSData.put($scope.siteData);
			//     CKEDITOR.instances[i].destroy();
			// }		
			// jQuery('.editable-text').removeAttr('contenteditable');
		};

		this.rejectChanges = function() {
			console.log('rejectChanges');
			// $scope.siteData.pages[0].widgets = widgetsBefore;
			// console.log($scope.siteData.pages[0].widgets);
			// $scope.inEditMode = false;
			// jQuery('.editable-text').removeClass('edit-mode');
			// jQuery('.editable-area .add-content').remove();
			// for(i in CKEDITOR.instances) {
			// 	CKEDITOR.instances[i].setData(CKEDITOR.instances[i].firstSnapshot);
			//     CKEDITOR.instances[i].destroy();
			// }
			// jQuery('.edit-escape').remove();
			// jQuery('.editable-text').removeAttr('contenteditable');
		};
	}
  return new inlineEditing();
}]);