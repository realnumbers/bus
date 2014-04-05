function initLayout() {
	$(":input").val("");
	$(".js-name").text("");
	$(".js-city").text("");
	$(".spinner").css("display", "none");
	$(".input-section-visible").hide(0).removeClass("input-section-visible").addClass("input-section-hidden");
	$(".input-section-hidden").hide(0)
	$(".details-hidden").hide(0);
	$(".js-from:last").show(0);
	$(".js-to:last").show(0);
	toggleInputHideClass("init");
}
function toggleInput(el) {
	if ($(el).next(".js-from").length > 0 ||
		  $(el).next(".js-to").length > 0 ||
		  $(el).next(".js-time-date").length > 0){
		$(el).next(":first").slideToggle(300, function () {
			$(":input").val("");
			});
	}
	else
		$(el).slideToggle(300, function () {
			showSuggests(".js-section", -1);
			toggleInputHideClass(el);
			$(":input").val("");
		});
}

function showSuggests(section, number, busstop) {
	$(section).find(".js-suggest").each( function (index, el) {
		if ($(el).parents(section) && index == number) {
			$(el).show();
			//$(el).slideToggle(400);
			$(el).find(".js-name").text(
				(busstop.name != "") ? busstop.name + ", " : "");	
			$(el).find(".js-city").text(busstop.city);	
		}
		else {
			if (index > number) {
				$(el).hide();
			//	$(el).slideToggle(400);
				$(el).find(".js-name").text();	
				$(el).find(".js-city").text();	
			}
		}
	});
}

function showSelectedBusstop(section, busstop) {
	$(section + ":first").find(".js-name").text(busstop.name + ", ");
	$(section + ":first").find(".js-city").text(busstop.city);
}

function showSelectetTime(time) {
	$(".js-time-date:first").find(".js-name").text(time[1] + ", ");
	$(".js-time-date:first").find(".js-city").text(time[0]);
}

// Moves the next input section into visible and
// and proves if the next feld is already fulled
function toggleInputHideClass(el) {
	//To validate the next input feld
	if (el == "init") proveNextSection("init");
	else if ($(el).hasClass("js-from")) proveNextSection("js-from");
	else if ($(el).hasClass("js-to")) proveNextSection("js-to");
	else if ($(el).hasClass("js-time-date")) proveNextSection("js-time-date");

	$(".input-section-hidden:first").show(0).removeClass("input-section-hidden").addClass("input-section-visible");
}

function showStartRequestStuff() {
	$(".spinner").show();
	$(".icon-hidden-left:first").show(0).removeClass("icon-hidden-left").addClass("icon-visible");
}
function showOverview() {
}

	/*

$(".js-section").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
	}
}
		$(".js-active").find(".collapse").slideToggle(300);

	$("#cancel").removeClass("icon-hidden-left").addClass("icon-visible");
	$("#cancel").removeClass("icon-hidden-left").addClass("icon-visible");
	$("#search").removeClass("search-hidden").addClass("search-visible");
	$("#back").removeClass("icon-visible").addClass("icon-hidden-right");
	$("#details").removeClass("details-visible").addClass("details-hidden");
	$("#cancel").removeClass("icon-visible").addClass("icon-hidden-left");
	$("#search").removeClass("search-visible").addClass("search-hidden");

	$("#back").removeClass("icon-hidden-right").addClass("icon-visible");
	$("#details").removeClass("details-hidden").addClass("details-visible");
function toggleInput(element) {
*/
