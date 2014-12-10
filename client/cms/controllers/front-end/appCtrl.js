(function($){
	app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', '$compile', 'theme', '$timeout', function($scope, $rootScope, $http, $location, CRUD, ckeditorService, $compile, theme, $timeout) {

		$scope.inEditMode = false;

		var Edit = new function() {
			this.sortables = [];
			this.menusSnapshot = [];

			this.startEditing = function() {
				$scope.inEditMode = true;

				this.prepareMenusForEditing();
				CKEDITOR.inlineAll();	
				for(i in CKEDITOR.instances) {
					CKEDITOR.instances[i].firstSnapshot = CKEDITOR.instances[i].getData();
				}	
				// $('#mb-edit').children('a').toggleClass('fa-edit').toggleClass('fa-check-circle');
				$('#mb-edit').html('<button class="btn btn-success">Save</button>');
				$('#mb-cancel, #mb-trash, #mb-page-settings').toggleClass('hidden');
				
				jQuery('[data-menu]').append($compile('<li data-toggle="modal" data-target="#editMenuItemModal" ng-click="selectedMenu($event)" class="mb-edit-menu-item" class="mb-unsortable"><a href="#"> <i class="fa fa-pencil fa-lg"></i></a></li>')($scope));

				this.prepareDropdownMenu();

				jQuery('[data-menu]').each(function(index, value) {
					if(!$scope.menus[jQuery(value).data('menu')]) {
						jQuery(value).prepend('<li class="mb-draggable mb-placeholder-li"><a href="#">' + jQuery(value).data('menu') + ' placeholder</a></li>');
					}
				});

				$('.mb-draggable a.mb-editable').blur(function(e) {
				    Edit.saveMenuLabels(e);
				});

			} //startEditing()

			this.prepareMenusForEditing = function() {
				$('a').click(function(e) {
					if($scope.inEditMode) {
						e.preventDefault();
					}
				});	
				jQuery('.mb-editable').attr('contenteditable', true);
				jQuery('.mb-draggable').click(function(e) {
					jQuery('.mb-draggable').removeClass('mb-item-selected');
					jQuery(e.currentTarget).addClass('mb-item-selected');
				});
			};

			this.prepareDropdownMenu = function() {
				// jQuery('.mb-dropdown-menu').addClass('alwaysOpen');
				
				// jQuery('[data-menu]').children().hover(function() {
				// 	jQuery('.mb-dropdown-menu').addClass('alwaysOpen');
				// }, function() {
				// 	jQuery('.dropdown-menu').removeClass('alwaysOpen');
				// });
				// jQuery('.mb-dropdown-toggle').hover(function() {
				// 	jQuery('.mb-dropdown-menu').addClass('alwaysOpen');
				// }, function() {
				// 	jQuery('.dropdown-menu').removeClass('alwaysOpen');
				// });
			};

			this.reprepareMenus = function() {
				$timeout(function () {
				    Edit.prepareMenusForEditing();
					Edit.prepareDropdownMenu();
				});
			};

			this.discardMenuEdits = function() {
			  	$scope.menus = Edit.menusSnapshot;
			  	$scope.$apply();
			  	Edit.menusSnapshot = [];
			};

			this.endEditing = function() {
				$scope.inEditMode = false;
				jQuery('.mb-editable').removeAttr('contenteditable');
				jQuery('.mb-draggable').removeClass('mb-item-selected');
				$('#mb-edit').html('<a href="#">Edit</a>');
				$('#mb-cancel, #mb-trash, #mb-page-settings').toggleClass('hidden');
				jQuery('[data-menu] .dropdown-menu').removeClass('alwaysOpen');
				jQuery('.mb-add-menu-item, .mb-edit-menu-item').remove();
				jQuery(".mb-placeholder-li").remove();
			}

			this.updateMenuData = function() {
				for(var menu in $scope.menus) {
					if ($scope.menus.hasOwnProperty(menu)) {
						for(var menuItem in $scope.menus[menu]) {
							$scope.menus[menu][menuItem].location = menu;
							$scope.menus[menu][menuItem].position = menuItem;
						}
					}	
				}
			};

			this.canFire = true;

			this.startSortableMenus = function() {
				$scope.sortableMenus.disabled = false;
				$scope.$apply();
				console.log($scope.sortableMenus);
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
					tabTitle: $scope.page.tabTitle,
					url: $scope.page.url,
					description: $scope.page.description,
					visibility: $scope.page.visibility,
					editability: $scope.page.editability,
					updated: Date.now()
				}

				console.log('finalDocument', finalDocument);

				CRUD.page.update({url: $location.url()}, finalDocument, function(response) {
				});
			};

			this.saveMenuLabels = function(e) {
				var location = jQuery(e.currentTarget).parents('[data-menu]').data('menu');
				var position = jQuery('[data-menu="' + location + '"]').children('.mb-draggable').has('a[href!="#"]').index(jQuery(e.currentTarget).parent('.mb-draggable'));
				$scope.menus[location][position].title = jQuery(e.currentTarget).text();
			};

			this.createNewPage = function(e) {
				var url = prompt('url (no spaces)');
				if($scope.inEditMode) {
					Edit.shutdownCKEditor();
					Edit.shutdownMenuOrdering();
					Edit.endEditing();
					Edit.discardMenuEdits();
				}
				var demoTitle = url;
				if((url.charAt(0) == '/')) {
					demoTitle = url.substr(1);
				} else {
					url = '/' + url;
				}
				if(url != null) {
					var template = {
				        author: "jpm",
				        editability: "Level 3",
				        visibility: "Level 3",
				        url: url,
				        tabTitle: demoTitle,
				        template: $(e.currentTarget).text(),
				        title: demoTitle,
				        summary: "Summary of " + demoTitle + ".",
				        description: "The description that will show up on facebook feeds and google searches.",
				        updated: Date.now()
					};
					CRUD.page.create(template, function(reply) {
						if(reply.error) {
							console.log(reply.response);
						} else {
							console.log(reply.response);
							// window.location.href= template.url;
							if($location.url() != template.url) {
								$location.url(template.url);
							} else {
								window.location = template.url;
							}
							
							theme.getMenus().then(function(menus) {
						    	$scope.menus = menus;
						  	});
						}
					});
				}
			};

			this.shutdownCKEditor = function() {
				for(i in CKEDITOR.instances) {
					CKEDITOR.instances[i].setData(CKEDITOR.instances[i].firstSnapshot);
				    CKEDITOR.instances[i].destroy();
				}
			};

			this.shutdownMenuOrdering = function() {
				$scope.sortableMenus.disabled = true;
				$scope.$apply();
			};

			this.deletePage = function() {
				if(confirm('Are use sure you want to delete the page at ' + $location.url())) {
					CRUD.page.delete({url: $location.url()}, function(reply) {
						if(reply.error) {
							console.log(reply.response);
						} else {
							console.log(reply.response);
							var menu = jQuery('a[href="' + $location.url() + '"]')
							var location = menu.parent('[data-menu]').data('menu');
							var position = menu.parent('.mb-draggable').index();
							$scope.menus[location].splice(position, 1);
							$location.url('/');
						}
					});
				}
			}; //deletePage
		} //var Edit
		

		// Start editing or Save Edits
		$('#mb-edit').click(function(e){
			if($scope.inEditMode == false) {
				// Start Editing
				Edit.startEditing();
				Edit.startSortableMenus();
			} else { 
				// Save Edits
				Edit.saveCKEditorData();
				theme.setMenus($scope.menus);
				Edit.menusSnapshot = [];
				Edit.endEditing();
			}
		});

		// Reject Changes
		$('#mb-cancel').click(function(e){
			if($scope.inEditMode) {
				Edit.shutdownMenuOrdering();
				Edit.shutdownCKEditor();
				Edit.endEditing();	
				Edit.discardMenuEdits();
			}
		});
		
		// New page from template
		$('#mb-new-template li a').click(function(e){
			Edit.createNewPage(e);
		});

		// Delete by Url
		$('#mb-trash').click(function(e){
			Edit.deletePage();
			Edit.shutdownCKEditor();
			Edit.shutdownMenuOrdering();
			Edit.endEditing();
		});


		//Theme functions
		
		$scope.$on('$locationChangeStart', function() {
		    theme.getPage().then(function(page) {
				$rootScope.page = page;

				if($scope.serverData.templates[page.template]) {
					page.template = $scope.serverData.templates[page.template];
				}
				$scope.templateUrl = function() {
					return 'themes/' + $scope.serverData.theme + '/templates/' + page.template;
				}

				if(page.template == "blog") {
					theme.getAllPosts().then(function(posts) {
						console.log(posts);
						$scope.posts = posts;
					});
				}
			});
		});

		theme.getRoles().then(function(roles) {
			$scope.roles = roles;
		});

		theme.getMenus().then(function(menus) {
	    	$scope.menus = menus;
	    	angular.copy(menus, Edit.menusSnapshot);
	  	});


		$scope.active = function(path, classtoAdd) {
			return theme.isActive(path, classtoAdd);
		};

		$scope.selectedMenu = function($event) {
			jQuery('#editMenuItemModal').on('shown.bs.modal', function () {
			    $('#menu-url').focus();
			});
			var id = jQuery('.mb-item-selected').data('id');

			if(id) {
				$scope.currentMenuId = id;
				var found = theme.findMenuById($scope.menus, id).data;
				// Prepare found
				delete found['id'];
				delete found['_id'];
				// Set menuItem
				$scope.menuItem = found;
			} else {
				$scope.menuItem = {
					id: new Date().toString(),
					title: '',
					url: '',
					location: jQuery($event.currentTarget).parent('[data-menu]').data('menu'),
					position: jQuery($event.currentTarget).parent('[data-menu]').children('.mb-draggable').has('a[href!="#"]').length,
					classes: '',
					target: ''
				};
			}
		};

		$scope.newMenuItem = function() {
			if($scope.menuItem) {
				console.log('$scope.menuItem', $scope.menuItem);

				// Validate
				if(!$scope.menus[$scope.menuItem.location]) {
					$scope.menus[$scope.menuItem.location] = {};
				}
				if($scope.menuItem.url.substring(0, 4) != 'http' && $scope.menuItem.url.charAt(0) != '/') {
					$scope.menuItem.url = '/' + $scope.menuItem.url;
				}
				

				var menuLength = $scope.menus[$scope.menuItem.location].length;
				$scope.menuItem.position = menuLength;

				$scope.menus[$scope.menuItem.location][menuLength] = $scope.menuItem;

				$scope.menuItem = [];
				Edit.reprepareMenus();
			} else {
				console.log('Please set a url and title for the menu item.');
			}
		};

		$scope.editMenuItem = function() {
			$scope.menuItem.id = $scope.currentMenuId;
			$scope.menus[$scope.menuItem.location][$scope.menuItem.position] = $scope.menuItem;
			$scope.menuItem = [];
			Edit.reprepareMenus();
		};


		$scope.removeMenuItem = function() {
			$scope.menus[$scope.menuItem.location].splice($scope.menuItem.position, 1);
			$scope.menuItem = [];
			Edit.reprepareMenus();
		};

		$scope.sortableMenus = { 
			group: 'menus',
			ghostClass: "sortable-ghost",
			draggable: ".mb-draggable",
			animation: 250,
			// filter: ".mb-unsortable",
			onStart: function (e) { 
		    	// jQuery(sortableMenus[i]).addClass("mb-contents-moving");
		    	jQuery('.mb-dropdown-menu').addClass('alwaysOpen');
		    },
		    onSort: function (e) {
		        // jQuery(sortableMenus[i]).removeClass("mb-contents-moving");
		    },
		    onEnd: function(e) {
		    	// Edit.updateMenuPositions();
		    	Edit.updateMenuData();
		    	jQuery('.mb-dropdown-menu').removeClass('alwaysOpen');
		   		Edit.reprepareMenus();
			}
		};
		$scope.sortableMenus.disabled = true;

		$scope.defaultTitle = "Heading";
		$scope.defaultText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, illo libero accusantium maxime nihil beatae sunt asperiores aut odio laboriosam incidunt, omnis, expedita ad consequuntur blanditiis, corporis necessitatibus ex numquam.";

	}]); //controller AppCtrl
})(jQuery);