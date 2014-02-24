//tmpUrl: dep, arr, time, date
localStorage.routeData = new Array();
var tmpUrl = new Array(4);
var lang = "it";
var matching_busstops = new Array(5);
var queryComplete = false;
var cancelled = false;

// localStorage by using cookies for IE 6,7
checkStorage();

if (!localStorage.busstops){
	$.getJSON( "js/busstops.json", function(data) {
		localStorage.setItem('busstops', JSON.stringify(data));
	});
}
if (navigator.language === "de") {
	lang = "de";
}

removeClickDelay();
onEnterEvent();
initApp();

function initApp() {
	hideElement(".js-section");
	hideElement("#cancel");
	hideElement("#back");
	hideElement(".cancel-input");
	$(".js-section:first").addClass("js-active");
	changeWorkElement("reset");
	$(":input").val("");
	$(".js-active").show();
	$(".js-name").text("");
	$(".js-city").text("");
	queryComplete = false;
	$(".collapse:eq(0)").hide();
	$(".collapse:eq(0)").slideToggle(200);      // show from input
	$(".collapse:eq(2)").hide();                // hide date inputs
	$(".js-active").find(".input:first").focus();
	// for test
	//tmpUrl: dep, arr, time, date
	/*tmpUrl[0] = ":1213:1214:";
	tmpUrl[1] = ":672:673:";
	tmpUrl[2] = "10:20";
	tmpUrl[3] = "10/03/2014";
	hideElement(".js-input");
	$(".js-active").find(".js-name:first").text("Test, ");
	activateNextSection();
	showElement(".js-active").children(".js-input").show();
	hideElement(".js-input");
	$(".js-active").find(".js-city:first").text("City");
	activateNextSection();
	*/
}
function busstopsJSON() {
	return JSON.parse(localStorage.busstops);
}
function pushRouteData(index) {
	localStorage.routData += JSON.stringify(routeData);
}
function getRouteData(index) {
	return JSON.parse(localStorage.routeData)[index];
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

function checkStorage() {
	if (!window.localStorage) {
	window.localStorage = {
		getItem: function (sKey) {
			if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
				return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		},
		key: function (nKeyId) {
				return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
		},
		setItem: function (sKey, sValue) {
			if(!sKey) { return; }
				 document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				 this.length = document.cookie.match(/\=/g).length;
		},
		length: 0,
		removeItem: function (sKey) {
			if (!sKey || !this.hasOwnProperty(sKey)) { return; }
				document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				this.length--;
		},
		hasOwnProperty: function (sKey) {
			return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		}
		};
		window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
	}
}
function removeClickDelay() {
	// Eliminates 300ms click delay on mobile 
	window.addEventListener('load', function() {
			new FastClick(document.body);
			}, false);
}

$("#details").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
	if (!$("#details").find(".js-section").hasClass("js-active")) {
		hideElement("#details");
		hideElement("#back");
	}	
});

