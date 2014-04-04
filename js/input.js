var matchingBusstops = new Array(5);

removeClickDelay();
onEnterEvent();

function onEnterEvent() {
	$("#date-input").keydown(function(event){
		if(event.keyCode == 13)
			submitTime();	
	});
	$("#time-input").keydown(function(event){
		if(event.keyCode == 13)
			submitTime();
	});
}

function busstopInput(el) {
	var inputString = $(el).val();
	var i = 0;	
	if (inputString != "") {
		inputString = inputString.split(" ");

		//Match every busstop from data
		var resMatch = getBusstops()[lang].every( function (element, index, array) {
				//with every part of the inputSting
				var foundBusstop = inputString.every( function (item, index, array) {
					var pattern = new RegExp(item, "i");
					var foundMatch = element.label.match(pattern);
					foundMatch = (element.id != History.getState().data.arr && element.id === History.getState().data.dep) ? null : foundMatch;
					foundMatch = (element.it != History.getState().data.dep && element.id === History.getState().data.arr) ? null : foundMatch;
					// return true if there is a match
					return (foundMatch != null) ? true : false;
					});

				if (foundBusstop) {
				matchingBusstops[i] = element;
				console.log(element.label);
				i++;
				}
				//return true if I don't have enough results
				return (i < 5) ? true : false;
		});
		if (resMatch && i == 0)
			showMatchMsg();
		else
			hideMatchMsg();
	}
}

function showMatchMsg(){
	alert("No Matches");
}
function hideMatchMsg(){
}

function selectBusstop(item, resultNumber) {
	var tmpObj = new Object();
	tmpObj = History.getState().data;
	if (item == "from") {
		tmpObj.dep = matching_busstops[resultNumber].id;
		tmpObj.citydep = matching_busstops[resultNumber].city;
		tmpObj.namedep = matching_busstops[resultNumber].name;
	}
	else {
		tmpObj.arr = matching_busstops[resultNumber].id;
		tmpObj.cityarr = matching_busstops[resultNumber].city;
		tmpObj.namearr = matching_busstops[resultNumber].name;
	}
	replaceUrl(tmpObj);
	$(".js-active").find(".js-name:first").text(matching_busstops[resultNumber].name + ", ");
	$(".js-active").find(".js-city:first").text(matching_busstops[resultNumber].city);
	$(".js-active").find(":input").val("");	
	console.log(matching_busstops);
	//$(".js-active").find(".cancel-input").hide();
	//hideElement(".js-input");
	$(".js-active-input").find(".cancel-input").hide();
	$(".js-active").find(".collapse").slideToggle(200, hideCollapsedContent);
	activateNextSection();
}

function autoSetTime() {
	if (History.getState().data.time == undefined || History.getState().data.date == undefined) {
		var currentdate = new Date();
		var day = addZero(currentdate.getDate());
		var month = addZero(currentdate.getMonth() + 1);
		var year = currentdate.getFullYear();
		var hours = addZero(currentdate.getHours());
		var minutes = addZero(currentdate.getMinutes());
		$(".date").val(day + "." + month + "."  + year);
		$(".time").val(hours + ":" + minutes);
	}
	else {
		$(".date").val(History.getState().data.date);
		$(".time").val(History.getState().data.time);
	}

	selectTime();
}
function selectTime() {
	var date = $(".date").val();
	var time = $(".time").val();
	var dataValid = false;
	var tmpObj = History.getState().data;
	var dateArray = date.split(/[\.\/\-,;:]/);
	var timeArray = time.split(/\D/);
	if ($("#date-input")[0].validity.valid && $("#time-input")[0].validity.valid && date != "" && time != "") { 
		var correctDateArray = formatDate(dateArray);
		var day = addZero(correctDateArray[0]);
		var month = addZero(correctDateArray[1]);
		var year = correctDateArray[2];
	
		var correctTimeArray = formatTime(timeArray);
		var hours = correctTimeArray[0];
		var minutes = correctTimeArray[1];

		tmpObj.time = hours + ":" + minutes;
		tmpObj.date = day + "." + month + "." + year;
		replaceUrl(tmpObj);
		$(".js-active").find(".js-name").text(day + "." + month + "." + year + ", ")
		$(".js-active").find(".js-city").text(hours + ":" + minutes);
		//hideElement(".js-input");
		dataValid = true;
	}
	return dataValid;
}
function submitTime() {
	var dataValid;
	dataValid = selectTime();
	if (dataValid) {
		$(".js-active-input").find(".cancel-input").hide();
		$(".js-active").find(".collapse").slideToggle(300);
		activateNextSection();
	}
}
function showRoute() {
	var routeData = getRouteData();
	hideElement(".js-suggest");
	changeWorkElement("reset");
	if (routeData != null) {
		for (var i = 0; i < routeData.length; i++) {
				if (routeData[i] != null)
					loadOverview(routeData[i].overview);
		}
		$(".js-active").find(".js-suggest").show();
	}
	else {
		alert("Noconnection");
	}
	showElement(".js-time");
	showElement(".js-duration");
	hideElement(".spinner");
}

