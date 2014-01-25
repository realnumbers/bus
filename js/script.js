var SECTION = document.getElementsByClassName("js-section");
var lang = "it";
var form_stop;
var to_stop;
var matching_busstops = new Array(5);
var busstops = $.getJSON( "js/busstops.json", function(data) {
		autocom(0);
	});
if (navigator.language === "de") {
		lang = de;
}
clearPage();

function clearPage() {
	var i = 1;
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
	makeBlank(current_section);
	unBlank(current_section + 1);
	autocom(current_section);
	if (current_section === 0) {
			from_stop = matching_busstops[div_number].id;
	}
	if (current_section === 1) {
			to_stop = matching_busstops[div_number].id;
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
	SECTION[current_section].children[1].focus();
	addClass(current_section);
}
function selectTime(current_section) {
		console.log(SECTION[current_section]);
		var date_element = SECTION[current_section].children[1];
		var date = date_element.value;
		var time_element = SECTION[current_section].children[2];
		var time = time_element.value;

		if (date_element.validity.valid && time_element.validity.valid){ 
			SECTION[current_section].children[0].children[1].innerHTML = date + ", ";
			SECTION[current_section].children[0].children[2].innerHTML = time;
			makeBlank(current_section);
			getRoute(date,time);
			date = "";
			time = "";
			unBlank(current_section + 1);
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
	if (count_date.length == 2) {
		date[2] = "20" + date[2];
	}
	var url = "http://html5.sasabus.org/backend/sasabusdb/calcRoute?";
	url = url + "startBusStationId=" + from_stop;
	url = url + "&endBusStationId=" + to_stop;
	url = url + "&yyyymmddhhmm=" + date[2] + date[1] + date[0] + time;
$.ajax({
		dataType: "jsonp",
		jsonpCallback: "Callback",
		url: url,
	 	success: function(data) {
				console.log(data);
		}
});
}
