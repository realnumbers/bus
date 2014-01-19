var lang = "it";
var busstops = $.getJSON( "js/busstops.json", function(data){
		console.log("success");
		console.log(data);
		autocom(data);
	});
//console.log(busstops);
if ( navigator.language === "de" ){
		lang = de;
}

function autocom(data){
$(function() {
	$( "#to-input" ).autocomplete({
		source: data[lang]
	});
});
 }
