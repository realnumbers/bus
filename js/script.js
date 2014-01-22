var SECTION = document.getElementsByClassName("js-section");
var lang = "it";
var matching_busstops = new Array(5);
var busstops = $.getJSON( "js/busstops.json", function(data){
		autocom(0);
	});
if ( navigator.language === "de" ){
		lang = de;
}
clearPage();

function clearPage(){
	var i = 1;
	while ( i < SECTION.length ){
			SECTION[i].style.display = "none";
			i++;
	}
}
/*$.ajax({
		dataType: "jsonp",
		jsonpCallback: 'jsonCallback',
		url: 'http://html5.sasabus.org/backend/sasabusdb/calcRoute?startBusStationId=:1213:1214:&endBusStationId=:851:&yyyymmddhhmm=201401191724&callback=jsonCallback',
		success: function(data){
				console.log(data);
		}
});*/


function autocom(current_section){
	var i;
	var children = SECTION[current_section].children;
	var input_string = children[1].value;
	input_string = input_string.split(' ');

	i = 2
	while ( i < children.length ){
			children[i].children[0].innerHTML = "";
			children[i].children[1].innerHTML = "";
			i++;
	}
		
	data = busstops.responseJSON;
	i = 2;
	data[lang].every( function (element, index, array){
			var res = input_string.every( function (item, index, array){
					var pattern = new RegExp(item, "i");
					var found_match = element.label.match(pattern);

					if ( found_match != null ){
							return true;
					}
					else{
							return false;
					}

			});

			if ( res && i < children.length ){

					matching_busstops[i-2] = element;
					children[i].children[0].innerHTML = element.name+", ";
					children[i].children[1].innerHTML = element.city;
					i++;
			}
			if ( i >= children.length ){
					return false;
			}
			else{
					return true;
			}

});
}
function selectBusstop(current_section, div_number){
	SECTION[current_section].children[0].children[1].innerHTML = matching_busstops[div_number].name+", ";
	SECTION[current_section].children[0].children[2].innerHTML = matching_busstops[div_number].city;
	makeBlank(current_section);
	unBlank(current_section+1);
	if (current_section < 2){
		autocom(1);
	}
}
function makeBlank(current_section){
	var i = 1;
	while ( i < SECTION[current_section].children.length ){
			SECTION[current_section].children[i].style.display = "none";
			i++;
	}
}
function unBlank(current_section){
	var i = 0;
	while ( i < SECTION.length ){
			makeBlank(i);
			i++;
	}
	SECTION[current_section].style.display = "block";
	i = 0;
	while ( i < SECTION[current_section].children.length ){
			SECTION[current_section].children[i].style.display = "block";
			i++;
	}
}
function selectTime(current_section){
		var data = SECTION[current_section].children[1].value;
		var time = SECTION[current_section].children[2].value;
		SECTION[current_section].children[0].children[1].innerHTML = data;
		SECTION[current_section].children[0].children[2].innerHTML = time;
}
