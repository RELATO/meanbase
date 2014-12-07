(function($){
	app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', '$compile', 'theme', '$timeout', function($scope, $rootScope, $http, $location, CRUD, ckeditorService, $compile, theme, $timeout) {

		$scope.inEditMode = false;

		var Edit = new function() {
			this.sortables = [];
			this.bodySnapshot;

			this.editedMenus = [];
			this.newMenus = [];
			this.newMenusId = [];
			this.deletedMenus = [];
			this.oldPositions = [];

			this.addingMenusComplete = $.Deferred();

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

				jQuery('[data-menu]').each(function(index, location) {
					jQuery(location).children('.mb-draggable').has('a[href!="#"]').each(function(index, value) {
						if(jQuery(value).data('position') === undefined) {
							jQuery(value).data('position', index);
							jQuery(value).data('location', jQuery(location).data('menu'));
							console.log(jQuery(value).text() + ' ' + jQuery(value).data('location') + ' ' + jQuery(value).data('position'));
						}
					});
				});
			};

			this.prepareDropdownMenu = function() {
				jQuery('[data-menu]').children().hover(function() {
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
					    	jQuery(sortableMenus[i]).addClass("mb-contents-moving");
					    },
					    onSort: function (e) {
					        jQuery(sortableMenus[i]).removeClass("mb-contents-moving");
					    }
					});
					i++;
				}
			};

			this.saveEditedMenus = function() {
				var i = 0;
				while(i < this.editedMenus.length) {
					console.log('editedMenus url', this.editedMenus[i].id);
					CRUD.menu.update({id: this.editedMenus[i].id}, this.editedMenus[i], function(response) {
						console.log('Updated menu item', response);
					});
					i++;
				}
			};

			this.deleteMenus = function() {
				var i = 0;
				while(i < this.deletedMenus.length) {
					var foundIndex = jQuery.inArray(this.deletedMenus[i], this.newMenusId);
					console.log('foundIndex', foundIndex);
					if(foundIndex !== -1) {
						this.newMenusId.splice(foundIndex, 1);
						this.newMenus.splice(foundIndex, 1);
						console.log('deleteMenus $scope.menus', $scope.menus);
						// $scope.menus.splice(foundIndex, 1);
					} else {
						CRUD.menu.delete({id: this.deletedMenus[i]}, function(response) {
							console.log(response);
						});
					}
					i++;
				}
			};

			this.saveNewMenus = function() {
				var newMenus = this.newMenus;
				if(newMenus.length > 0) {
					var i = 0;
					var delayI = 0;
					while(i < newMenus.length) {
						console.log('i, length', i, newMenus.length);
						CRUD.menu.create(newMenus[i], function(response) {
							console.log('Created menu item', response);
							console.log('delayI, length', delayI, newMenus.length);
							delayI++;
							if(delayI === newMenus.length) {
								console.log('delayI, length final', delayI, newMenus.length);
								Edit.addingMenusComplete.resolve(true);
							}
						});
						i++;
					}
				} else {
					Edit.addingMenusComplete.resolve(true);
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
				});
			};

			this.saveMenuOrdering = function() {
				jQuery('[data-menu]').each(function(index, currentMenu) {
					jQuery(currentMenu).children('.mb-draggable').each(function(index, currentLink) {
						var location = jQuery(currentLink).data('location');
						var position = jQuery(currentLink).data('position');
						var id = jQuery(currentLink).data('id');
						console.log('saveMenudate id', id);
						if(location && position !== undefined) {
							CRUD.menu.find({id: id}, function(response) {
								console.log('saveMenuDate found with id', response.response);
							});
							var newLocation = jQuery(currentLink).parent('[data-menu]').data('menu');
							var newPosition = jQuery(currentLink).index();

							// CRUD.menu.update({id: id}, {location: newLocation, position: newPosition}, function(response) {
							// 	console.log('update position and location', response.response);
							// });

							// If the menu position hasn't changed
							if(location != newLocation || position != newPosition) {
								CRUD.menu.update({id: id}, {location: newLocation, position: newPosition}, function(response) {
									console.log('update position and location', response.response);
								});
							}
						}
					}); //.mb-draggable each
				}); // [data-menu] each
			};

			this.saveMenuLabels = function() {
				$('[data-menu] a[href!="#"]').each(function(i) {
					var url = $(this).attr('href');
					var title = $(this).text();
					CRUD.menu.update({url: url}, {title: title}, function(response) {
					});
				});
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
				Edit.deleteMenus();
				Edit.saveMenuLabels();
				Edit.saveNewMenus();
				Edit.saveEditedMenus();
				Edit.addingMenusComplete.then(function(finished) {
					console.log('resolved and savingMenuOrdering');
					Edit.saveMenuOrdering();
				});	
				$scope.foundInNew = undefined;
				Edit.newMenusId = [];
				Edit.editedMenus = [];
			  	Edit.newMenus = [];
			  	Edit.deletedMenus = [];
				Edit.endEditing();
			}
		});

		// Reject Changes
		$('#mb-cancel').click(function(e){
			if($scope.inEditMode) {
				Edit.shutdownCKEditor();
				Edit.shutdownMenuOrdering();
				Edit.newMenusId = [];
				Edit.editedMenus = [];
			  	Edit.newMenus = [];
			  	Edit.deletedMenus = [];
				Edit.endEditing();
				Edit.discardMenuEdits();
				$scope.foundInNew = undefined;
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
	  	});


		$scope.active = function(path, classtoAdd) {
			return theme.isActive(path, classtoAdd);
		};

		$scope.selectedMenu = function($event) {
			jQuery('#editMenuItemModal').on('shown.bs.modal', function () {
			    $('#menu-url').focus();
			});
			var id = jQuery('.mb-item-selected').data('id');
			$scope.currentMenuId = id;

			var foundIndex = jQuery.inArray(id, Edit.newMenusId);

			if(id) {
				if(foundIndex !== -1) {
					$scope.menuItem = Edit.newMenus[foundIndex];
					$scope.foundInNew = foundIndex;
				} else {
					$scope.foundInNew = undefined;
					CRUD.menu.find({id: id}, function(response) {
						delete response.response[0]['id'];
						delete response.response[0]['_id'];
						response.response[0]['position'] = jQuery('.mb-item-selected').index();
						$scope.menuItem = response.response[0];
						console.log('$scope.menuItem', $scope.menuItem);
					});	
				}
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
				if(!$scope.menus[$scope.menuItem.location]) {
					$scope.menus[$scope.menuItem.location] = {};
				}
				if($scope.menuItem.url.substring(0, 4) != 'http' && $scope.menuItem.url.charAt(0) != '/') {
					$scope.menuItem.url = '/' + $scope.menuItem.url;
				}
				// jQuery('[data-menu="' + $scope.menuItem.location + '"').children(".mb-placeholder-li").remove();
				var length = $scope.menus[$scope.menuItem.location].length;
				$scope.menuItem.position = length;
				$scope.menus[$scope.menuItem.location][length] = $scope.menuItem;
				Edit.newMenus.push($scope.menuItem);
				Edit.newMenusId.push($scope.menuItem.id);
				$scope.menuItem = [];
				Edit.reprepareMenus();
				jQuery('#editMenuItemModal').modal('hide');
			} else {
				console.log('Please set a url and title for the menu item.');
			}
		};

		$scope.editMenuItem = function(menuItem) {
			$scope.menuItem.id = $scope.currentMenuId;
			Edit.editedMenus.push($scope.menuItem);
			$scope.menus[$scope.menuItem.location][$scope.menuItem.position] = $scope.menuItem;
			$scope.menuItem = [];
			Edit.reprepareMenus();
			jQuery('#editMenuItemModal').modal('hide');
		};


		$scope.removeMenuItem = function() {
			if($scope.foundInNew != undefined) {
				Edit.newMenusId.splice($scope.foundInNew, 1);
				Edit.newMenus.splice($scope.foundInNew, 1);
			} else {
				Edit.deletedMenus.push($scope.currentMenuId);
			}
			$scope.menus[$scope.menuItem.location].splice($scope.menuItem.position, 1);
			jQuery('#editMenuItemModal').modal('hide');
		};

		$scope.defaultTitle = "Heading";
		$scope.defaultText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, illo libero accusantium maxime nihil beatae sunt asperiores aut odio laboriosam incidunt, omnis, expedita ad consequuntur blanditiis, corporis necessitatibus ex numquam.";

	}]); //controller AppCtrl
})(jQuery);