function hideElement(element) {
	return $(element).hide();
}
function showElement(element) {
	return $(element).show();
}
function cancelQuery() {
	$(".input-section-visible:not(:eq(0))").removeClass("input-section-visible").addClass("input-section-hidden");
	cancelled = true;
}
$(".js-section").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
	if (queryComplete && cancelled) {
		cancelled = false;
		initApp();
	}
	if (!queryComplete && $(".js-active").find(".input:first").hasClass("date")) {
		startLoadingResults();
	}
});
function autocom() {
	var inputString = $(".js-active").find(".js-input").val();
	var i = 0;	
	hideElement(".js-suggest");
	changeWorkElement("reset");

	if (inputString !== "") {
		inputString = inputString.split(" ");

		//Match every busstop from data
		var resMatch = busstopsJSON()[lang].every( function (element, index, array) {
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
				$(".js-active").children(".collapse").children(".js-work").children(".js-name").text(element.name + ", ");
				$(".js-active").children(".collapse").children(".js-work").children(".js-city").text(element.city);
				showElement(".js-work");
				changeWorkElement();
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
	if (tmpUrl[0] == null)
		tmpUrl[0] = matching_busstops[resultNumber].id;
	else
		tmpUrl[1] = matching_busstops[resultNumber].id;
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
function hideCollapsedContent() {
	$(".js-suggest").find(".js-name").text("");
	$(".js-suggest").find(".js-city").text("");
	if (!queryComplete && $(".js-active").hasClass("input-section-hidden")) {
		$(".js-active").show();
		$(".js-active").removeClass("input-section-hidden");
		$(".js-active").addClass("input-section-visible");
	}
	if (queryComplete && $(".js-active").children().hasClass("search-results")) {
		$(".js-active").prev().show();
		$(".js-active").prev().removeClass("input-section-hidden");
		$(".js-active").prev().addClass("input-section-visible");
	}
}
function startLoadingResults() {
	$(".js-active").removeClass("js-active").next().addClass("js-active");
	$(".js-section").removeClass("active-section");
	$(".js-active").addClass("active-section");
	showElement(".js-active");
	$(".spinner").css('display', 'block');
	queryComplete = true;
	requestRoute();
}
function activateNextSection() {
	$(".js-active").removeClass("js-active").next().addClass("js-active");
	$(".js-section").removeClass("active-section js-active-input");
	$(".js-active").addClass("active-section");
	if ($(".js-active").children(".collapse").find(".date").length == 0 && !queryComplete) {
		$(".js-active").find(".collapse").show();
	}
	changeWorkElement("reset");
	if ($(".js-active").find(".js-name:first").text() == "") {
		if ($(".js-active").find(".input:first").hasClass("date")) {
			showElement(".js-active");
			autoSetTime();
		}
		else {
			if ($(".js-active").children().hasClass("search-results")) {
				showElement(".js-active");
				showElement(".spinnter");
				queryComplete = true;
				requestRoute();
			}
			else {
				showElement(".js-active").find(".js-input").show();
				$(".js-active").find(".input:first").focus();
			}
		}
				
	}
	else activateNextSection();
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

		tmpUrl[2] = hours + ":" + minutes;
		tmpUrl[3] = day + "." + month + "." + year;
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
	hideElement(".js-suggest");
	changeWorkElement("reset");
	for (var i = 0; i < localStorage.routeData.length; i++) {
		if (localStorage.routData[i] != null) {
			loadOverview(data, i);
		}
	}
	hideElement(".spinner");
	$(".js-active").find(".js-suggest").show();
}
function requestRoute(apiData) {
	showElement("#cancel");
	showElement(".spinner");
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
	$.ajax({
		dataType: "jsonp",
		jsonpCallback: "Callback",
		url: url,
	 	success: function(data) {
			//hideKeyboard();
			requestId = data.ConResCtxt[0].split("#")[0];
			nextData(requestId, 1);
			localStorage = parseData(data);
			queryComplete = true;
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
				nextData(requestId, parseInt(count) + 1);
				localStorage.routeData[count] = parseData(data);
			}
		});		
	}
}
function parseData(data) {
	var routeData = new Object;
	if (data.ConnectionList != null) {
		routeData.overview = parseOverview(data);
		routeData.connection = parseDetails(data);
		return routeData;
	}
	else
		return null;
}
function parseOverview(data) {
	var overview = new Object;
	var con = data.ConnectionList.Connection[0].Overview;
	var arrTime = con.Arrival.BasicStop.Arr.Time;
	var depTime = con.Departure.BasicStop.Dep.Time;
	var duration = con.Duration.Time;
	var transfers = con.Transfers;

	overview.arrTime = extractTime(arrTime);
	overview.depTime = extractTime(depTime);

	duration = calculateWaitingTime([0, 0, 0], extractTime(duration));
	overview.duration = timeString(duration);
	
	if (transfers == 0)
		transfers = "";
	else if (transfers == 1)
		transfers = "1 change";
	else if (transfers > 1)
		transfers += " changes ";
	overview.transfers = transfers;
	return overview;
}
function loadOverview(data, resultPointer) {
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
// returns in Array of JSON depBusstop, arrBusstop, depTime, arrTime, lineNo, waitTime
function parseDetails(data){
	var connection = data.ConnectionList.Connection[0].ConSectionList.ConSection;
	var arrTime = "";
	var allBusstops;
	var nextDepTime;
	var waitTime;
	var walkTime;
	var conObj = new Object();
	var routeData = [];
	var node = 0;
	for (var i = 0; i < connection.length; i++) {
		waitTime = "";
		walkTime = "";
		if (connection[i].Journey.length > 0) {
			if (routeData[node] != undefined)
				node++;
			conObj = new Object();
			arrTime = "";
			allBusstops = connection[i].Journey[0].PassList.BasicStop;
			//city, name
			conObj.depBusstop = splitBusstopName(allBusstops[0].Station.name);
			conObj.arrBusstop = splitBusstopName(allBusstops[allBusstops.length - 1].Station.name);
			// hours, minutes, days
			conObj.depTime = extractTime(allBusstops[0].Dep.Time);
			arrTime = extractTime(allBusstops[allBusstops.length - 1].Arr.Time);
			conObj.arrTime = arrTime;

			conObj.lineNo = connection[i].Journey[0].JourneyAttributeList.JourneyAttribute[3].Attribute.AttributeVariant[0].Text;
			
			if (i + 1 < connection.length && connection[i + 1].Journey.length > 0) {
				nextDepTime = extractTime(connection[i + 1].Journey[0].PassList.BasicStop[0].Dep.Time);
				waitTime = calculateWaitingTime(conObj.arrTime, nextDepTime);
				conObj.waitTime = (waitTime == "") ? conObj.waitTime : "Wait " ;
				conObj.waitTime += timeString(waitTime) 
			}
			else
				conObj.waitTime = "";

			conObj.arrTime = conObj.arrTime[0] + ":" + conObj.arrTime[1];
			conObj.depTime = conObj.depTime[0] + ":" + conObj.depTime[1];
			routeData[node] = conObj;
		}
		else {

			if (connection[i + 1].Journey.length > 0 && arrTime != "") {
				nextDepTime = extractTime(connection[i + 1].Journey[0].PassList.BasicStop[0].Dep.Time);
				waitTime = calculateWaitingTime(arrTime, nextDepTime);
				conObj.waitTime = (waitTime == "") ? conObj.waitTime : "Wait " ;
				conObj.waitTime += timeString(waitTime) 
			}

			walkTime = calculateWaitingTime([0, 0, 0], extractTime(connection[i].Walk[0].Duration.Time));
			waitTime = conObj.waitTime;

			if (waitTime == undefined)
				waitTime = "";
			walkTime = timeString(walkTime);
			waitTime += (waitTime == "" || walkTime == "") ? "" : ", walk ";
			waitTime += (waitTime == "" && walkTime != "") ? "Walk " : "";
			waitTime += walkTime;
			conObj.waitTime = waitTime;
			routeData[node] = conObj;

			conObj = new Object();
		}

	}
	return routeData;
}

function showSearchSection() {
	$(".js-section").removeClass("js-active active-section");
	$("#search").find(".js-section").show();
	$("#search").find(".js-section:last").addClass("js-active active-section");
	$(".js-active").find(".js-suggest").show();
	$("#cancel").removeClass("search-hidden").addClass("search-visible");
	$("#search").removeClass("search-hidden").addClass("search-visible");
	$("#back").removeClass("details-visible").addClass("details-hidden");
	$("#details").removeClass("details-visible").addClass("details-hidden");
}
function showDetailsSection() {
	showElement("#details");
	showElement("#back");
	$("#cancel").removeClass("search-visible").addClass("search-hidden");
	$("#search").removeClass("search-visible").addClass("search-hidden");

	$("#back").removeClass("details-hidden").addClass("details-visible");
	$("#details").removeClass("details-hidden").addClass("details-visible");
}
function goBack() {
	showSearchSection();
}
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
