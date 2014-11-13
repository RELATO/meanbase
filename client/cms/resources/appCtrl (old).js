(function($){
app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', '$compile', function($scope, $rootScope, $http, $location, CRUD, ckeditorService, $compile) {

	$scope.inEditMode = false;

	var Edit = new function() {
		this.sortables = [];
		this.origionalMenuOrder = {};
		this.menuSnapshot = {};
		this.bodySnapshot;

		this.startEditing = function() {
			$scope.inEditMode = true;
			this.bodySnapshot = jQuery('#mb-spa').html();
			$('a').click(function(e) {
				if($scope.inEditMode) {
					e.preventDefault();
				}
			});
			jQuery('.mb-editable').attr('contenteditable', true);
			CKEDITOR.inlineAll();
			// for(i in CKEDITOR.instances) {
			// 	CKEDITOR.instances[i].firstSnapshot = CKEDITOR.instances[i].getData();
			// }	
			$('#mb-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('mb-light-green');
			$('#mb-cancel, #mb-trash').toggleClass('mb-hidden');

			// $('a.mb-main-list-a').each(function(i) {
			// 	$(this).data('old-text', $(this).text());
			// });
		}

		this.endEditing = function() {
			$scope.inEditMode = false;
			jQuery('.mb-editable').removeAttr('contenteditable');
			$('#mb-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('mb-light-green');
			$('#mb-cancel, #mb-trash').toggleClass('mb-hidden');
		}

		this.startSortableMenus = function() {
			var sortableMenus = document.querySelectorAll('[data-menu]');
			var i = 0;
			while(i < sortableMenus.length) {
				// var menuName = sortableMenus[i].getAttribute("data-menu");
				this.sortables[i] = new Sortable(sortableMenus[i], {
				    group: 'menus',
				    ghostClass: "sortable-ghost",
				    draggable: ".mb-draggable",
				    animation: 250,
				    onStart: function (e) { 
				    	jQuery('.dropdown-menu').dropdown('toggle');
				    	jQuery(sortableMenus[i]).addClass("mb-contents-moving");
				    },
				    onUpdate: function (e) {
				    	jQuery('.dropdown-menu').dropdown('toggle');
				        jQuery(sortableMenus[i]).removeClass("mb-contents-moving");
				    }
				});
				i++;
			}
		};

		this.saveCKEditorData = function() {
			//Save Edits
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
				tabTitle: document.getElementById('mb-browser-tab-title').value,
				url: document.getElementById('mb-url-link-title').value,
				description: document.getElementById('mb-page-description').value
			}

			CRUD.page.update({url: $location.url()}, finalDocument, function(response) {
				console.log(response.response);
			});
		};

		// this.rejectCKEditorData = function() {
		// 	for(i in CKEDITOR.instances) {
		// 		CKEDITOR.instances[i].setData(CKEDITOR.instances[i].firstSnapshot);
		// 	    CKEDITOR.instances[i].destroy();
		// 	}
		// };

		this.saveMenuOrdering = function() {
			jQuery('[data-menu]').each(function(index, currentMenu) {
				jQuery(currentMenu).children('.mb-draggable').each(function(index, currentLink) {
					var url = jQuery(currentLink).children('a').attr('href');
					var location = jQuery(currentMenu).data('menu');
					CRUD.menu.update({url: url}, {position: index, location: location}, function(response) {
						console.log(response.response);
					});
				});
			});
		};

		// this.rejectMenuOrdering = function() {
		// 	var i = 0;
		// 	console.log('Edit.origionalMenuOrder', Edit.origionalMenuOrder);
		// 	while(i < this.sortables.length) {
		// 		console.log("Edit.origionalMenuOrder[menu" + i + "]", Edit.origionalMenuOrder['menu'+i]);
		// 		this.sortables[i].sort(Edit.origionalMenuOrder['menu'+i]);
		// 		this.sortables[i].destroy();
		// 		i++;
		// 	}
		// 	this.origionalMenuOrder = {};
		// };

		this.saveMenuLabels = function() {
			$('a.mb-main-list-a').each(function(i) {
				var url = $(this).attr('href');
				var title = $(this).text();
				CRUD.menu.update({url: url}, {title: title}, function(response) {
					console.log(response.response);
				});
			});
		};

		// this.rejectMenuLabels = function() {
		// 	$('a.mb-main-list-a').each(function(i) {
		// 		$(this).text($(this).data('old-text'));
		// 	});
		// };

		this.createNewPage = function(e) {
			var url = prompt('url');
			if(url != null) {
				var template = {
			        author: "jpm",
			        editability: "Level 3",
			        url: url,
			        tabTitle: url,
			        template: $(e.target).text(),
			        title: url + " Title",
			        summary: url,
			        description: url,
			        visibility: "Level 3"
				};
				CRUD.page.create(template, function(reply) {
					if(reply.error) {
						console.log(reply.response);
					} else {
						console.log(reply.response);
						window.location.href= template.url;
						// $location.url('/' + template.url);
					}
				});
			}
		};

		this.deletePage = function() {
			if(confirm('Are use sure you want to delete the page at ' + $location.url())) {
			CRUD.page.delete({url: $location.url()}, function(reply) {
				if(reply.error) {
					console.log(reply.response);
				} else {
					console.log(reply.response);
					$location.url('/');
					this.endEditing();
				}
			});
		}
		};
	} 
	

	// Start editing or Save Edits
	$('#mb-editMode').click(function(e){
		if($scope.inEditMode == false) {
			// Start Editing
			Edit.startEditing();
			Edit.startSortableMenus();
		} else { 
			// Save Edits
			Edit.saveCKEditorData();
			Edit.saveMenuOrdering();
			Edit.saveMenuLabels();
			Edit.endEditing();
		}
	});

	// Reject Changes
	$('#mb-cancel').click(function(e){
		if($scope.inEditMode) {
			// Edit.rejectCKEditorData();
			// Edit.rejectMenuOrdering();
			// Edit.rejectMenuLabels();
			for(i in CKEDITOR.instances) {
			    CKEDITOR.instances[i].destroy();
			}
			for(i in Edit.sortables.length) {
				Edit.sortables[i].destroy();
			}
			Edit.endEditing();
			jQuery('#mb-spa').html(Edit.bodySnapshot);
			$compile(jQuery('#mb-spa'))($scope);
			
		}
	});
	
	// New page from template
	$('#mb-new-template li').click(function(e){
		Edit.createNewPage(e);
		$('.mb-dropdown, .mb-dropdown-right').addClass('mb-hidden');
	});

	// Delete by Url
	$('#mb-trash').click(function(e){
		Edit.deletePage();
	});
}]);
})(jQuery);