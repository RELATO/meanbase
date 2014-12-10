angular.module('app.directives').directive( 'whenActive', function ( $location ) {
    return {
        scope: true,
        link: function ( scope, element, attrs ) {
            scope.$on( '$routeChangeSuccess', function () {
                console.log('change');
                if ( $location.path() == element.attr( 'href' ) ) {
                    element.addClass( 'active' );
                }
                else {
                    element.removeClass( 'active' );
                }
            });
        }
    };
});