function loadOverview(data) {
	$(".js-work").find(".js-time").text(data.depTime + " - " + data.arrTime);
	$(".js-work").find(".js-duration").text(data.duration);
	changeWorkElement();
}

function showDetails(resultNumber) {
	var tmpData = History.getState().data;
	tmpData.detail = resultNumber + 1;
	updateUrl(tmpData);
	visibleView = "details";
}
function changeToDetails(resultNumber) {
	var routeData = getRouteData()[resultNumber].connection;
	// jump to the details section
	$(".js-active").removeClass("js-active");
	$("#details").find(".js-section:first").addClass("js-active");
	$(".js-section").removeClass("active-section"); 
	$(".js-active").addClass("active-section"); 
	//hideElement(".js-section");
	showElement(".js-active");
	changeWorkElement("reset");
	//hideElement(".js-suggest");

	for (var i = 0; i < routeData.length; i++)
		genDetailElement(routeData[i]);
	showDetailsSection();
}
function genDetailElement(routeData) {
	if (routeData.depTime == undefined) {
		changeWorkElement();
		showElement(".js-work").find("p").text(routeData.waitTime);
		changeWorkElement();
	}
	else {
		showElement(".js-work").find(".js-time:first").text(routeData.depTime);
		showElement(".js-work").find(".js-time:last").text(routeData.arrTime);
		showElement(".js-work").find(".js-name:first").text(routeData.depBusstop[1] + ", ");
		showElement(".js-work").find(".js-name:last").text(routeData.arrBusstop[1] + ", ");
		showElement(".js-work").find(".js-city:first").text(routeData.depBusstop[0]);
		showElement(".js-work").find(".js-city:last").text(routeData.arrBusstop[0]);
		showElement(".js-work").find(".js-lineNo").text("Line " + routeData.lineNo);

		changeWorkElement();
		if (routeData.waitTime != "")
			showElement(".js-work").find("p").text(routeData.waitTime);
		changeWorkElement();
	}
}

