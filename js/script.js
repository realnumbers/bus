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
			console.log(i);
			children[i].children[0].innerHTML = "";
			children[i].children[1].innerHTML = "";
			i++;
	}
	if (input_string != "") {
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
	addClass(current_section);
}
function selectTime(current_section) {
		var data = SECTION[current_section].children[1].value;
		var time = SECTION[current_section].children[2].value;
		SECTION[current_section].children[0].children[1].innerHTML = data + ", ";
		SECTION[current_section].children[0].children[2].innerHTML = time;
		getRoute(data,time);
}
function addClass(current_section) {
	SECTION[current_section].className += " active-section";
}
function removeClass(current_section) {
	SECTION[current_section].className = "js-section";
}
function getRoute(data, time) {
	data = data.replace(/\//g, ":");
	data = data.replace(/\./g, ":");
	data = data.split(":");
	console.log(data);
	time = time.replace(":", "");
	var url = "http://html5.sasabus.org/backend/sasabusdb/calcRoute?";
	url = url + "startBusStationId=" + from_stop;
	url = url + "&endBusStationId=" + to_stop;
	url = url + "&yyyymmddhhmm=" + data[2] + data[1] + data[0] + time;
$.ajax({
		dataType: "jsonp",
		jsonpCallback: "Callback",
		url: url,
	 	success: function(data) {
				console.log(data);
		}
});
}
