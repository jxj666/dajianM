(function () {
	"use strict";

	var treeviewMenu = $('.app-menu');

	// Toggle Sidebar
	$('[data-toggle="sidebar"]').click(function (event) {
		event.preventDefault();
		$('.app').toggleClass('sidenav-toggled');
		if (localStorage.sidenavtoggled) {
			localStorage.sidenavtoggled = '';
		} else {
			localStorage.sidenavtoggled = true;
		}
	});

	// Activate sidebar treeview toggle
	$("[data-toggle='treeview']").click(function (event) {
		event.preventDefault();
		if (!$(this).parent().hasClass('is-expanded')) {
			treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
		}
		$(this).parent().toggleClass('is-expanded');
	});
	// Set initial active toggle
	$("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');
	//Activate bootstrip tooltips
	$("[data-toggle='tooltip']").tooltip();

	if (localStorage.sidenavtoggled) {
		$('.app').addClass('sidenav-toggled');
	} else {
		$('.app').removeClass('sidenav-toggled');
	}

})();