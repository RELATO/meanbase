(function($){
	app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', '$compile', 'theme', '$timeout', function($scope, $rootScope, $http, $location, CRUD, ckeditorService, $compile, theme, $timeout) {

		$scope.inEditMode = false;

		var Edit = new function() {
			this.sortables = [];
			this.bodySnapshot;

			this.editedMenus = [];
			this.newMenus = [];
			this.deletedMenus = [];

			this.startEditing = function() {
				$scope.inEditMode = true;
				this.bodySnapshot = document.body.innerHTML;

				this.prepareMenusForEditing();
				CKEDITOR.inlineAll();	
				// $('#mb-edit').children('a').toggleClass('fa-edit').toggleClass('fa-check-circle');
				$('#mb-edit').html('<button class="btn btn-success">Save</button>');
				$('#mb-cancel, #mb-trash, #mb-page-settings').toggleClass('hidden');
				
				jQuery('[data-menu]').append($compile('<li data-toggle="modal" data-target="#editMenuItemModal" ng-click="selectedMenu($event)" class="mb-edit-menu-item"><a href="#"> <i class="fa fa-pencil fa-lg"></i></a></li>')($scope));

				this.prepareDropdownMenu();

				jQuery('[data-menu]').each(function(index, value) {
					if(!$scope.menus[jQuery(value).data('menu')]) {
						jQuery(value).prepend('<li class="mb-draggable mb-placeholder-li"><a href="#">' + jQuery(value).data('menu') + ' placeholder</a></li>');
					}
				});

			} //startEditing()

			this.prepareMenusForEditing = function() {
				console.log('prepareMenusforEditing');
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
				jQuery('[data-menu] li').hover(function() {
					jQuery('[data-menu] .dropdown-menu').addClass('alwaysOpen');
				}, function() {
					jQuery('.dropdown-menu').removeClass('alwaysOpen');
				});
			};

			this.reprepareMenus = function() {
				$timeout(function () {
				    Edit.prepareMenusForEditing();
					Edit.prepareDropdownMenu();
				});
			};

			this.discardMenuEdits = function() {
				theme.getMenus().then(function(menus) {
			    	$scope.menus = menus;
			  	});
			  	this.editedMenus = [];
			  	this.newMenus = [];
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
					    	// jQuery('.dropdown-menu').dropdown('toggle');
					    	jQuery(sortableMenus[i]).addClass("mb-contents-moving");
					    },
					    onSort: function (e) {
					        jQuery(sortableMenus[i]).removeClass("mb-contents-moving");
					    },
					});
					i++;
				}
			};

			this.saveEditedMenus = function() {
				console.log('editedMenus id', this.editedMenus);
				var i = 0;
				while(i < this.editedMenus.length) {
					console.log('editedMenus url', this.editedMenus[i]._id);
					CRUD.menu.update({_id: this.editedMenus[i]._id}, this.editedMenus[i], function(response) {
						console.log('Updated menu item', response);
					});
					i++;
				}
			};

			this.deleteMenus = function() {
				var i = 0;
				while(i < this.deletedMenus.length) {
					CRUD.menu.delete({url: this.deletedMenus[i]}, function(response) {
						console.log(response);
					});
					i++;
				}
			};

			this.saveNewMenus = function() {
				console.log('newMenus', this.newMenus);
				var i = 0;
				while(i < this.newMenus.length) {
					CRUD.menu.create(this.newMenus[i], function(response) {
						console.log('Created menu item', response);
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
					tabTitle: $scope.page.tabTitle,
					url: $scope.page.url,
					description: $scope.page.description,
					visibility: $scope.page.visibility,
					editability: $scope.page.editability,
					updated: Date.now()
				}

				console.log('finalDocument', finalDocument);

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
				$('[data-menu] a[href!="#"]').each(function(i) {
					var url = $(this).attr('href');
					var title = $(this).text();
					CRUD.menu.update({url: url}, {title: title}, function(response) {
						console.log(response.response);
					});
				});
			};

			this.createNewPage = function(e) {
				var url = prompt('url (include "/" at beginning)');
				if(url != null) {
					var template = {
				        author: "jpm",
				        editability: "Level 3",
				        url: url,
				        tabTitle: "Google Search Title",
				        template: $(e.currentTarget).text(),
				        title: $(e.currentTarget).text() + " Title",
				        summary: "Summary of page.",
				        description: "The description that will show up on facebook feeds and google searches.",
				        updated: Date.now()
					};
					CRUD.page.create(template, function(reply) {
						if(reply.error) {
							console.log(reply.response);
						} else {
							console.log(reply.response);
							// window.location.href= template.url;
							$location.url(template.url);
							theme.getMenus().then(function(menus) {
						    	$scope.menus = menus;
						    	Edit.reprepareMenus();
						  	});
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
							var menu = jQuery('a[href="' + $location.url() + '"]')
							var location = menu.parents('[data-menu]').data('menu');
							var position = menu.parents('li').index();
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
				Edit.saveMenuOrdering();
				Edit.saveMenuLabels();
				Edit.saveNewMenus();
				Edit.saveEditedMenus();
				Edit.deleteMenus();
				this.editedMenus = [];
			  	this.newMenus = [];
			  	this.deletedMenus = [];
				Edit.endEditing();
			}
		});

		// Reject Changes
		$('#mb-cancel').click(function(e){
			if($scope.inEditMode) {
				Edit.shutdownCKEditor();
				Edit.shutdownMenuOrdering();
				Edit.endEditing();
				Edit.discardMenuEdits();
				document.body.innerHTML = Edit.bodySnapshot;
				$compile(document.body)($scope);
				
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
				$scope.page = page;

				if($scope.serverData.templates[page.template]) {
					page.template = $scope.serverData.templates[page.template];
				}
				$scope.templateUrl = function() {
					return 'themes/' + $scope.serverData.theme + '/templates/' + page.template;
				}
			});
		});

		theme.getRoles().then(function(roles) {
			$scope.roles = roles;
		});

		theme.getMenus().then(function(menus) {
	    	$scope.menus = menus;
	  	});

		$scope.active = function(path, classtoAdd) {
			return theme.isActive(path, classtoAdd);
		};

		$scope.newMenuItem = function(menuItem) {
			if(menuItem) {
				if(!menuItem.url) {
					menuItem.url = "/";
				}
				if(!menuItem.title) {
					menuItem.title = "Home";
				}
				menuItem.location = $scope.currentLocation;

				if(!$scope.menus[$scope.currentLocation]) {
					menuItem.position = 0;
				} else {
					menuItem.position = $scope.menus[$scope.currentLocation].length
				}

				if(!$scope.menus[$scope.currentLocation]) {
					$scope.menus[menuItem.location] = [];
				}

				if(!$scope.menus[menuItem.target]) {
					$scope.menus[menuItem.target] = '';
				}

				$scope.menus[menuItem.location][menuItem.position] = menuItem;
				Edit.newMenus.push(menuItem);
				Edit.reprepareMenus();
				jQuery('#editMenuItemModal').modal('hide');
			} else {
				console.log('Please set a url and title for the menu item.');
			}
		};

		$scope.selectedMenu = function($event) {
			var url = jQuery('.mb-item-selected').find('a').attr('href');
			CRUD.menu.find({url: url}, function(response) {
				$scope.currentMenuId = response.response[0]['_id'];
				delete response.response[0]['_id'];
				$scope.menuItem = response.response[0];
			});
			$scope.currentLocation = jQuery($event.currentTarget).parents('[data-menu]').data('menu');
		};

		$scope.editMenuItem = function(menuItem) {
			menuItem.location = jQuery('.mb-item-selected').parents('[data-menu]').data('menu');
			menuItem.position = jQuery('.mb-item-selected').index();
			menuItem._id = $scope.currentMenuId;
			console.log(menuItem);
			Edit.editedMenus.push(menuItem);
			$scope.menus[menuItem.location][menuItem.position] = menuItem;
			Edit.reprepareMenus();
			jQuery('#editMenuItemModal').modal('hide');
		};


		$scope.removeMenuItem = function() {
			var href = jQuery('.mb-item-selected').find('a').attr('href');
			var location = jQuery('.mb-item-selected').parents('[data-menu]').data('menu');
			var position = jQuery('.mb-item-selected').index();
			Edit.deletedMenus.push(href);
			$scope.menus[location].splice(position, 1);
			jQuery('#editMenuItemModal').modal('hide');
		};

		$scope.defaultTitle = "Heading";
		$scope.defaultText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, illo libero accusantium maxime nihil beatae sunt asperiores aut odio laboriosam incidunt, omnis, expedita ad consequuntur blanditiis, corporis necessitatibus ex numquam.";

	}]); //controller AppCtrl
})(jQuery);