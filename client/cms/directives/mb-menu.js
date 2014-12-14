angular.module('app.directives').directive('mbMenu', function() {
	return {
		restrict: 'E',
		scope: {
			menu: '=mbMenu'
		},
		templateUrl: 'my-customer-iso.html'
	};
});