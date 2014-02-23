//tmpUrl: dep, arr, time, date
var history = window.History;
var tmpUrl = new Array(4);
var lang = "it";
var matching_busstops = new Array(5);
var previousHistoryState = 0;
// For IE 6,7 creats a localStorage by using cookies
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

history.Adapter.bind(window,'statechange',function() {
	var state = history.getState();
	if (state.data.detail > previousHistoryState) {
		changeToDetails(state.data.detail);	
	}
	else {
		if (state.data.detail == previousHistoryState && state.data.detail == 0) {
			console.log("Same Page");
			if (state.data.dep == undefined)
				initApp();
			else {
			}
		}
		else
			showSearchSection(); 
	}
	previousHistoryState = state.data.detail;	
});

//window.onpopstate = function(event) {
//};

console.log(localStorage);
function initApp() {
	//alert("Hello");
	//localStorage.routeData = "";
	hideElement(".js-section").removeClass("js-active").removeClass("active-section");
	hideElement("#cancel");
	hideElement("#back");
	hideElement(".cancel-input");
	$(".js-section:first").addClass("js-active active-section");
	changeWorkElement("reset");
	$(":input").val("");
	showElement(".js-active").children(".js-input").show();
	$(".js-name").text("");
	$(".js-city").text("");
	// for test
	//tmpUrl: dep, arr, time, date
	/*tmpUrl[0] = ":1213:1214:";
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
	*/

	loadUrlData();
}
function loadUrlData() {
	var tmpData = history.getState().data;
	var urlData = new Object();
	if (history.getPageUrl().split("?")[1] != undefined)
		urlData = JSON.parse("{\"" + history.getPageUrl().split("?")[1].replace(/&/g, "\", \"").replace(/=/g, "\":\"") +"\"}");
	if (tmpData.dep == null && urlData.dep != null && urlData.arr != null && urlData.time != null && urlData.date != null && urlData.detail != null) {
		tmpData = urlData;
		replaceUrl(tmpData);
	}
	if (tmpData.dep != null && tmpData.detail == 0) {
	//tmpUrl: dep, arr, time, date
	tmpUrl[0] = tmpData.dep;
	tmpUrl[1] = tmpData.arr;
	tmpUrl[2] = tmpData.time;
	tmpUrl[3] = tmpData.date;
	hideElement(".js-input");
	$(".js-active").find(".js-name:first").text("Busstop,");
	$(".js-active").find(".js-city:first").text("City");
	activedNextSection();
	hideElement(".js-input");
	showElement(".js-active").children(".js-input").show();
	$(".js-active").find(".js-name:first").text("Busstop2,");
	$(".js-active").find(".js-city:first").text("City2");
	$(".js-suggest").hide();
	activedNextSection();
	}
	else {
		if (tmpData.dep == null) {
			var tmpData = new Object();
			tmpData.detail = 0;
			history.replaceState(tmpData, "Bus", "?detail=0");
		}
		else {
			tmpData.detail = 0;
			if (JSON.stringify(tmpData) == JSON.stringify(getRouteData()[0].stamp)) {
				console.log("Go to detail view");
				changeToDetails(tmpData.detail);	
			}
		}
	}

}
function replaceUrl(dataUrl) {
	history.replaceState(dataUrl, "Bus", "?dep=" + dataUrl.dep + "&arr=" + dataUrl.arr + "&date=" + dataUrl.date + "&time=" + dataUrl.time + "&detail=" + dataUrl.detail);
}
function updateUrl(dataUrl) {
	history.pushState(dataUrl, "Bus", "?dep=" + dataUrl.dep + "&arr=" + dataUrl.arr + "&date=" + dataUrl.date + "&time=" + dataUrl.time + "&detail=" + dataUrl.detail);

}
function busstopsJSON() {
	return JSON.parse(localStorage.busstops);
}
function pushRouteData(data) {
	var tmpStorage = localStorage.routeData;
	if (tmpStorage === "") {
		tmpStorage = "[";
		tmpStorage += JSON.stringify(data) + "]";
	}
	else {
		tmpStorage = tmpStorage.substring(0, tmpStorage.length - 1) + ",";
		tmpStorage += JSON.stringify(data) + "]";
	}
	localStorage.routeData = tmpStorage;
}
function getRouteData() {
	return JSON.parse(localStorage.routeData);
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
	var tmpData = new Object();
	tmpData.detail = 0;
	history.pushState(tmpData, "Bus", "?detail=0");
	initApp()
}
function autocom() {
	var inputString = $(".js-active").children(".js-input").val();
	var i = 0;	
	hideElement(".js-suggest");

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
	if (tmpUrl[0] == null)
		tmpUrl[0] = matching_busstops[resultNumber].id;
	else
		tmpUrl[1] = matching_busstops[resultNumber].id;
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
	if (history.getState().data.time == undefined) {
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
		$(".date").val(history.getState().data.date);
		$(".time").val(history.getState().data.time);
	}

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
function showRoute() {
	var routeData = getRouteData();
	hideElement(".js-suggest");
	changeWorkElement("reset");
	for (var i = 0; i < routeData.length; i++) {
			if (routeData[i] != null)
				loadOverview(routeData[i].overview);
	}
	$(".js-active").find(".js-suggest").show();
	showElement(".js-time");
	showElement(".js-duration");
	hideElement(".spinner");
}
function requestRoute(apiData) {
	if (localStorage.routeData == "" || JSON.stringify(getRouteData()[0].stamp) != JSON.stringify(history.getState().data)) {
	var tmpData = new Object();
	tmpData.time = tmpUrl[2];
	tmpData.date = tmpUrl[3];
	tmpData.dep = tmpUrl[0];
	tmpData.arr = tmpUrl[1];
	tmpData.detail = 0;
	showElement("#cancel");
	showElement(".spinner");
	
	localStorage.routeData = "";
	updateUrl(tmpData);
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
			pushRouteData(parseData(data));
		}
	});	
	}
	else
		showRoute();
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
				pushRouteData(parseData(data));
			}
		});		
	}
	else
		showRoute();
}
function parseData(data) {
	var routeData = new Object;
	if (data.ConnectionList != null) {
		routeData.overview = parseOverview(data);
		routeData.connection = parseDetails(data);
		routeData.stamp = history.getState().data;
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

	arrTime = extractTime(arrTime);
	depTime = extractTime(depTime);

	overview.arrTime = arrTime[0] + ":" + arrTime[1];
	overview.depTime = depTime[0] + ":" + depTime[1];
	duration = calculateWaitingTime([0, 0, 0], extractTime(duration));
	transfers = (transfers == 0) ? "" : ((transfers == 1) ? ", 1 change" : ", " + transfers + " changes ");
	overview.duration = timeString(duration) + transfers;
	
	return overview;
}
function loadOverview(data) {
	$(".js-work").find(".js-time").text(data.depTime + " - " + data.arrTime);
	$(".js-work").find(".js-duration").text(data.duration);
	changeWorkElement();
}

function splitBusstopName(busstopName) {
	var i = (lang == "de") ? 1 : 0;
	busstopName = busstopName.split(" - ")[i].split("(")[1].split(") ");
	return busstopName;
}
function showDetails(resultNumber) {
	var tmpData = history.getState().data;
	tmpData.detail = resultNumber + 1;
	updateUrl(tmpData);
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
	hideElement(".js-suggest");

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
	history.back();
	showSearchSection();
}
function toggleInput(element) {
	hideElement(".js-time");
	hideElement(".js-duration");
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
