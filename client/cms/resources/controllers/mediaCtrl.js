cms.controller('mediaCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'FileUploader', function($scope, $rootScope, $http, $location, CRUD, FileUploader) {
	CRUD.image.find({}, function(response) {
		if(!response.error) {
			$rootScope.images = response.response;
		}
	});

	$scope.deleteImage = function(image, index) {
        $rootScope.images.splice(index, 1);
		CRUD.image.delete({url: image.url}, function(response) {            
            console.log(response.response);
		});
	};

    $scope.deleteAll = function() {
        $rootScope.images = [];
        CRUD.image.delete({}, function(response) {            
            console.log(response.response);
        });
    };

    $scope.editMedia = function(image) {
        $scope.selectedImage = image;
    };
}]);


cms.controller('uploadCTRL', ['$scope', '$rootScope', 'FileUploader', 'CRUD', function($scope, $rootScope, FileUploader, CRUD) {
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
            var allImages;
            CRUD.image.find({}, function(response) {
                if(!response.error) {
                    allImages = response.response;
                    $rootScope.images = [];
                    $rootScope.images.push(allImages);
                    console.log($rootScope.images);
                }
            });
            console.log('Uploaded all images.');
        };
}]);