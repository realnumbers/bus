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
onEnterEvent();
initApp();

function initApp() {
	hideElement(".js-section");
	hideElement("#cancel");
//	hideElement("#back");
	hideElement(".cancel-input");
	$(".js-section:first").addClass("js-active");
	changeWorkElement("reset");
	$(":input").val("");
	showElement(".js-active").children(".js-input").show();
	$(".js-name").text("");
	$(".js-city").text("");
	// for test
	//tmpUrl: dep, arr, time, date
	tmpUrl[0] = ":1213:1214:";
	tmpUrl[1] = ":672:673:";
	tmpUrl[2] = "10:20";
	tmpUrl[3] = "10/03/2014";
	hideElement(".js-input");
	$(".js-active").find(".js-name:first").text("Test, ");
	activedNextSection();
	showElement(".js-active").children(".js-input").show();
	hideElement(".js-input");
	$(".js-active").find(".js-city:first").text("City");
	activedNextSection();
}
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

function removeClickDelay() {
	// Eliminates 300ms click delay on mobile 
	window.addEventListener('load', function() {
  	new FastClick(document.body);
	}, false);
}

$("#details").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
	if (!details) {
		hideElement("#details");
		//BACK.style.display = "none";
	}
});

function hideElement(element) {
	return $(element).hide();
}
function showElement(element) {
	return $(element).show();
}
function cancelQuery() {
	initApp()
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
				//changeWorkElement();
				$(".js-active").children(".js-work").children(".js-name").text(element.name + ", ");
				$(".js-active").children(".js-work").children(".js-city").text(element.city);
				changeWorkElement();
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
function selectBusstop(resultNumber) {
	$(".js-active").find(".js-name:first").text(matching_busstops[resultNumber].name + ", ");
	$(".js-active").find(".js-city:first").text(matching_busstops[resultNumber].city);
	$(".js-active").find(":input").val("");	
	console.log(matching_busstops);
	$(".js-active").find(".cancel-input").hide();
	hideElement(".js-input");
	activedNextSection();
}

function activedNextSection() {
	$(".js-active").removeClass("js-active").next().addClass("js-active");
	$(".js-section").removeClass("active-section"); 
	$(".js-active").addClass("active-section"); 
	$(".js-suggest").find(".js-name").text("");
	$(".js-suggest").find(".js-city").text("");
	changeWorkElement("reset");
	if ($(".js-active").find(".js-name:first").text() == "") {
		if ($(".js-active").find(":input:first").hasClass("date")) {
			showElement(".js-active");
			autoSetTime();
			$(".js-active").removeClass("js-active").next().addClass("js-active");
			$(".js-section").removeClass("active-section"); 
			$(".js-active").addClass("active-section"); 
			showElement(".js-active");
			showElement(".spinnter");
			requestRoute();
		}
		else {
			if ($(".js-active").children().hasClass("search-results")) {
				showElement(".js-active");
				showElement(".spinnter");
				requestRoute();
			}
			else
				showElement(".js-active").children(".js-input").show();
		}
				
	}
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
	var dataValid = false;

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

		$(".js-active").find(".js-name").text(day + "." + month + "." + year + ", ")
		$(".js-active").find(".js-city").text(hours + ":" + minutes);
		hideElement(".js-input");
		dataValid = true;
	}
	return dataValid;
}
function submitTime() {
	var dataValid;
	dataValid = selectTime();
	if (dataValid)
		activedNextSection();
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
	showElement("#cancel");
	showElement(".spinner");
	if (date[2].length == 2) {
		date[2] = "20" + date[2];
	}
	url += "startBusStationId=" + fromStop;
	url += "&endBusStationId=" + toStop;
	url += "&yyyymmddhhmm=" + date[2] + date[1] + date[0] + time;
	hideElement(".js-suggest");
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
		$(".js-active").find(".js-suggest").show();
		hideElement(".spinner");
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
	
	hours = parseInt(duration[0]);
	mins = parseInt(duration[1]);
	if (hours == 0) {
		hours = "";
	} else {
		hours = hours + "h ";
	}
	if (mins == 0) {
		mins = "";
	} else {
		mins = mins + "min";
	}
	
	duration = hours + mins;
	
	if (transfers == 0)
		transfers = "";
	else if (transfers == 1)
		transfers = "1 change";
	else if (transfers > 1)
		transfers += " changes ";
	
	$(".js-work").find(".js-name").text(depTime + " - " + arrTime);
	$(".js-work").find(".js-city").text(duration + ", " +  transfers);
	changeWorkElement();
	
}