function showSearchSection() {
	visibleView = "search";
	//$(".js-section").removeClass("js-active active-section");
	$("#search").find(".js-section").show();
	//$("#search").find(".js-section:last").addClass("js-active active-section");
	//$(".js-active").find(".js-suggest").show();
	
	$("#cancel").removeClass("icon-hidden-left").addClass("icon-visible");
	$("#search").removeClass("search-hidden").addClass("search-visible");
	$("#back").removeClass("icon-visible").addClass("icon-hidden-right");
	$("#details").removeClass("details-visible").addClass("details-hidden");
}
function showDetailsSection() {
	//$("#details").show();
	$("#back").show();
	//$(".js-section").removeClass("js-active active-section");
	//$("#details").css("display", "block");
	$("#search").find(".js-section").show();
	$(".js-active").find(".js-suggest").show();
	//changeWorkElement("reset");
	//showElement("#details");
	//showElement("#back");
	$("#cancel").removeClass("icon-visible").addClass("icon-hidden-left");
	$("#search").removeClass("search-visible").addClass("search-hidden");

	$("#back").removeClass("icon-hidden-right").addClass("icon-visible");
	$("#details").removeClass("details-hidden").addClass("details-visible");
	//$("#details").removeClass("details-hidden").addClass("details-visible");
}
function goBack() {
	History.back();
	showSearchSection();
}
/*
$("#details").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
	//if (!$("#details").find(".js-section").hasClass("js-active")) {
	//if (!$("#details").hasClass("details-visible")) {
	if (visibleView == "search") {
		$("#details").hide();
		$("#back").hide();
	}
});
*/
function toggleInput(element) {
	//console.log("toggle");
	console.log("length: " + $("js-active-input").length);
	if (queryComplete) {
		//console.log("toggle_2");
		//$(".js-input").children().text("");
		//$(".js-input").val("");
		//$(".js-active").find(".collapse").children().show();
		//hideElement(".js-input").val("");
		//hideElement(".js-input").children().text("");

		// if the selected element is currently active, hide it
		if ($(element).parents(".js-section").hasClass("js-active-input")) {
			console.log("hide active");
			//$(".collapse").hide();
			$(".js-active-input").find(".collapse").children().show();
			$(".js-active-input").find(".collapse").slideToggle(200);
			$(".js-active-input").find(".cancel-input").hide();
			$(".js-active-input").removeClass("js-active-input js-active active-section");
			//$(".js-active").find(".cancel-input").hide();
			//activateNextSection();
		}
		// if the selected element is not active, show it and hide the active one
		else {
			if ($(".js-active-input")[0]){
				console.log("hide active, show inactive");
				
				// hide active input
				$(".js-active-input").find(".collapse").children().show();
				$(".js-active-input").find(".cancel-input").hide();
				$(".js-active-input").find(".collapse").slideToggle(200);
				$(".js-active-input").removeClass("js-active-input js-active active-section");
				
				// show selected input
				$(element).parents(".js-section").addClass("js-active-input js-active active-section");
				//$(".collapse").hide();
				if($(element).find(".date")) {
					$(".collapse").hide();
				}
				$(".js-active-input").find(".collapse").children().show();
				$(".js-active-input").find(".cancel-input").show();
				$(".js-active-input").find(".collapse").slideToggle(200);
				$(".js-active-input").find(".input:first").focus();
				/*
				$(".js-section").removeClass("js-active");
				showElement(element).parents(".js-section").addClass("js-active");
				showElement(".js-active").children(".js-input").show();
				$(".js-section").removeClass("active-section");
				$(".js-active").addClass("active-section");
				changeWorkElement("reset");
				*/
			}
			// if there is no active element, show the selected one
			else {
				console.log("show inactive");
				console.log($(element).find(".collapse"));
			
				//$(element).find(".collapse").children().show();
				//$(element).find(".collapse").slideToggle(200);
				$(element).parents(".js-section").addClass("js-active-input js-active active-section");
				//$(".collapse").hide();
				if($(element).find(".date")) {
					$(".collapse").hide();
				}
				$(".js-active-input").find(".collapse").children().show();
				$(".js-active-input").find(".cancel-input").show();
				//$(".js-active-input").find().show();
				//console.log($(".js-active-input").find(".collapse").children());
				$(".js-active-input").find(".collapse").slideToggle(200);
				$(".js-active-input").find(".input:first").focus();
			}
		}
	}
}
function hideKeyboard() {
	$(document.activeElement).filter(':input:focus').blur();
}

function removeClickDelay() {
	// Eliminates 300ms click delay on mobile 
	window.addEventListener('load', function() {
			new FastClick(document.body);
			}, false);
}
