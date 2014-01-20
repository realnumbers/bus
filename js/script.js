var data_ready = false;
var lang = "it";
var selected_option = 0;
var selected_busstop = new Array(5);
var busstops = $.getJSON( "js/busstops.json", function(data){
		//console.log("success");
		//console.log(data);
		data_ready = true;
		autocom();
	});
//console.log(busstops);
if ( navigator.language === "de" ){
		lang = de;
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
		var i = 0;
		var value = document.getElementById("to-input").value;
		var value_list = value.split(' ');

		document.getElementsByClassName("suggest-element")[0].innerHTML = "";
		document.getElementsByClassName("suggest-element")[1].innerHTML = "";
		document.getElementsByClassName("suggest-element")[2].innerHTML = "";
		document.getElementsByClassName("suggest-element")[3].innerHTML = "";
		document.getElementsByClassName("suggest-element")[4].innerHTML = "";
		data = busstops.responseJSON;
		//console.log("Change");
		function tryMatch(element, index, array) {
		var respons = value_list.every(tryPattern);
			if ( i < 5 && respons){
				selected_busstop[i] = element;
				document.getElementsByClassName("suggest-element")[i].innerHTML = "<p class=\"line-big list\">"+element.name+",</p> <p class=\"line-small list\">"+element.city+"</p>";
				i++;
			}
			if ( i > 4 )
					return false;
		return true;
			
		function tryPattern(item, index, array){
			//console.log(item);
			//console.log(element);
			var pattern = new RegExp(item, "i");
			var found = element.label.match(pattern);
			if ( value != "" && found != null){
				return true;
			}	
			else{
				return false;
			}
		}
			}

		var str = data[lang];
		str.every(tryMatch);
 }
 function selectBusstop(div_number){
	document.getElementsByClassName("line-big chosen")[selected_option].innerHTML = selected_busstop[div_number].name+", ";
	document.getElementsByClassName("line-small chosen")[selected_option].innerHTML = selected_busstop[div_number].city;
	removeSection();
	selected_option++;
	addSection();
 }
 function removeSection(){
	var input_element = document.getElementsByClassName("input-element");
	while ( input_element[0] ){
		input_element[0].remove();
	}
 }
 function addSection(){
	var j = 0;
	var newdiv = new Array(5);
	var new_input = document.createElement("input");
	new_input.className = "input-element input";
	new_input.id ="to-input";
	new_input.setAttribute("onkeyup","autocom()");
	document.getElementsByClassName("chosen-line")[selected_option].appendChild(new_input);
	while ( j < 5 ){
		newdiv[j] = document.createElement("div");
		newdiv[j].setAttribute("onclick", "selectBusstop("+j+")");
		newdiv[j].className = "input-element text-element list-element suggest-element";
		document.getElementsByClassName("chosen-line")[selected_option].appendChild(newdiv[j]);
		j++;
	}
	
}
function changeSection(to_section){
		removeSection();
		selected_option = to_section;
		addSection();
}
