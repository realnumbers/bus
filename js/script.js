var SECTION = document.getElementsByClassName("js-section");
var back = document.getElementById("back");
var cancel = document.getElementById("cancel");
var con_data = new Array(5);
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

clearPage(1);
hideIcon(back);
hideIcon(cancel);

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
	SECTION[current_section].className = "js-section";
}
function activateInput(current_section) {
	unBlank(current_section);
	showAllLabels();
	SECTION[current_section].children[0].children[1].style.display =  "none";
	SECTION[current_section].children[0].children[2].style.display = "none";
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
	//console.log(currentdate);
	//SECTION[2].children[1].value = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear();
  //SECTION[2].children[2].value = currentdate.getHours() + ":" + currentdate.getMinutes();

	SECTION[2].children[1].value = "27/02/2014";
  	SECTION[2].children[2].value = "13:20";
	showAllLabels();
	selectTime(2);
}
function selectTime(current_section) {
	var date_element = SECTION[current_section].children[1];
	var date = date_element.value;
	var time_element = SECTION[current_section].children[2];
	var time = time_element.value;
	
	if (date_element.validity.valid && time_element.validity.valid){ 
		SECTION[current_section].children[0].children[1].innerHTML = date + ", ";
		SECTION[current_section].children[0].children[2].innerHTML = time;
		makeBlank(current_section);
		showAllLabels();
		getRoute(date,time);
		time_element.value = "";
		date_element.value = "";
	}
}
function addClass(current_section) {
	SECTION[current_section].className += " active-section";
}
function removeClass(current_section) {
	SECTION[current_section].className = "js-section";
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
			showIcon(cancel);
			
			//console.log(data);
			loadConnection(data, 0);
			
			requestId = data.ConResCtxt[0];
			//console.log(requestId);
			
			requestId = requestId.split("#")[0];
			nextData(data, requestId, 1);
		}
	});	
}
function nextData(data, requestId, count) {
	if (count < 5) {
		//console.log(requestId);

		var nextUrl = "http://html5.sasabus.org/backend/sasabusdb/nextRoute?context=";
		nextUrl = nextUrl + requestId;
		nextUrl = nextUrl + "%23";
		nextUrl = nextUrl + count;
	
		//console.log(nextUrl);
		$.ajax({
			dataType: "jsonp",
			jsonpCallback: "Callback",
			url: nextUrl,
		 	success: function(data) {
				//console.log(data);
				loadConnection(data, count);
				//console.log(requestId);
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
	con_data[resultPointer]	= data;
	//console.log(con_data);
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
		transfers = "no transfers";
	if (transfers == 1)
		transfers = "1 transfer";
	if (transfers > 1)
		transfers += " transfers ";

	overview_section.children[resultPointer].children[0].innerHTML = dep_time + " - " + arr_time;
	overview_section.children[resultPointer].children[1].innerHTML = duration + ", " + transfers;
	
	hideSpinner();
}
function cancelQuery() {
	hideIcon(cancel);
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
function splitBusstopName(busstopName) {
	busstopName = busstopName.split("(")[1].split(") ");
	return busstopName;
}
function showDetails(resultNumber) {
	
	clearPage(0);
	unBlank(4);
	hideIcon(cancel);
	showIcon(back);

	var connection = con_data[resultNumber].ConnectionList.Connection[0].ConSectionList.ConSection;
	var i = 0;
	var TRANS_BLOCK = document.getElementsByClassName("transit-block");
	var W_BLOCK = document.getElementsByClassName("intermediate-block");
	var walkTime = "";
	while (i < connection.length) {
		walkTime = "";
		if (connection[i].Journey.length > 0) {
			var lineNo = connection[i].Journey[0].JourneyAttributeList.JourneyAttribute[3].Attribute.AttributeVariant[0].Text;
			var stops = connection[i].Journey[0].PassList.BasicStop;
			var arrBusstop = stops[stops.length -1].Station.name.split(" - ");
			var depBusstop = stops[0].Station.name.split(" - ");
			var dep = stops[0].Dep.Time;
			var arr = stops[stops.length - 1].Arr.Time;
			var depTime = extractTime(dep);
			var arrTime = extractTime(arr);
			TRANS_BLOCK[i].children[0].children[0].innerHTML = depTime[0] + ":" + depTime[1];
			TRANS_BLOCK[i].children[2].children[0].innerHTML = arrTime[0] + ":" + arrTime[1];
			TRANS_BLOCK[i].children[1].children[1].innerHTML = "Bus line " + lineNo;
			console.log(connection);
			if (lang === "de") {
				arrBusstop = splitBusstopName(arrBusstop[1]);
				depBusstop = splitBusstopName(depBusstop[1]);
			}
			else {
				arrBusstop = splitBusstopName(arrBusstop[0]);
				depBusstop = splitBusstopName(depBusstop[0]);
			}
			TRANS_BLOCK[i].children[0].children[1].children[0].innerHTML  = depBusstop[1] + ", ";
			TRANS_BLOCK[i].children[0].children[1].children[1].innerHTML  = depBusstop[0];
			TRANS_BLOCK[i].children[2].children[1].children[0].innerHTML  = arrBusstop[1] + ", ";
			TRANS_BLOCK[i].children[2].children[1].children[1].innerHTML  = arrBusstop[0];
		}
		else if (connection[0].Walk.length > 0) {
			console.log("Walk");
			console.log(connection[i].Walk);
			walkTime = ", Walk " + connection[i].Walk;

		}
		if (i < connection.length - 1) {
			var nextDepTime = connection[i + 1].Journey[0].PassList.BasicStop[0].Dep.Time;
			console.log(arr);
			console.log(nextDepTime);
			var waitTime = calculateWaitingTime(arr, nextDepTime);
			W_BLOCK[i].children[1].innerHTML = waitTime + walkTime;
		}


	i++;	
	}
	//console.log(TRANS_BLOCK);
	while (i < TRANS_BLOCK.length) {
		TRANS_BLOCK[i].style.display = "none";

		//console.log(i);
			W_BLOCK[i-1].style.display = "none";
		i++;
	}
}
function goBack() {
	clearPage(0);
	unBlank(0);
	unBlank(1);
	unBlank(2);
	unBlank(3);
	showAllLabels();
	hideIcon(back);
	showIcon(cancel);
	hideSpinner();
}
function extractTime (timestamp) {
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
	
	var waitTimeDays = 0;
	var waitTimeHours = 0;
	var waitTimeMinuts = 0;
	var waitTimeString = "";
	startMin += (startHour * 60 + startDay * 1440);
	endMin += (endHour * 60 + endDay * 1440);
	waitTime = (endMin - startMin);
	if (waitTime / 60 >= 1) {
		if (waitTime / 1440 >= 1) {
			waitTimeDays = waitTime / 1440;
			waitTimeDays = waitTimeDays.toFixed(0);
		}
		waitTimeHours = waitTime / 60 - waitTimeDays * 1440;
	}
	waitTimeMinuts = waitTime - waitTimeHours * 60;
			
	waitTimeString = "Wait ";
	waitTimeString += (waitTimeDays != 0) ? waitTimeDays + " Day" : "";
	waitTimeString += (waitTimeDays > 1) ? "s" : "";
	waitTimeString += (waitTimeString != "Wait ") ? ", " : "";
	waitTimeString += (waitTimeHours != 0) ? waitTimeHours + " Hour" : "";
	waitTimeString += (waitTimeHours > 1) ? "s" : "";
	waitTimeString += (waitTimeString != "Wait ") ? ", " : "";
	waitTimeString += (waitTimeMinuts != 0) ? waitTimeMinuts + " Minut" : "";
	waitTimeString += (waitTimeMinuts > 1) ? "s" : "";

	return waitTimeString;
}
