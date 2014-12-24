angular.module('app.directives').directive('mbMenu', ['$location', function(location) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			// if(location.path() == scope.menu.url) {
			// 	element.addClass('active');
			// }

			scope.$on('$routeChangeSuccess', function () {
				console.log('change');
			});

			element.addClass('mb-draggable ' + scope.menu.classes);
			// element.children('a').addClass('mb-editable');
			element.attr('ng-class="active(menu.url, \'active\')"');
			element.data('id', scope.menu.id);

			element.bind('click', function(e) {
				jQuery('.mb-draggable').removeClass('mb-item-selected');
				element.addClass('mb-item-selected');
			});

			element.children('a').bind('click', function(e) {
				if(scope.editMode) {
					e.preventDefault();
				}
			});

			scope.$watch('editMode', function(value) {
				if(value) {
					element.addClass('mb-move');
					// element.children('a').attr('contenteditable', true);
				} else {
					element.removeClass('mb-move');
					// element.children('a').attr('contenteditable', false);
				}
			});

			element.on('mouseenter', function() {
				if(scope.editMode) {
					element.addClass('mb-highlight');
				}
            });

            element.on('mouseleave', function() {
            	if(scope.editMode) {
	                element.removeClass('mb-highlight');
	            }
            });

			element.bind('dblclick', function(e) {
				if(scope.editMode) {
					element.addClass('mb-item-selected');
					scope.mb.selectedMenu(e, scope.menu.id);
					jQuery('#editMenuItemModal').modal('toggle');
				}
			});	

			element.children('a.mb-editable').blur(function(e) {
				scope.menu.title = this.text;
			});	
		},
	};
}]);