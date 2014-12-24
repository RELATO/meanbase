(function($){
	app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', '$compile', 'theme', '$timeout', function($scope, $rootScope, $http, $location, CRUD, ckeditorService, $compile, theme, $timeout) {

		$scope.editMode = false;

		var Edit = new function() {
			this.menusSnapshot = [];

			this.startEditing = function() {
				$scope.editMode = true;

				angular.copy($scope.menus, Edit.menusSnapshot);

				jQuery('.mb-editable').attr('contenteditable', true);
				CKEDITOR.inlineAll();	
				for(i in CKEDITOR.instances) {
					CKEDITOR.instances[i].firstSnapshot = CKEDITOR.instances[i].getData();
				}	

				jQuery('[data-menu]').append($compile('<li data-toggle="modal" data-target="#editMenuItemModal" ng-click="mb.selectedMenu($event)" class="mb-edit-menu-item"><a href="#"> <i class="fa fa-pencil fa-lg"></i></a></li>')($scope));

				this.prepareDropdownMenu();

				this.checkPlaceholderMenu();
			} //startEditing()

			this.prepareDropdownMenu = function() {
				jQuery('[data-menu], .mb-dropdown-toggle').hover(function() {
					if($scope.editMode) {
						jQuery('.mb-dropdown-menu').addClass('alwaysOpen');
					}
				}, function() {
					jQuery('.dropdown-menu').removeClass('alwaysOpen');
				});
			};

			this.checkPlaceholderMenu = function() {
				jQuery('[data-menu]').each(function(index, value) {

					if(!$scope.menus[jQuery(value).data('menu')]) {
						$scope.menus[jQuery(value).data('menu')] = [];
					}

					if($scope.menus[jQuery(value).data('menu')].length !== 0) {
						jQuery(value).children('.mb-placeholder-li').remove();
					} else {

						if(jQuery(value).children('.mb-placeholder-li').length == 0) {
							jQuery(value).prepend($compile('<li class="mb-draggable ignore-draggable mb-placeholder-li"><a href="#">' + jQuery(value).data('menu') + ' placeholder</a></li>')($scope));
						}
						
					}
				});
			};

			this.reprepareMenus = function() {
				$timeout(function () {
					Edit.prepareDropdownMenu();
				});
			};

			this.discardMenuEdits = function() {
			  	$scope.menus = Edit.menusSnapshot;
			  	Edit.menusSnapshot = [];
			};

			this.endEditing = function() {
				$scope.editMode = false;
				jQuery('.mb-editable').removeAttr('contenteditable');
				jQuery('.mb-draggable').removeClass('mb-item-selected');
				jQuery('[data-menu] .dropdown-menu').removeClass('alwaysOpen');
				jQuery('.mb-edit-menu-item').remove();
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
				$scope.mb.sortableMenus.disabled = false;
				console.log($scope.mb.sortableMenus);
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

			this.createNewPage = function(e) {
				var url = prompt('url (no spaces)');
				if($scope.editMode) {
					Edit.shutdownCKEditor();
					Edit.shutdownMenuOrdering();
					Edit.endEditing();
					Edit.discardMenuEdits();
				}
				url = url.replace(/[ ]/g, "-");
				var menuTitle = url.replace(/[_-]/g, " ");
				demoTitle = menuTitle.replace(/(^| )(\w)/g, function(x) {
					return x.toUpperCase();
				});
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
							var newMenu = {
								id: new Date().toString(),
								title: menuTitle,
								url: url,
								location: 'main',
								position: $scope.menus.main.length,
								classes: '',
								target: ''
							};
							
							$scope.menus.main.push(newMenu);
							theme.setMenus($scope.menus);
							if($location.url() != template.url) {
								$location.url(template.url);
							} else {
								window.location = template.url;
							}
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
				$scope.mb.sortableMenus.disabled = true;
			};

			this.deletePage = function() {
				if(confirm('Are use sure you want to delete the page at ' + $location.url())) {
					CRUD.page.delete({url: $location.url()}, function(reply) {
						if(reply.error) {
							console.log(reply.response);
						} else {
							console.log(reply.response);
							var menu = jQuery('a[href="' + $location.url() + '"]');
							var location = menu.parents('[data-menu]').data('menu');
							var position = menu.parents('.mb-draggable').index();
							if($location.url() != '/') {
								$location.url('/');
							} else {
								window.location = '/';
							}
							$scope.menus[location].splice(position, 1);
							console.log($scope.menus[location]);
						}
					});
				}
			}; //deletePage
		} //var Edit


		$scope.mb = {};

		$scope.mb.beginEditing = function() {
			if($scope.editMode == false) {
				Edit.startEditing();
				Edit.startSortableMenus();
			}
		};

		$scope.mb.saveChanges = function() {
			if($scope.editMode) {
				Edit.saveCKEditorData();
				theme.setMenus($scope.menus);
				Edit.menusSnapshot = [];
				Edit.endEditing();
			}
		};

		$scope.mb.discardChanges = function() {
			if($scope.editMode) {
				Edit.shutdownMenuOrdering();
				Edit.shutdownCKEditor();
				Edit.endEditing();	
				Edit.discardMenuEdits();
			}
		};
		
		// New page from template
		$scope.mb.createPage = function($event) {
			Edit.createNewPage($event);
		};

		// Delete by Url
		$scope.mb.deletePage = function() {
			if($scope.editMode) {
				Edit.deletePage();
				Edit.shutdownCKEditor();
				Edit.shutdownMenuOrdering();
				Edit.endEditing();
			}
		};


		//Theme functions
		
		$scope.$on('$locationChangeStart', function() {
		    theme.getPage().then(function(page) {
		    	if(page == undefined) {
		    		page = {
		    			title: "Unkown Page",
		    			tabTitle: "Could not find page.",
		    			content: {
		    				"content-1": "I'm sorry, we could not find that page."
		    			},
		    			template: "404"
		    		};
		    	}
				$rootScope.page = page;
				console.log($rootScope.page);

				for(var template in $scope.serverData.templates) {
					if($scope.serverData.templates.hasOwnProperty(template)) {
						var found = $scope.serverData.templates[template].indexOf(page.template);
						if(found > -1) {
							page.template = template;
							break;
						}
					}
				}

				$scope.templateUrl = function() {
					return 'themes/' + $scope.serverData.theme + '/templates/' + page.template;
				}

				console.log('page.template', page.template);
				if(page.template == "blog") {
					theme.getAllArticles().then(function(articles) {
						$scope.posts = articles;
					});
				}
			});

		    //Get Page layout templates for new page menu
			$scope.mb.templates = [];
			for(var template in $scope.serverData.templates) {
				if($scope.serverData.templates.hasOwnProperty(template)) {
					for(var templateItem in $scope.serverData.templates[template]) {
						if($scope.mb.templates.indexOf($scope.serverData.templates[template][templateItem]) === -1) {
							$scope.mb.templates.push($scope.serverData.templates[template][templateItem]);
						}
					}
				}
			}
		});

		theme.getRoles().then(function(roles) {
			$scope.roles = roles;
		});

		theme.getMenus().then(function(menus) {
			$scope.menus = menus;
			if(!$scope.menus.main) {
				$scope.menus.main = [];
			}
	  	});


		$scope.active = function(path, classtoAdd) {
			return theme.isActive(path, classtoAdd);
		};

		$scope.mb.selectedMenu = function($event, id) {
			jQuery('#editMenuItemModal').on('shown.bs.modal', function () {
			    $('#menu-url').focus();
			});
			console.log('id', id);
			var id = id || jQuery('.mb-item-selected').data('id') || undefined;

			if(id) {
				$scope.currentMenuId = id;
				var found = theme.findMenuById($scope.menus, id).data;
				console.log('theme.findMenuById', found);
				// Prepare found
				delete found['id'];
				delete found['_id'];
				// Set menuItem
				$scope.menuItem = {};
				angular.copy(found, $scope.menuItem);
				console.log('selectedMenu', $scope.menuItem);
				// $scope.menuItem = found;
				jQuery(document).keypress(function(e) {
					if(e.which == 13) {
						$('#editMenuItemModal').modal('hide');
						$scope.mb.editMenuItem();
					}
				});
			} else {
				var location = jQuery($event.currentTarget).parent('[data-menu]').data('menu');
				if(!$scope.menus[location]) {
					$scope.menus[location] = [];
				}
				var position = $scope.menus[location].length;
				$scope.menuItem = {
					id: new Date().toString(),
					title: '',
					url: '',
					location: location,
					position: position,
					classes: '',
					target: ''
				};

				jQuery(document).keypress(function(e) {
					if(e.which == 13) {
						$('#editMenuItemModal').modal('hide');
						$scope.mb.newMenuItem();
					}
				});
			}
		};

		$scope.mb.newMenuItem = function() {
			if($scope.menuItem) {
				console.log('newMenuItem', $scope.menuItem);
				// Validate
				if(!$scope.menus[$scope.menuItem.location]) {
					$scope.menus[$scope.menuItem.location] = [];
				}
				if($scope.menuItem.url.substring(0, 4) != 'http' && $scope.menuItem.url.charAt(0) != '/') {
					$scope.menuItem.url = '/' + $scope.menuItem.url;
				}
				if(!$scope.menuItem.id) {
					$scope.menuItem.id = new Date().toString();
				}
				
				var menuLength = $scope.menus[$scope.menuItem.location].length;
				$scope.menuItem.position = menuLength;

				$scope.menus[$scope.menuItem.location][menuLength] = $scope.menuItem;
				// $scope.menus[$scope.menuItem.location].push($scope.menuItem);
				console.log('newMenuItem $scope.menus', $scope.menus);

				$scope.menuItem = undefined;
				Edit.reprepareMenus();
				Edit.checkPlaceholderMenu();
			} else {
				console.log('Please set a url and title for the menu item.');
			}
		};

		$scope.mb.editMenuItem = function() {
			$scope.menuItem.id = $scope.currentMenuId;
			$scope.menus[$scope.menuItem.location][$scope.menuItem.position] = $scope.menuItem;
			$scope.menuItem = undefined;
			Edit.reprepareMenus();
		};


		$scope.mb.removeMenuItem = function() {
			$scope.menus[$scope.menuItem.location].splice($scope.menuItem.position, 1);
			$scope.menuItem = undefined;
			Edit.reprepareMenus();
		};

		$scope.mb.sortableMenus = { 
			group: 'menus',
			ghostClass: "sortable-ghost",
			draggable: ".mb-draggable",
			filter: ".ignore-draggable",
			animation: 250,
			scroll: true, // or HTMLElement
		    scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
		    scrollSpeed: 10, // px
			onStart: function (e) { 
		    	// jQuery(sortableMenus[i]).addClass("mb-contents-moving");
		    },
		    onSort: function (e) {
		        // jQuery(sortableMenus[i]).removeClass("mb-contents-moving");
		    },
		    onEnd: function(e) {
		    	// Edit.updateMenuPositions();
		    	Edit.updateMenuData();
		    	Edit.checkPlaceholderMenu();
		   		Edit.reprepareMenus();
		   		console.log('onEnd', $scope.menus);
			}
		};
		$scope.mb.sortableMenus.disabled = true;

		$scope.defaultTitle = "Heading";
		$scope.defaultText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, illo libero accusantium maxime nihil beatae sunt asperiores aut odio laboriosam incidunt, omnis, expedita ad consequuntur blanditiis, corporis necessitatibus ex numquam.";

	}]); //controller AppCtrl
})(jQuery);