function splitBusstopName(busstopName) {
	var i = (lang == "de") ? 1 : 0;
	busstopName = busstopName.split(" - ")[i].split("(")[1].split(") ");
	return busstopName;
}
function showDetails(resultNumber) {
	var routeData;
	showDetailsSection();
	// jump to the details section
	$(".js-active").removeClass("js-active");
	$("#details").find(".js-section:first").addClass("js-active");
	$(".js-section").removeClass("active-section"); 
	$(".js-active").addClass("active-section"); 
	//hideElement(".js-section");
	showElement(".js-active");
	changeWorkElement("reset");
	hideElement(".js-suggest");

	routeData = parseDetails(resultNumber);
	for (var i = 0; i < routeData.length; i++)
		genDetailElement(routeData[i]);
}
function genDetailElement(routeData) {

	showElement(".js-work").find(".js-time:first").text(routeData.depTime);
	showElement(".js-work").find(".js-time:last").text(routeData.arrTime);
	showElement(".js-work").find(".js-name:first").text(routeData.depBusstop[1] + ", ");
	showElement(".js-work").find(".js-name:last").text(routeData.arrBusstop[1] + ", ");
	showElement(".js-work").find(".js-city:first").text(routeData.depBusstop[0]);
	showElement(".js-work").find(".js-city:last").text(routeData.arrBusstop[0]);

	changeWorkElement();
	if (routeData.waitTime != "")
		showElement(".js-work").find("p").text(routeData.waitTime);
	changeWorkElement();
}
// returns in Array of JSON depBusstop, arrBusstop, depTime, arrTime, lineNo, waitTime
function parseDetails(resultNumber){
	var connection = con_data[resultNumber].ConnectionList.Connection[0].ConSectionList.ConSection;
	var allBusstops;
	var nextDepTime;
	var waitTime;
	var walkTime;
	var conObj = new Object();
	var routeData = [];

	for (var i = 0; i < connection.length; i++) {
		conObj = new Object();
		waitTime = "";
		walkTime = "";
		//console.log(connection);
		if (connection[i].Journey.length > 0) {
			allBusstops = connection[i].Journey[0].PassList.BasicStop;
			//city, name
			conObj.depBusstop = splitBusstopName(allBusstops[0].Station.name);
			conObj.arrBusstop = splitBusstopName(allBusstops[allBusstops.length - 1].Station.name);
			// hours, minutes, days
			conObj.depTime = extractTime(allBusstops[0].Dep.Time);
			conObj.arrTime = extractTime(allBusstops[allBusstops.length - 1].Arr.Time);

			conObj.lineNo = connection[i].Journey[0].JourneyAttributeList.JourneyAttribute[3].Attribute.AttributeVariant[0].Text;
			
			if (i + 1 < connection.length) {
				nextDepTime = extractTime(connection[i + 1].Journey[0].PassList.BasicStop[0].Dep.Time);
				waitTime = calculateWaitingTime(conObj.arrTime, nextDepTime);
			}
		}
		else
			walkTime = calculateWaitingTime([0, 0, 0], connection[i].Walk[0].Duration.Time);

		conObj.arrTime = conObj.arrTime[0] + ":" + conObj.arrTime[1];
		conObj.depTime = conObj.depTime[0] + ":" + conObj.depTime[1];
		conObj.waitTime = (waitTime == "") ? "" : "Wait " ;
		conObj.waitTime += timeString(waitTime) 
		conObj.waitTime += (waitTime == "" || walkTime == "") ? "" : ", walk ";
		conObj.waitTime += (waitTime == "" && walkTime != "") ? "Walk " : "";
		conObj.waitTime += timeString(walkTime);
		routeData[i] = conObj;

	}
	return routeData;
}

function goBack() {
	showSearchSection();
}
function showSearchSection() {
	$("#back").removeClass("details-visible").addClass("details-hidden");
	$("#cancel").removeClass("search-hidden").addClass("search-visible");

	$("#details").removeClass("details-visible").addClass("details-hidden");
	$("#search").find(".js-section").show();
	$("#search").removeClass("search-hidden").addClass("search-visible");
	$("#search").find(".js-section:last").addClass("js-active");
	$(".js-active").find(".js-suggest").show();
}
function showDetailsSection() {
	$("#back").removeClass("details-hidden").addClass("details-visible");
	$("#cancel").removeClass("search-visible").addClass("search-hidden");

	$("#details").removeClass("details-hidden").addClass("details-visible");
	$("#search").removeClass("search-visible").addClass("search-hidden");
}
function toogleInput(element) {
	hideElement(".js-input").val("");
	hideElement(".js-input").children().text("");
	$(".js-active").find(".cancel-input").hide();

	if ($(element).parents(".js-section").hasClass("js-active")) {
		activedNextSection();
	}
	else {
	$(".js-section").removeClass("js-active");
	showElement(element).parents(".js-section").addClass("js-active");
	showElement(".js-active").children(".js-input").show();
	$(".js-section").removeClass("active-section"); 
	$(".js-active").addClass("active-section"); 
	$(".js-active").find(".cancel-input").show();
	changeWorkElement("reset");
	}
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
function calculateWaitingTime(timestamp1, timestamp2) {
	var startMin  = parseInt(timestamp1[1]);
	var endMin    = parseInt(timestamp2[1]);
	var startHour = parseInt(timestamp1[0]);
	var endHour   = parseInt(timestamp2[0]);
	var startDay  = parseInt(timestamp1[2]);
	var endDay    = parseInt(timestamp2[2]);
	
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
