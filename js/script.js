//tmpUrl: dep, arr, time, date
var tmpUrl = new Array(4);
var con_data = new Array(5);
var lang = "it";
var matching_busstops = new Array(5);
var busstops = $.getJSON( "js/busstops.json", function(data) {
		//autocom(0);
	});

if (navigator.language === "de") {
		lang = "de";
}

removeClickDelay();
initApp();

function initApp() {
	hideElement(".js-section");
	hideElement("#cancel");
	hideElement("#back");
	hideElement(".cancel-input");
	changeWorkElement("reset");
	$(":input").val("");
	showElement(".js-active").children(".js-input").show();
	// for test
	//tmpUrl: dep, arr, time, date
	tmpUrl[0] = ":1213:1214:";
	tmpUrl[1] = ":1211:1212:";
	tmpUrl[2] = "10:20";
	tmpUrl[3] = "10/03/2014";
	hideElement(".js-input");
	$(".js-active").find(".line-big:first").text("Test, ");
	activedNextSection();
	showElement(".js-active").children(".js-input").show();
	hideElement(".js-input");
	$(".js-active").find(".line-small:first").text("City");
	activedNextSection();
}


function removeClickDelay() {
	// Eliminates 300ms click delay on mobile 
	window.addEventListener('load', function() {
  	new FastClick(document.body);
	}, false);
}

