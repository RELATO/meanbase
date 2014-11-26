var fileBrowser = angular.module('fileBrowser', ['crudApp', 'angularFileUpload']);

fileBrowser.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]);

fileBrowser.controller('fileBrowserCtrl', ['$scope', '$http', '$location', 'CRUD', 'FileUploader', function($scope, $http, $location, CRUD, FileUploader) {

	CRUD.image.find({}, function(response) {
		if(!response.error) {
			$scope.images = response.response;
            console.log($scope.images);
		}
	});

	$scope.choose = function(image) {
		// var fileUrl = 'images/' + image.url;
		var fileUrl = image.url;
		window.opener.CKEDITOR.tools.callFunction($location.search().CKEditorFuncNum, fileUrl, function() {
			// Get the reference to a dialog window.
			var element, dialog = this.getDialog();
			// Check if this is the Image dialog window.
			if (dialog.getName() == 'image') {
				// Get the reference to a text field that holds the "alt" attribute.
				element = dialog.getContentElement( 'info', 'txtAlt' );
			// Assign the new value.
			if ( element )
				if(image.alt) {
					element.setValue(image.alt);
				}
			}
		});
		window.top.close() ;
		window.top.opener.focus() ;
	};
}]);