(function($) {
	$(document).ready(function() {

		// Drop Down Menus
		var activator = $('.mb-has-dropdown');
		var dropdown = $('.mb-dropdown, .mb-dropdown-right');
		var dropdownClass = '.mb-dropdown, .mb-dropdown-right';
		var hiddenClass = 'mb-hidden';

		activator.click(function(e){
			dropdown
				.not($(e.target).find(dropdownClass))
				.not($(e.target))
				.not($(e.target).parents())
				.addClass(hiddenClass);

			$(e.target).find(dropdownClass).toggleClass(hiddenClass);
			e.stopPropagation(); 
		});

		$(document).click(function(){                   
			dropdown.addClass(hiddenClass);
		});

		

		$('.mb-panel-toggle').click(function(e) {
			console.log('clicked');
			$(e.target).parents('.mb-panel').find('.mb-panel-body').slideToggle();
			$(e.target).children('.mb-panel-toggle-caret').toggleClass('fa-rotate-90');
		});

		$('.mb-toggle-active').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('fa-toggle-on').toggleClass('fa-toggle-off');
			
		});


	});
})(jQuery);