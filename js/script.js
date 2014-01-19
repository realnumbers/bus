var data_ready = false;
var lang = "it";
var busstops = $.getJSON( "js/busstops.json", function(data){
		console.log(" success");
		console.log(data);
		data_ready = true;
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

function autocom(data){
		var i = 0;
		var value = document.getElementById("to-input").value;
		var value = document.getElementById("to-input").value;
		var value_list = value.split(' ');

		document.getElementsByClassName("suggest-element")[0].innerHTML = "";
		document.getElementsByClassName("suggest-element")[1].innerHTML = "";
		document.getElementsByClassName("suggest-element")[2].innerHTML = "";
		data = busstops.responseJSON;
		console.log("Change");
		function tryMatch(element, index, array) {
			value_list.forEach(tryPattern);
			
		function tryPattern(item, index, array){
			//console.log(item);
			var pattern = new RegExp(item, "i");
			var found = element.label.match(pattern);
			if ( value != "" && found != null){
				if ( i >= 0  ){
				document.getElementsByClassName("suggest-element")[i].innerHTML = "<p class=\"line-big list\">"+element.name+",</p> <p class=\"line-small list\">"+element.city+"</p>";
				i--;
				}
			//console.log(found);
			}	
			if ( found == null ){
					console.log(i);
					i = 2;
					return false;
			}
		}
			}

		var str = data[lang];
		str.forEach(tryMatch);
 }
