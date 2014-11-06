(function($){
app.controller('AppCtrl', ['$scope', '$rootScope', '$http', '$location', 'CRUD', 'ckeditorService', function($scope, $rootScope, $http, $location, CRUD, ckeditorService) {

	$scope.inEditMode = false;

	var Edit = new function() {
		this.startEditing = function() {
			$scope.inEditMode = true;
			$('a').click(function(e) {
				if($scope.inEditMode) {
					e.preventDefault();
				}
			});
			jQuery('.sc-editable').attr('contenteditable', true);
			CKEDITOR.inlineAll();
			for(i in CKEDITOR.instances) {
				CKEDITOR.instances[i].firstSnapshot = CKEDITOR.instances[i].getData();
			}	
			$('#sc-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('sc-light-green');
			$('#sc-cancel, #sc-trash').toggleClass('sc-hidden');
		}
		this.endEditing = function() {
			$scope.inEditMode = false;
			jQuery('.sc-editable').removeAttr('contenteditable');
			$('#sc-editMode').toggleClass('fa-edit').toggleClass('fa-check-circle').toggleClass('sc-light-green');
			$('#sc-cancel, #sc-trash').toggleClass('sc-hidden');
		}

		this.sortMenu;
		this.origionalMenuOrder;
		this.newMenuOrder;
	} 

	

	// Start editing
	$('#sc-editMode').click(function(e){
		if($scope.inEditMode == false) {
			Edit.startEditing();
			var el = document.getElementById('sortable-head');
			Edit.sortMenu = new Sortable(el, {
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
			    	// jQuery(e.target).addClass('sc-currently-moving');
			    	jQuery('#sortable-head').addClass("sc-contents-moving");
			    },
			    onUpdate: function (e){
			        // jQuery(e.target).removeClass('sc-currently-moving');
			        jQuery('#sortable-head').removeClass("sc-contents-moving");
			    }
			});
		} else { 
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
				tabTitle: document.getElementById('sc-browser-tab-title').value,
				url: document.getElementById('sc-url-link-title').value,
				description: document.getElementById('sc-page-description').value
			}

			CRUD.page.update({url: $location.url()}, finalDocument, function(response) {
				console.log(response.response);
			});

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

			$('a.sc-main-list-a').each(function(i) {
				var url = $(this).attr('href');
				var title = $(this).text();
				CRUD.menu.update({url: url}, {title: title}, function(response) {
					console.log(response.response);
				});
			});
			Edit.endEditing();
		}
	});

	// Reject Changes
	$('#sc-cancel').click(function(e){
		if($scope.inEditMode) {
			for(i in CKEDITOR.instances) {
				CKEDITOR.instances[i].setData(CKEDITOR.instances[i].firstSnapshot);
			    CKEDITOR.instances[i].destroy();
			}
			Edit.sortMenu.sort(Edit.origionalMenuOrder);
			Edit.sortMenu.destroy();
			Edit.endEditing();
		}
	});
	
	// New page from template
	$('#sc-new-template li').click(function(e){
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
		$('.sc-dropdown, .sc-dropdown-right').addClass('sc-hidden');
	});

	// Delete by Url
	$('#sc-trash').click(function(e){
		if(confirm('Are use sure you want to delete the page at ' + $location.url())) {
			CRUD.page.delete({url: $location.url()}, function(reply) {
				if(reply.error) {
					console.log(reply.response);
				} else {
					console.log(reply.response);
					$location.url('/');
					Edit.endEditing();
				}
			});
		}
	});
}]);
})(jQuery);