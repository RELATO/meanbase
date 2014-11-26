(function($){
	app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', '$compile', 'theme', function($scope, $rootScope, $http, $location, CRUD, ckeditorService, $compile, theme) {

		$scope.inEditMode = false;

		var Edit = new function() {
			this.sortables = [];
			this.bodySnapshot;

			this.startEditing = function() {
				$scope.inEditMode = true;
				this.bodySnapshot = document.body.innerHTML;
				$('a').click(function(e) {
					if($scope.inEditMode) {
						e.preventDefault();
					}
				});
				jQuery('.mb-editable').attr('contenteditable', true);
				CKEDITOR.inlineAll();	
				$('#mb-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('mb-light-green');
				$('#mb-cancel, #mb-trash').toggleClass('mb-hidden');
			}

			this.endEditing = function() {
				$scope.inEditMode = false;
				jQuery('.mb-editable').removeAttr('contenteditable');
				$('#mb-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('mb-light-green');
				$('#mb-cancel, #mb-trash').toggleClass('mb-hidden');
				jQuery('.dropdown-menu').dropdown('toggle');
			}

			this.startSortableMenus = function() {
				var sortableMenus = document.querySelectorAll('[data-menu]');
				var i = 0;
				while(i < sortableMenus.length) {
					this.sortables[i] = new Sortable(sortableMenus[i], {
					    group: 'menus',
					    ghostClass: "sortable-ghost",
					    draggable: ".mb-draggable",
					    animation: 250,
					    onStart: function (e) { 
					    	jQuery('.dropdown-menu').dropdown('toggle');
					    	jQuery(sortableMenus[i]).addClass("mb-contents-moving");
					    },
					    onSort: function (e) {
					        jQuery(sortableMenus[i]).removeClass("mb-contents-moving");
					    },
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

			this.saveMenuLabels = function() {
				$('a.mb-main-list-a').each(function(i) {
					var url = $(this).attr('href');
					var title = $(this).text();
					CRUD.menu.update({url: url}, {title: title}, function(response) {
						console.log(response.response);
					});
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

			this.shutdownCKEditor = function() {
				for(i in CKEDITOR.instances) {
				    CKEDITOR.instances[i].destroy();
				}
			};

			this.shutdownMenuOrdering = function() {
				for(i in this.sortables.length) {
					this.sortables[i].destroy();
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
			}; //deletePage
		} //var Edit
		

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
				Edit.shutdownCKEditor();
				Edit.shutdownMenuOrdering();
				Edit.endEditing();
				document.body.innerHTML = Edit.bodySnapshot;
				$compile(document.body)($scope);
				
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


		//Theme functions
		
		$scope.$on('$locationChangeStart', function() {
		    theme.getPage().then(function(page) {
				$scope.page = page;
				$scope.templateUrl = function() {
					return 'themes/Default/templates/' + $scope.page.template;
				}
			});
		});

		theme.getMenus().then(function(menus) {
	    	$scope.menus = menus;
	  	});

		$scope.active = function(path) {
			return theme.isActive(path);
		};

		$scope.defaultTitle = "Heading";
		$scope.defaultText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, illo libero accusantium maxime nihil beatae sunt asperiores aut odio laboriosam incidunt, omnis, expedita ad consequuntur blanditiis, corporis necessitatibus ex numquam.";

	}]); //controller AppCtrl
})(jQuery);