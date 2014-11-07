(function($){
app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', function($scope, $rootScope, $http, $location, CRUD, ckeditorService) {

	$scope.inEditMode = false;

	var Edit = new function() {
		this.sortMenu;
		this.origionalMenuOrder;
		this.newMenuOrder;

		this.startEditing = function() {
			$scope.inEditMode = true;
			$('a').click(function(e) {
				if($scope.inEditMode) {
					e.preventDefault();
				}
			});
			jQuery('.mb-editable').attr('contenteditable', true);
			CKEDITOR.inlineAll();
			for(i in CKEDITOR.instances) {
				CKEDITOR.instances[i].firstSnapshot = CKEDITOR.instances[i].getData();
			}	
			$('#mb-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('mb-light-green');
			$('#mb-cancel, #mb-trash').toggleClass('mb-hidden');

			$('a.mb-main-list-a').each(function(i) {
				$(this).data('old-text', $(this).text());
			});
		}

		this.endEditing = function() {
			$scope.inEditMode = false;
			jQuery('.mb-editable').removeAttr('contenteditable');
			$('#mb-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('mb-light-green');
			$('#mb-cancel, #mb-trash').toggleClass('mb-hidden');
		}

		this.startSortableMenus = function() {
			var el = document.getElementById('sortable-head');
			this.sortMenu = new Sortable(el, {
			    group: "header",
			    ghostClass: "sortable-ghost",
			    animation: 150,
			    store: {
			    	get: function (sortable) {
			            Edit.origionalMenuOrder = sortable.toArray();
			            return Edit.origionalMenuOrder;
			        },
			        set: function (sortable) {
			            Edit.newMenuOrder = sortable.toArray();
			        }
			    },
			    draggable: "li",
			    onStart: function (e) { 
			    	jQuery('#sortable-head').addClass("mb-contents-moving");
			    },
			    onUpdate: function (e){
			        jQuery('#sortable-head').removeClass("mb-contents-moving");
			    }
			});
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

		this.rejectCKEditorData = function() {
			for(i in CKEDITOR.instances) {
				CKEDITOR.instances[i].setData(CKEDITOR.instances[i].firstSnapshot);
			    CKEDITOR.instances[i].destroy();
			}
		};

		this.saveMenuOrdering = function() {
			var i = 0;
			while(i < Edit.sortMenu.el.children.length) {
				// jQuery(Edit.sortMenu.el.children[i]).data('id', i);
				var currentElementUrl = jQuery(Edit.sortMenu.el.children[i]).children('a').attr('href');
				// console.log(jQuery(Edit.sortMenu.el.children[i]).data('id'));
				CRUD.menu.update({url: currentElementUrl}, {position: i}, function(response) {
					console.log(response.response);
				});
				i++;
			}
		};

		this.rejectMenuOrdering = function() {
			this.sortMenu.sort(this.origionalMenuOrder);
			this.sortMenu.destroy();
		};

		this.saveMenuLabels = function() {
			$('a.mb-main-list-a').each(function(i) {
				var url = $(this).attr('href');
				var title = $(this).text();
				CRUD.menu.update({url: url}, {title: title}, function(response) {
					console.log(response.response);
				});
			});
		};

		this.rejectMenuLabels = function() {
			$('a.mb-main-list-a').each(function(i) {
				$(this).text($(this).data('old-text'));
			});
		};

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
			Edit.rejectCKEditorData();
			Edit.rejectMenuOrdering();
			Edit.rejectMenuLabels();
			Edit.endEditing();
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