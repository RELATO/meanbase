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

				jQuery('.mb-draggable').click(function(e) {
					jQuery('.mb-draggable').removeClass('mb-item-selected');
					jQuery(e.currentTarget).addClass('mb-item-selected');
				});
				
				jQuery('[data-menu]').append($compile('<li data-toggle="modal" data-target="#newMenuItemModal" ng-click="newMenuPosition($event)" class="mb-add-menu-item"><a href="#"> <i class="fa fa-plus fa-lg"></i></a></li><li data-toggle="modal" data-target="#editMenuItemModal" ng-click="selectedMenu()" class="mb-edit-menu-item"><a href="#"> <i class="fa fa-pencil fa-lg"></i></a></li>')($scope));

				jQuery('[data-menu] li').hover(function() {
					jQuery('.dropdown-menu').addClass('alwaysOpen');
				}, function() {
					jQuery('.dropdown-menu').removeClass('alwaysOpen');
				});

				jQuery('[data-menu]').each(function(index, value) {
					if(!$scope.menus[jQuery(value).data('menu')]) {
						jQuery(value).prepend('<li class="mb-draggable mb-placeholder-li"><a href="#">' + jQuery(value).data('menu') + ' placeholder</a></li>');
					}
				});

			} //startEditing()

			this.endEditing = function() {
				$scope.inEditMode = false;
				jQuery('.mb-editable').removeAttr('contenteditable');
				$('#mb-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('mb-light-green');
				$('#mb-cancel, #mb-trash').toggleClass('mb-hidden');
				jQuery('.dropdown-menu').removeClass('alwaysOpen');
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
				$('[data-menu] a[href!="#"]').each(function(i) {
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
					return 'themes/' + $scope.theme + '/templates/' + page.template;
				}
			});
		});

		theme.getMenus().then(function(menus) {
	    	$scope.menus = menus;
	  	});

		$scope.active = function(path) {
			return theme.isActive(path);
		};

		$scope.newMenuPosition = function($event) {
			$scope.currentLocation = jQuery($event.currentTarget).parents('[data-menu]').data('menu');
		};

		$scope.newMenuItem = function(newItemInfo) {
			console.log($scope.menus);
			if(newItemInfo) {
				if(!newItemInfo.url) {
					newItemInfo.url = "/";
				}
				if(!newItemInfo.title) {
					newItemInfo.title = "Home";
				}
				newItemInfo.location = $scope.currentLocation;

				if(!$scope.menus[$scope.currentLocation]) {
					newItemInfo.position = 0;
				} else {
					newItemInfo.position = $scope.menus[$scope.currentLocation].length
				}

				if(!$scope.menus[$scope.currentLocation]) {
					$scope.menus[newItemInfo.location] = [];
				}
				$scope.menus[newItemInfo.location][newItemInfo.position] = newItemInfo;
				CRUD.menu.create(newItemInfo, function(response) {
					console.log('Created New Menu Item', response);
				});
				jQuery('#newMenuItemModal').modal('hide');
			} else {
				console.log('Please set a url and title for the menu item.');
			}
		};

		$scope.selectedMenu = function(location) {
			var href = jQuery('.mb-item-selected').find('a').attr('href');
			var title = jQuery('.mb-item-selected').find('a').text();
			$scope.menuItem = {};
			$scope.menuItem.url = href;
			$scope.menuItem.title = title;
			$scope.menuItem.location = location;
		};

		$scope.editMenuItem = function(menuItem) {
			menuItem.location = jQuery('.mb-item-selected').parents('[data-menu]').data('menu');
			menuItem.position = jQuery('.mb-item-selected').index();
			CRUD.menu.update({location: menuItem.location}, menuItem, function(response) {
				console.log('Updated menu item', response);
			});
			$scope.menus[menuItem.location][menuItem.position] = menuItem;
			jQuery('#editMenuItemModal').modal('hide');
		};

		$scope.removeMenuItem = function() {
			var href = jQuery('.mb-item-selected').find('a').attr('href');
			var location = jQuery('.mb-item-selected').parents('[data-menu]').data('menu');
			var position = jQuery('.mb-item-selected').index();
			CRUD.menu.delete({url: href}, function(response) {
				console.log(response);
			});
			$scope.menus[location].splice(position);
			jQuery('#editMenuItemModal').modal('hide');
		};

		$scope.defaultTitle = "Heading";
		$scope.defaultText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, illo libero accusantium maxime nihil beatae sunt asperiores aut odio laboriosam incidunt, omnis, expedita ad consequuntur blanditiis, corporis necessitatibus ex numquam.";

	}]); //controller AppCtrl
})(jQuery);