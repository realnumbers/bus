var SEARCH = document.getElementById("search");
var DETAILS = document.getElementById("details");
var SECTION = document.getElementsByClassName("js-section");
var BACK = document.getElementById("back");
var CANCEL = document.getElementById("cancel");
var CANCEL_INPUT_ICONS = document.getElementsByClassName("cancel-input");

var lang = "it";
var form_stop;
var to_stop;
var matching_busstops = new Array(5);
var busstops = $.getJSON( "js/busstops.json", function(data) {
		autocom(0);
	});
if (navigator.language === "de") {
		lang = "de";
}
var queryComplete = false;
var details = false;

clearPage(1);
hideIcon(BACK);
hideIcon(CANCEL);
hideCancelInputIcon(0);
hideCancelInputIcon(1);
hideCancelInputIcon(2);

function clearPage(startSection) {
	var i = startSection;
	while (i < SECTION.length) {
		SECTION[i].style.display = "none";
		i++;
	}
}

function autocom(current_section) {
	var i;
	var children = SECTION[current_section].children;
	var input_string = children[1].value;

	i = 2
	while (i < children.length) {
		children[i].children[0].innerHTML = "";
		children[i].children[1].innerHTML = "";
		i++;
	}
	if (input_string != "") {
		children[2].children[1].innerHTML = "Couldn't find any matches...";
		children[2].children[1].className += " no-matches";
		input_string = input_string.split(" ");
		data = busstops.responseJSON;
		i = 2;
		data[lang].every( function (element, index, array) {
			var res = input_string.every( function (item, index, array) {
				var pattern = new RegExp(item, "i");
				var found_match = element.label.match(pattern);

				if (found_match != null) {
						return true;
				}
				else{
						return false;
				}

			});

			if (res && i < children.length) {

				matching_busstops[i-2] = element;
				children[i].children[0].innerHTML = element.name+", ";
				children[i].children[1].innerHTML = element.city;
				children[2].children[1].className = "line-small";
				i++;
			}
			if (i >= children.length) {
				return false;
			}
			else{
				return true;
			}
		});
	}
}
function selectBusstop(current_section, div_number) {
	SECTION[current_section].children[0].children[1].innerHTML = matching_busstops[div_number].name + ", ";
	SECTION[current_section].children[0].children[2].innerHTML = matching_busstops[div_number].city;
	SECTION[current_section].children[1].value = "";
	
	SECTION[current_section].children[0].children[1].style.display = "inline-block";
	SECTION[current_section].children[0].children[2].style.display = "inline-block";
	
	makeBlank(current_section);
	hideCancelInputIcon(current_section);
	
	if (queryComplete) {
		if (current_section === 0) {
				from_stop = matching_busstops[div_number].id;
				autoSetTime();
		}
		if (current_section === 1) {
				to_stop = matching_busstops[div_number].id;
				autoSetTime();
		}
	}
	else {
		activateInput(current_section + 1);
		autocom(current_section);
		if (current_section === 0) {
				from_stop = matching_busstops[div_number].id;
		}
		if (current_section === 1) {
				to_stop = matching_busstops[div_number].id;
				autoSetTime();
		}
	}
}
function makeBlank(current_section) {
	var i = 1;
	while (i < SECTION[current_section].children.length) {
			SECTION[current_section].children[i].style.display = "none";
			i++;
	}
	$(SECTION[current_section]).removeClass("active-section"); //className = "js-section";
}
function activateInput(current_section) {
	if (queryComplete) {
		hideCancelInputIcon(0);
		hideCancelInputIcon(1);
		hideCancelInputIcon(2);
		showCancelInputIcon(current_section);
	}
	unBlank(current_section);
	showAllLabels();
	SECTION[current_section].children[0].children[1].style.display = "none";
	SECTION[current_section].children[0].children[2].style.display = "none";
}
function deactivateLabel(current_section) {
	console.log("deactivating input " + current_section);
	console.log(SECTION[current_section].children[0].children[1].innerHTML);
	
	SECTION[current_section].children[0].children[1].style.display = "inline-block";
	SECTION[current_section].children[0].children[2].style.display = "inline-block";
	console.log("labels should be visible now");
	makeBlank(current_section);
	hideCancelInputIcon(current_section);
}
function showAllLabels() {
	var i = 0;
	while (i < 3) {
		SECTION[i].children[0].children[1].style.display = "inline-block";
		SECTION[i].children[0].children[2].style.display = "inline-block";
		i++;
	}
}
function unBlank(current_section) {
	var i = 0;
	while (i < SECTION.length) {
		makeBlank(i);
		i++;
	}
	SECTION[current_section].style.display = "block";
	i = 0;
	while (i < SECTION[current_section].children.length) {
		SECTION[current_section].children[i].style.display = "block";
		i++;
	}
	if (SECTION[current_section].children[1] != null)
		SECTION[current_section].children[1].focus();
	addClass(current_section);
}
function autoSetTime() {
	var currentdate = new Date();
	console.log(currentdate);
	var day = addZero(currentdate.getDate());
	var month = addZero(currentdate.getMonth() + 1);
	var year = currentdate.getFullYear();
	var hours = addZero(currentdate.getHours());
	var minutes = addZero(currentdate.getMinutes());
	
	SECTION[2].children[1].value = day + "." + month + "."  + year;
	SECTION[2].children[2].value = hours + ":" + minutes;
	
	//SECTION[2].children[1].value = "27/02/2014";
  	//SECTION[2].children[2].value = "13:20";
	showAllLabels();
	selectTime(2);
}
function selectTime(current_section) {
	var dateElement = SECTION[current_section].children[1];
	var timeElement = SECTION[current_section].children[2];
	var date = dateElement.value;
	var time = timeElement.value;
	var dateArray = date.split(/[\.\/\-,;:]/);
	var timeArray = time.split(/\D/);
	
	console.log("date elem. 1: " + dateArray[0]);
	console.log("date elem. 2: " + dateArray[1]);
	console.log("date elem. 3: " + dateArray[2]);
	
	var correctDateArray = formatDate(dateArray);
	var day = addZero(correctDateArray[0]);
	var month = addZero(correctDateArray[1]);
	var year = correctDateArray[2];
	
	var correctTimeArray = formatTime(timeArray);
	var hours = correctTimeArray[0];
	var minutes = correctTimeArray[1];
	/*
	var date_element = SECTION[current_section].children[1];
	var date = date_element.value;
	var time_element = SECTION[current_section].children[2];
	var time = time_element.value;
	*/
	if (dateElement.validity.valid && timeElement.validity.valid){ 
		SECTION[current_section].children[0].children[1].innerHTML = day + "." + month + "." + year + ", ";
		SECTION[current_section].children[0].children[2].innerHTML = hours + ":" + minutes;
		hideCancelInputIcon(current_section);
		makeBlank(current_section);
		showAllLabels();
		getRoute(date,time);
	}
}
function addClass(current_section) {
	SECTION[current_section].className += " active-section";
}
function removeClass(current_section) {
	$(SECTION[current_section]).removeClass("active-section");
}
function getRoute(date, time) {
	date = date.replace(/\//g, ":");
	date = date.replace(/\./g, ":");
	date = date.split(":");
	time = time.replace(":", "");
	count_date = date[2].split("");
	unBlank(3);
	if (count_date.length == 2) {
		date[2] = "20" + date[2];
	}
	var url = "http://html5.sasabus.org/backend/sasabusdb/calcRoute?";
	url = url + "startBusStationId=" + from_stop;
	url = url + "&endBusStationId=" + to_stop;
	url = url + "&yyyymmddhhmm=" + date[2] + date[1] + date[0] + time;
	var results = 3;
	var requestId;
	$.ajax({
		dataType: "jsonp",
		jsonpCallback: "Callback",
		url: url,
	 	success: function(data) {
			showIcon(CANCEL);
			queryComplete = true;
			
			console.log(data);
			loadConnection(data, 0);
			
			requestId = data.ConResCtxt[0];
			console.log(requestId);
			
			requestId = requestId.split("#")[0];
			nextData(data, requestId, 1);
		}
	});	
}
function nextData(data, requestId, count) {
	if (count < 5) {
		console.log(requestId);

		var nextUrl = "http://html5.sasabus.org/backend/sasabusdb/nextRoute?context=";
		nextUrl = nextUrl + requestId;
		nextUrl = nextUrl + "%23";
		nextUrl = nextUrl + count;
	
		console.log(nextUrl);
		$.ajax({
			dataType: "jsonp",
			jsonpCallback: "Callback",
			url: nextUrl,
		 	success: function(data) {
				console.log(data);
				loadConnection(data, count);
				console.log(requestId);
				nextData(data, requestId, parseInt(count) + 1);
			}
		});		
	}
}
function loadConnection(data, resultPointer) {
	var con = data.ConnectionList.Connection[0].Overview;
	var arr_time = con.Arrival.BasicStop.Arr.Time;
	var dep_time = con.Departure.BasicStop.Dep.Time;
	var duration = con.Duration.Time;
	var transfers = con.Transfers;
	var overview_section = SECTION[3].children[0];

	console.log(SECTION[3].children[1]);
	arr_time = arr_time.split("d");
	arr_time = arr_time[1].split(":");
	arr_time = arr_time[0] + ":" + arr_time[1];
	dep_time = dep_time.split("d");
	dep_time = dep_time[1].split(":");
	dep_time = dep_time[0] + ":" + dep_time[1];
	duration = duration.split("d");
	duration = duration[1].split(":");
	duration = duration[0] + ":" + duration[1];

	if (transfers == 0)
		transfers = "";
	if (transfers == 1)
		transfers = "1 change";
	if (transfers > 1)
		transfers += " changes ";

	overview_section.children[resultPointer].children[0].innerHTML = dep_time + " - " + arr_time;
	overview_section.children[resultPointer].children[1].innerHTML = duration + ", " + transfers;
	
	hideSpinner();
}
function cancelQuery() {
	queryComplete = false;
	hideIcon(CANCEL);
	clearPage(0);
	unBlank(0);
	SECTION[0].children[0].children[1].innerHTML = "";
	SECTION[0].children[0].children[2].innerHTML = "";
}
function hideSpinner() {
	SECTION[3].children[1].style.display = "none";
}
function hideIcon(icon) {
	icon.style.display = "none";
}
function showIcon(icon) {
	icon.style.display = "block";
}
function hideCancelInputIcon(sectionNo) {
	CANCEL_INPUT_ICONS[sectionNo].style.display = "none";
}
function showCancelInputIcon(sectionNo) {
	CANCEL_INPUT_ICONS[sectionNo].style.display = "block";
}
function showDetails(resultNumber) {
	details = true;
	//clearPage(0);
	DETAILS.style.display = "block";
	showIcon(BACK);
	unBlank(4);
	$(SEARCH).removeClass("search-visible");
	$(SEARCH).addClass("search-hidden");
	$(DETAILS).removeClass("details-hidden");
	$(DETAILS).addClass("details-visible");
	
	$(CANCEL).removeClass("search-visible");
	$(CANCEL).addClass("search-hidden");
	$(BACK).removeClass("details-hidden");
	$(BACK).addClass("details-visible");
}
function goBack() {
	details = false;
	SEARCH.style.display = "block";
	showIcon(CANCEL);
	
	$(DETAILS).removeClass("details-visible");
	$(DETAILS).addClass("details-hidden");
	$(SEARCH).removeClass("search-hidden");
	$(SEARCH).addClass("search-visible");
	
	$(BACK).removeClass("details-visible");
	$(BACK).addClass("details-hidden");
	$(CANCEL).removeClass("search-hidden");
	$(CANCEL).addClass("search-visible");
	
	showAllLabels();
	hideSpinner();
}
$(DETAILS).on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
	if (!details) {
		DETAILS.style.display = "none";
		BACK.style.display = "none";
	}
});
function extractTime(timestamp) {
	// 00d10:20:00
	var all = timestamp.split("d");
	var time = all[1].split(":");
	time[0] = parseInt(time[0]);
	time[1] = parseInt(time[1]);
	time[2] = parseInt(all[0]);
	return time;					// hours, mins, days 
}
function calculateWaitingTime(timepstamp1, timepstamp2) {
	var time1 = extractTime(timestamp1);
	var time2 = extractTime(timestamp2);

	var startMin  = time1[0];
	var endMin    = time2[0];
	var startHour = time1[1];
	var endHour   = time2[1];
	var startDay  = time1[2];
	var endDay    = time2[2];

	if (startDay === endDay) {
		if (startHour === endHour) {
			waitTime = endMin - startMin;
		}
		else {
			var hourDifference = endHour - startHour;
			waitTime = hourDifference * 60 + stopMin - startMin;
		}
	}
	else {
		var dayDifference = endDay - startDay;
		var firstDay = (12 - startHour) * 60 - startMin;
		var fullDays = (dayDifference - 1) * 12 * 60;
		var lastDay = endHour * 60 + endMin;
		waitTime = firstDay + fullDays + lastDay;
	}
	return waitTime;
}
function addZero(number) {
	string = number.toString();
	if ((number < 10 && string.substring(0,1) != "0") || (string.length === 1)) {
		number = "0" + number;
	}
	return number;
}
function formatTime(time) {
	string1 = time[0].toString();
	string2 = time[1].toString();
	console.log("String1 length: " + string1.length + "     String2 length: " + string2.length)
	if ((time[0] < 10 && string1.substring(0,1) != "0") || string1.length === 1) time[0] = "0" + time[0];
	if ((time[1] < 10 && string2.substring(0,1) != "0") || string2.length === 1) time[1] = "0" + time[1];
	console.log(time[0])
	console.log(time[1])
	return time;
}
function formatDate(date) {
	var yearPosition;
	for (var i = 0; i < 3; i++) {
		if (/201\d/.test(date[i])) {
			yearPosition = i;
		}
	}
	console.log("Year is in position " + (yearPosition + 1));
	if (yearPosition != 2) {
		var tmp = date[2];
		date[2] = date[yearPosition];
		date[yearPosition] = tmp;
	}
	console.log("day: " + date[0]);
	console.log("month: " + date[1]);
	console.log("year: " + date[2]);
	return date;
}
