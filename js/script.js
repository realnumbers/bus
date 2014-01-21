var SECTION = document.getElementsByClassName("js-section");
var current_section = 0;
var lang = "it";
var selected_busstop = new Array(5);
var busstops = $.getJSON( "js/busstops.json", function(data){
		autocom();
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


function autocom(){
	var i;
	var children = SECTION[current_section].children;
	var input_string = children[1].value;
	input_string = input_string.split(' ');

	i = 2
	while ( i < children.length ){
			children[i].innerHTML = "";
			i++;
	}
		
	console.log("Input Changed");
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

					console.log(element);
					children[i].innerHTML = element.name+", "+element.city;
					i++;
			}
			if ( i >= children.length )
					return false;
			else
					return true;

});
}
 function selectBusstop(div_number){
	document.getElementsByClassName("line-big")[selected_option].innerHTML = selected_busstop[div_number].name+", ";
	document.getElementsByClassName("line-small")[selected_option].innerHTML = selected_busstop[div_number].city;
	selected_option++;
	showInput(selected_option, selected_option -1);
 }
 function showInput(section, pre_section){
console.log(section);
	document.getElementsByClassName("section-input")[section].style.display = "block";
	document.getElementById("input-"+section).style.display = "block";
	document.getElementById("input-"+pre_section).style.display = "none";
	selected_option = section;
}
function changeSection(to_section){
		removeSection();
		selected_option = to_section;
		addSection();
}
