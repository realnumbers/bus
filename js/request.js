//loads the ? arguments into Status data
function loadUrlData() {
	if (History.getPageUrl().split("?")[1]) {
		var urlData = JSON.parse("{\"" +
		History.getPageUrl().
												split("?")[1].
												replace(/&/g, "\", \"").
												replace(/=/g, "\":\"") +
												"\"}");

		urlData = unStringUndefined(urlData);
		if (urlData.detail > 0) {
			console.log("Detail view");
			addState(urlData);
		}
		else
			replaceUrl(urlData);
		return true;
	}
	return false;
}
function addState(data) {
	var tmpDetail = data.detail;
	data.detail = 0;
	replaceUrl(data);
	data.detail = tmpDetail;
	pushUrl(data);
}
function getBusstopById(id) {
	var busstop = new Object();
	var busstopList = getBusstops();
	if (lang == "de")
		busstopList = busstopList.de;
	else
		busstopList = busstopList.it;

	for (var i = 0; i < busstopList.length; i++)
		if (busstopList[i].id == id) 
			return busstopList[i];
	return false;

}
function compareDataInput(data1, data2) {
	if (validateUrlData(data1) && validateUrlData(data2))
		if (data1.dep == data2.dep)
			if (data1.arr == data2.arr)
				if (data1.date == data2.date)
					if (data1.time == data2.time)
						return true;
	return false;
}

function validateUrlData(data) {
	if (data.dep != undefined)
		if (data.arr != undefined)
			if (data.date != undefined)
				if (data.time != undefined)
					if (data.detail != undefined)
						return true;
	return false;
}
function unStringUndefined (data) {
	if (data.dep == "undefined")
		data.dep = undefined;
	if (data.arr == "undefined")
		data.arr = undefined;
	if (data.date == "undefined")
		data.date = undefined;
	if (data.time == "undefined")
		data.time = undefined;
	if (data.detail == "undefined")
		data.detail = undefined;
						
	return data;
}
		
// replaces the current Url state with the new State
function replaceUrl(dataUrl) {
	History.replaceState(dataUrl, "Bus",
	"?dep=" + dataUrl.dep + 
	"&arr=" + dataUrl.arr + 
	"&date=" + dataUrl.date + 
	"&time=" + dataUrl.time + 
	"&detail=" + dataUrl.detail);
}

// adds a new history entry with the new url
function pushUrl(dataUrl) {
	History.pushState(dataUrl, "Bus", 
	"?dep=" + dataUrl.dep + 
	"&arr=" + dataUrl.arr + 
	"&date=" + dataUrl.date + 
	"&time=" + dataUrl.time + 
	"&detail=" + dataUrl.detail);
}

// return the busstop list as json witch is saved in the localStorage
function getBusstops() {
	return JSON.parse(localStorage.busstops);
}

// attachs a JSON to the existing JSON in localStorage
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

//return the Api data form localeStorage
function getRouteData() {
	if (localStorage.routeData != undefined)
		return JSON.parse(localStorage.routeData);
	else
		return undefined;
}

function requestRoute(UrlData) {
	var stamp = History.getState().data;
	// Data form the Url
	var date = UrlData.date;
	var fromStop = UrlData.dep;
	var toStop = UrlData.arr;
	var time = UrlData.time;
	//base url
	var url = "http://html5.sasabus.org/backend/sasabusdb/calcRoute?";
	var requestId;
	date = date.replace(/\//g, ".");
	date = date.split(".");
	date = date[2] + date [1] + date[0];
	time = time.replace(":", "");

	url += "startBusStationId=" + fromStop;
	url += "&endBusStationId=" + toStop;
	url += "&yyyymmddhhmm=" + date + time;
	$.ajax({
		dataType: "jsonp",
		jsonpCallback: "Callback",
		url: url,
	 	success: function(data) {
			if (data.ConnectionList) {
				localStorage.routeData = "";
				pushRouteData(stamp);
				requestId = data.ConResCtxt[0].split("#")[0];
				nextData(requestId, 1);
				pushRouteData(parseData(data));
			}
			else {
				alert("Error");
				console.log("Error");
				console.log(data);
			}
		}
	});	
}

function nextData(requestId, count, view) {
		var nextUrl = "http://html5.sasabus.org/backend/sasabusdb/nextRoute?context=";
		nextUrl += requestId;
		nextUrl += "%23";
		nextUrl += count;

		$.ajax({
			dataType: "jsonp",
			jsonpCallback: "Callback",
			url: nextUrl,
		 	success: function(data) {
				pushRouteData(parseData(data));
				if (count < 4 )
					nextData(requestId, parseInt(count) + 1, view);
				else {
					$.event.trigger({
						type: "requestComplete"
					});
				}
			}
		});		
}

function parseData(data) {
	var routeData = new Object;
	if (data.ConnectionList != null) {
		routeData.overview = parseOverview(data);
		routeData.connections = parseDetails(data);
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

function splitBusstopName(busstopName) {
	var i = (lang == "de") ? 1 : 0;
	busstopName = busstopName.split(" - ")[i].split("(")[1].split(") ");
	return busstopName;
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

			if ((i + 1) < connection.length && connection[i + 1].Journey.length > 0 && arrTime != "") {
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
	waitTimeString += (waitTimeString != "" && (waitTimeHours != 0 || waitTimeMinuts != 0)) ? ", " : "";
	waitTimeString += (waitTimeHours != 0) ? waitTimeHours + " hour" : "";
	waitTimeString += (waitTimeHours > 1) ? "s" : "";
	waitTimeString += (waitTimeString != "" && waitTimeMinuts != 0) ? ", " : "";
	waitTimeString += (waitTimeMinuts != 0) ? waitTimeMinuts + " minute" : "";
	waitTimeString += (waitTimeMinuts > 1) ? "s" : "";

	return waitTimeString;
}

function Callback() {}
