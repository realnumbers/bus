function initLayout() {
	$(".js-no-matches").hide();
	$(".js-error").hide();
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
	$(".selected").removeClass("selected");
	showSuggests(".js-section", -1);
	if ($(el).next(".js-from").length > 0 ||
		  $(el).next(".js-to").length > 0 ||
		  $(el).next(".js-time-date").length > 0){
		$(el).next(":first").slideToggle(300, function () {
			$(".js-to").find(":input").val("");
			$(".js-from").find(":input").val("");
			}).find(":input:first").focus();
	}
	else
		//$(el).slideToggle(0, function () {
		$(el).slideToggle(300, function () {
			toggleInputHideClass(el);
			$(".js-to").find(":input").val("");
			$(".js-from").find(":input").val("");
		});
}

function showSuggests(section, number, busstop) {
	$(section).find(".js-no-matches").hide();
	$(".selected").removeClass("selected");
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

function suggestInHover(el) {
 $(".selected").removeClass("selected");
 $(el).addClass("selected");
}

function suggestOutHover(el) {
 $(".selected").removeClass("selected");
}
function showSelectedBusstop(section, busstop) {
	$(section + ":first").find(".js-name").text(busstop.name + ", ");
	$(section + ":first").find(".js-city").text(busstop.city);
}

function selectNext(el) {
	if ($(".selected").length == 0)
		$(el).find(".js-suggest:first").addClass("selected");
	else {
		if ($(".selected").next(".js-suggest").length > 0)
			$(".selected").removeClass("selected").next(".js-suggest").addClass("selected");
		else
			$(".selected").removeClass("selected").prevAll(".js-suggest:last").addClass("selected");
	}
}

function selectPrevious(el) {
	if ($(".selected").length == 0)
		$(el).find(".js-suggest:last").addClass("selected");
	else {
		if ($(".selected").prev(".js-suggest").length > 0)
			$(".selected").removeClass("selected").prev(".js-suggest").addClass("selected");
		else
			$(".selected").removeClass("selected").nextAll(".js-suggest:last").addClass("selected");
	}
}

function selectEnterBusstop() {
	selectBusstop(".selected:first");
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

	$(".input-section-hidden:first").show(0).removeClass("input-section-hidden").addClass("input-section-visible").find(":input:first").focus();
}

function showStartRequestStuff() {
	$(".spinner").css("display", "block");
	$(".js-error").hide();
	$("#cancel").show(0).removeClass("icon-hidden-left").addClass("icon-visible");
	$(".js-overview").hide().children().hide();
	$(".js-overview").find(".js-time").text("");
	$(".js-overview").find(".js-duration").text("");
}

function showOverview() {
	var routeData = getRouteData();
	var el = $(".js-overview").children(":first");
	if (routeData != undefined) {
		$(".js-overview").show();
		
		for (var i = 1; i < routeData.length; i++) {
				if (routeData[i] != null) {

							
							}
						el.show();
						el.find(".js-time").text(routeData[i].overview.depTime + " - " + routeData[i].overview.arrTime);
						el.find(".js-duration").text(routeData[i].overview.duration);
						if (el.next().length == 0 && i < routeData.length - 1) {
								console.log("add Element");
								$(".js-overview").append('<div class="text-element list-element " onclick="showDetails(this)"> <p class="line-big bigger js-time"></p><p class="line-small list js-duration"></p></div>');
						el = el.next();
				}
		}
	}
	else {
		console.log("Invalide Error: Noconnection");
	}

}

function changeToDetails(index) {
	console.log("go to Detail");
	$(".js-transit").hide();
	$(".js-intermediate").hide();
	$(".search-visible:first").show(0).removeClass("search-visible").addClass("search-hidden");

	$(".details-hidden:first").show(0).removeClass("details-hidden").addClass("details-visible");
	$("#cancel").removeClass("icon-visible").addClass("icon-hidden-left");
	$("#back").show(0).removeClass("icon-hidden-right").addClass("icon-visible");
	genDetails(index);
}

function genDetails(index) {
	var data = getRouteData()[index].connections;
	console.log(index);
	var tBlock = $(".js-transit:first");
	var iBlock = $(".js-intermediate:first"); 
	var i = 0;
	while (i < data.length) {
		if (data[i].depTime != undefined) {
			tBlock.show();
			tBlock.find(".js-time:first").text(data[i].depTime);
			tBlock.find(".js-time:last").text(data[i].arrTime);
			tBlock.find(".js-name:first").text(data[i].depBusstop[1] + ", ");
			tBlock.find(".js-name:last").text(data[i].arrBusstop[1] + ", ");
			tBlock.find(".js-city:first").text(data[i].depBusstop[0]);
			tBlock.find(".js-city:last").text(data[i].arrBusstop[0]);
			tBlock.find(".js-lineNo").text("Line " + data[i].lineNo);

		}
		if (data[i].waitTime != "") 
			iBlock.show().find("p").text(data[i].waitTime);
		
		i++;
		tBlock = tBlock.nextAll(".js-transit:first");
		iBlock = iBlock.nextAll(".js-intermediate:first");
	}
}
function changeToSearch() {
	var UrlData = History.getState().data;
	console.log("Change To Search");
	$(".details-visible:first").removeClass("details-visible").addClass("details-hidden");
	$(".search-hidden:first").show(0).removeClass("search-hidden").addClass("search-visible");
	$("#back").removeClass("icon-visible").addClass("icon-hidden-right");
	if (UrlData.arr != undefined && UrlData.dep != undefined)
		$("#cancel").show(0).removeClass("icon-hidden-left").addClass("icon-visible");
}