function hideElement(element) {
	return $(element).hide();
}
function showElement(element) {
	return $(element).show();
}
function autocom() {
	var inputString = $(".js-active").children(".js-input").val();
	var i = 0;	
	hideElement(".js-suggest");
	
	if (inputString !== "") {
		inputString = inputString.split(" ");
		data = busstops.responseJSON;
		
		//Match every busstop from data
		var resMatch = data[lang].every( function (element, index, array) {
			//with every part of the inputSting
			var foundBusstop = inputString.every( function (item, index, array) {
				var pattern = new RegExp(item, "i");
				var foundMatch = element.label.match(pattern);
				//foundMatch = (element.id != to_stop && element.id === from_stop) ? null : foundMatch;
				//foundMatch = (element.it != from_stop && element.id === to_stop) ? null : foundMatch;
				// return true if there is a match
				return (foundMatch != null) ? true : false;
			});

			if (foundBusstop) {
				matching_busstops[i] = element;
				changeWorkElement();
				$(".js-active").children(".js-work").children(".line-big").text(element.name + ", ");
				$(".js-active").children(".js-work").children(".line-small").text(element.city);
				showElement(".js-work");
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
	changeWorkElement("reset");
}
// changes the current work element to the next element
// resets work element with the command "reset"
function changeWorkElement(command){
	if (command == "reset") {
		$(".js-work").removeClass("js-work");
		$(".js-active").find(".js-suggest:first").addClass("js-work");
	}
	else
		$(".js-active").find(".js-work").removeClass("js-work").next().addClass("js-work");
}
function showMatchMsg(){
	$(".js-active").children(".js-suggest:first").text("Couldn't find any matches...");
	$(".js-active").children(".js-suggest:first").addClass("no-matches");
	$(".js-active").children(".js-suggest:first").addClass("js-no-matches");
	showElement(".js-no-matches");
}
function hideMatchMsg(){
	hideElement(".js-no-matches");
	$(".js-active").children(".js-suggest:first").text("");
	$(".js-active").children(".js-suggest:first").removeClass("no-matches");
	$(".js-active").children(".js-suggest:first").removeClass("js-no-matches");
}
function selectBusstop(current_section, div_number) {
	$(".js-active").find(".line-big:first").text(matching_busstops[div_number - 1].name + ", ");
	$(".js-active").find(".line-small:first").text(matching_busstops[div_number - 1].city);
	$(".js-active").find(":input").val("");	
	console.log(matching_busstops);
	hideElement(".js-input");
	activedNextSection();
}

function activedNextSection() {
	$(".js-active").removeClass("js-active").next().addClass("js-active");
	$("js-section").removeClass("active-section"); 
	$("js-active").addClass("active-section"); 
	changeWorkElement("reset");
	if ($(".js-active").find(":input:first").hasClass("date")) {
		showElement(".js-active");
		autoSetTime();
		activedNextSection();
		requestRoute();
	}
	else if ($(".js-active").find(".line-big:first").text() == "")
			showElement(".js-active").children(".js-input").show();
		else
			activedNextSection();
}
function autoSetTime() {
	var currentdate = new Date();
	var day = addZero(currentdate.getDate());
	var month = addZero(currentdate.getMonth() + 1);
	var year = currentdate.getFullYear();
	var hours = addZero(currentdate.getHours());
	var minutes = addZero(currentdate.getMinutes());
	
	$(".date").val(day + "." + month + "."  + year);
	$(".time").val(hours + ":" + minutes);
	
	selectTime();
}
function selectTime() {
	var date = $(".date").val();
	var time = $(".time").val();

	var dateArray = date.split(/[\.\/\-,;:]/);
	var timeArray = time.split(/\D/);
	if ($(".date")[0].validity.valid && $(".time")[0].validity.valid) { 
		var correctDateArray = formatDate(dateArray);
		var day = addZero(correctDateArray[0]);
		var month = addZero(correctDateArray[1]);
		var year = correctDateArray[2];
	
		var correctTimeArray = formatTime(timeArray);
		var hours = correctTimeArray[0];
		var minutes = correctTimeArray[1];

		$(".js-active").find(".line-big").text(day + "." + month + "." + year + ", ")
		$(".js-active").find(".line-small").text(hours + ":" + minutes);
		hideElement(".js-input");
	}
}
function requestRoute() {
	//test time, later take the time from url
	var date = tmpUrl[3];
	var fromStop = tmpUrl[0];
	var toStop = tmpUrl[1];
	var time = tmpUrl[2];;
	//base url
	var url = "http://html5.sasabus.org/backend/sasabusdb/calcRoute?";
	var requestId;
	date = date.replace(/\//g, ":");
	date = date.replace(/\./g, ":");
	date = date.split(":");
	time = time.replace(":", "");
	if (date[2].length == 2) {
		date[2] = "20" + date[2];
	}
	url += "startBusStationId=" + fromStop;
	url += "&endBusStationId=" + toStop;
	url += "&yyyymmddhhmm=" + date[2] + date[1] + date[0] + time;
	changeWorkElement("reset");
	$.ajax({
		dataType: "jsonp",
		jsonpCallback: "Callback",
		url: url,
	 	success: function(data) {
			//hideKeyboard();
			loadOverview(data, 0);
			requestId = data.ConResCtxt[0];
			requestId = requestId.split("#")[0];
			nextData(requestId, 1);
		}
	});	
}
function nextData(requestId, count) {
	if (count < 5) {
		var nextUrl = "http://html5.sasabus.org/backend/sasabusdb/nextRoute?context=";
		nextUrl += requestId;
		nextUrl += "%23";
		nextUrl += count;

		$.ajax({
			dataType: "jsonp",
			jsonpCallback: "Callback",
			url: nextUrl,
		 	success: function(data) {
				loadOverview(data, count);
				nextData(requestId, parseInt(count) + 1);
			}
		});		
	}
	else {
		hideElement(".spinner");
		showElement(".search-result");
	}
}
function loadOverview(data, resultPointer) {
	var con = data.ConnectionList.Connection[0].Overview;
	var arrTime = con.Arrival.BasicStop.Arr.Time;
	var depTime = con.Departure.BasicStop.Dep.Time;
	var duration = con.Duration.Time;
	var transfers = con.Transfers;
	con_data[resultPointer]	= data;

	arrTime = arrTime.split("d");
	arrTime = arrTime[1].split(":");
	arrTime = arrTime[0] + ":" + arrTime[1];
	depTime = depTime.split("d");
	depTime = depTime[1].split(":");
	depTime = depTime[0] + ":" + depTime[1];
	duration = duration.split("d");
	duration = duration[1].split(":");
	duration = duration[0] + ":" + duration[1];

	if (transfers == 0)
		transfers = "";
	else if (transfers == 1)
		transfers = "1 change";
	else if (transfers > 1)
		transfers += " changes ";
	
	//showElement(".js-work").find(".line-big").text(depTime + " - " + arrTime);
	//showElement(".js-work").find(".line-small").text(duration + transfers);
	changeWorkElement();
	
}

function splitBusstopName(busstopName) {
	busstopName = busstopName.split("(")[1].split(") ");
	return busstopName;
}
function showDetails(resultNumber) {
	activedNextSection();
}
function parseDetails(resultNumber){
	var connection = con_data[resultNumber].ConnectionList.Connection[0].ConSectionList.ConSection;
	var walkTime = "";
	var waitTime = "";
	var lineNo;
	var stops;
	var arrBusstop;
	var depBusstop;
	var dep;
	var arr;
	var depTime;
	var arrTime;
	var nextDepTime;
	hideElement(".transit-block");
	hideElement(".intermediate-block");

	for (var i = 0; i < connection.length; i++) {
		walkTime = "";
		if (connection[i].Walk.length > 0) {
			walkTime = "alk " + timeString(calculateWaitingTime("00d00:00:00:00", connection[i].Walk[0].Duration.Time));
			if (connection[i].Journey.length > 0){
				nextDepTime = connection[i + 1].Journey[0].PassList.BasicStop[0].Dep.Time;
				waitTime = "Wait " + timeString(calculateWaitingTime(arr, nextDepTime));
			}
		}	
		else if (connection[i].Journey.length > 0) {
			lineNo = connection[i].Journey[0].JourneyAttributeList.JourneyAttribute[3].Attribute.AttributeVariant[0].Text;
			stops = connection[i].Journey[0].PassList.BasicStop;
			arrBusstop = stops[stops.length -1].Station.name.split(" - ");
			depBusstop = stops[0].Station.name.split(" - ");
			dep = stops[0].Dep.Time;
			arr = stops[stops.length - 1].Arr.Time;
			depTime = extractTime(dep);
			arrTime = extractTime(arr);

			if (lang === "de") {
				arrBusstop = splitBusstopName(arrBusstop[1]);
				depBusstop = splitBusstopName(depBusstop[1]);
			}
			else {
				arrBusstop = splitBusstopName(arrBusstop[0]);
				depBusstop = splitBusstopName(depBusstop[0]);
			}
			if ((i+1) < connection.length && connection[i + 1].Journey.length > 0) {
				nextDepTime = connection[i + 1].Journey[0].PassList.BasicStop[0].Dep.Time;
				waitTime = "Wait " + timeString(calculateWaitingTime(arr, nextDepTime));
				W_BLOCK[i].style.display = "block";
			}
		}
		waitTime = "";
		walkTime = "";
	}
	//makeVisible(4);
	//$(SEARCH).removeClass("search-visible");
	//$(SEARCH).addClass("search-hidden");
	//$(DETAILS).removeClass("details-hidden");
	//$(DETAILS).addClass("details-visible");
}

function hideKeyboard() {
	$(document.activeElement).filter(':input:focus').blur();
}
function extractTime(timestamp) {
	// 00d10:20:00
	var all = timestamp.split("d");
	var time = all[1].split(":");
	time[0] = time[0];
	time[1] = time[1];
	time[2] = all[0];
	return time;					// hours, mins, days 
}
function extractTimeToInt (timestamp) {
	// 00d10:20:00
	var all = timestamp.split("d");
	var time = all[1].split(":");
	time[0] = parseInt(time[0]);
	time[1] = parseInt(time[1]);
	time[2] = parseInt(all[0]);
	return time;					// hours, mins, days 
}
function calculateWaitingTime(timestamp1, timestamp2) {
	var time1 = extractTimeToInt(timestamp1);
	var time2 = extractTimeToInt(timestamp2);

	var startMin  = time1[1];
	var endMin    = time2[1];
	var startHour = time1[0];
	var endHour   = time2[0];
	var startDay  = time1[2];
	var endDay    = time2[2];
	
	startMin += (startHour * 60 + startDay * 1440);
	endMin += (endHour * 60 + endDay * 1440);
	waitTime = (endMin - startMin);
	return waitTime;
}

function timeString(waitTime) {
	var waitTimeDays = 0;
	var waitTimeHours = 0;
	var waitTimeMinuts = 0;
	var waitTimeString = "";
	if (waitTime / 60 >= 1) {
		if (waitTime / 1440 >= 1) {
			waitTimeDays = parseInt(waitTime / 1440);
		}
		waitTimeHours = parseInt(waitTime / 60 - waitTimeDays * 1440);
	}
	waitTimeMinuts = waitTime - waitTimeHours * 60;

	waitTimeString = "";
	waitTimeString += (waitTimeDays != 0) ? waitTimeDays + " day" : "";
	waitTimeString += (waitTimeDays > 1) ? "s" : "";
	waitTimeString += (waitTimeString != "") ? ", " : "";
	waitTimeString += (waitTimeHours != 0) ? waitTimeHours + " hour" : "";
	waitTimeString += (waitTimeHours > 1) ? "s" : "";
	waitTimeString += (waitTimeString != "") ? ", " : "";
	waitTimeString += (waitTimeMinuts != 0) ? waitTimeMinuts + " minute" : "";
	waitTimeString += (waitTimeMinuts > 1) ? "s" : "";

	return waitTimeString;
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
	if ((time[0] < 10 && string1.substring(0,1) != "0") || string1.length === 1) time[0] = "0" + time[0];
	if ((time[1] < 10 && string2.substring(0,1) != "0") || string2.length === 1) time[1] = "0" + time[1];
	return time;
}
function formatDate(date) {
	var yearPosition;
	for (var i = 0; i < 3; i++) {
		if (/201\d/.test(date[i])) {
			yearPosition = i;
		}
	}
	if (yearPosition != 2) {
		var tmp = date[2];
		date[2] = date[yearPosition];
		date[yearPosition] = tmp;
	}
	return date;
}
