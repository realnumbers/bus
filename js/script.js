var data_ready = false;
var lang = "it";
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
		 alert(selected_busstop[div_number].name);
 }
