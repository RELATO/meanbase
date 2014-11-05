cms.controller('mediaCtrl', ['$scope', '$http', '$location', 'CRUD', 'FileUploader', function($scope, $http, $location, CRUD, FileUploader) {
	CRUD.image.find({}, function(response) {
		if(!response.error) {
			$scope.images = response.response;
			console.log($scope.images);
		}
	});

	console.log($scope.images);

	$scope.deleteImage = function(image, index) {
		CRUD.image.delete({url: image.url}, function(response) {
			console.log(response.response);
		});
	};
}]);


cms.controller('uploadCTRL', ['$scope', 'FileUploader', 'CRUD', function($scope, FileUploader, CRUD) {
        var uploader = $scope.uploader = new FileUploader({
            url: '/server/images'
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            },
            removeAfterUpload: true,
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {

        };
        uploader.onAfterAddingAll = function(addedFileItems) {

        };
        uploader.onBeforeUploadItem = function(item) {
        	
        };
        uploader.onProgressItem = function(fileItem, progress) {

        };
        uploader.onProgressAll = function(progress) {

        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {

        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {

        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {

        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
        	// console.log(fileItem._file.name);

        	// CRUD.image.create({url: fileItem._file.name}, function(response) {
        	// 	console.log(response);
        	// });
        };
        uploader.onCompleteAll = function() {
            console.log('completedAll');
        };

        console.info('uploader', uploader);
}]);