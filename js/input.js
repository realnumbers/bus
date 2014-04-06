function initInput() {
	$(":input").val("");
	removeClickDelay();
	onEnterEvent();
	if (History.getState().data.time == undefined || History.getState().data.date == undefined)
		autoSetTime();
	$("#date-input").val(History.getState().data.date);
	$("#time-input").val(History.getState().data.time);
}

function busstopInput(el) {
		var inputString = $(el).val();
		var i = 0;	
		var section = ($(el).parents(".js-to").length > 0) ? 
									".js-to" : ".js-from";
		// hide all Suggests
		showSuggests(section, -1);

		if (inputString != "") {
			inputString = inputString.split(" ");

			//Match every busstop from data
			var resMatch = getBusstops()[lang].every( function (element, index, array) {
					//with every part of the inputSting
					var foundBusstop = inputString.every( function (item, index, array) {
						var pattern = new RegExp(item, "i");
					var foundMatch = element.label.match(pattern);
					foundMatch = (element.id != History.getState().data.arr && element.id === History.getState().data.dep) ? null : foundMatch;
					foundMatch = (element.it != History.getState().data.dep && element.id === History.getState().data.arr) ? null : foundMatch;
					// return true if there is a match
					return (foundMatch != null) ? true : false;
					});

				if (foundBusstop) {
				matchingBusstops[i] = element;
				showSuggests(section, i, element);
				i++;
				}
				//return true if I don't have enough results
				return (i < 5) ? true : false;
		});
		if (resMatch && i == 0) {
			var element = new Object();
			element.city = "No matching Busstop";
			element.name = "";
			showSuggests(section, 0, element);
		}
	}
}


function selectBusstop(el) {
	var index = $(el).index() - 1;
	var dataUrl = History.getState().data;
	var section = ($(el).parents(".js-to").length > 0) ?
								 ".js-to" : ".js-from";
	showSelectedBusstop(section, matchingBusstops[index]);
	toggleInput($(el).parents(section));
	if (section == ".js-to")
		dataUrl.arr = matchingBusstops[index].id;
	else
		dataUrl.dep = matchingBusstops[index].id;
	replaceUrl(dataUrl); 
}

function submitTime() {
	var time;
	var dataUrl = History.getState().data;
	time = selectTime();
	showSelectetTime(time);
	toggleInput(".js-time-date:last");

	dataUrl.time = time[1];
	dataUrl.date = time[0];
	dataUrl.detail = 0;
	replaceUrl(dataUrl); 
}
function autoSetTime() {
	var currentdate = new Date();
	var dataUrl = History.getState().data;
	var day = addZero(currentdate.getDate());
	var month = addZero(currentdate.getMonth() + 1);
	var year = currentdate.getFullYear();
	var hours = addZero(currentdate.getHours());
	var minutes = addZero(currentdate.getMinutes());
	dataUrl.time = hours + ":" + minutes;
	dataUrl.date = day + "." + month + "." + year;
	dataUrl.detail = 0;
	replaceUrl(dataUrl); 
}
function selectTime() {
	var time = new Array()
	time[0] = $(".date").val();
	time[1] = $(".time").val();
	if ($("#date-input")[0].validity.valid &&
		  $("#time-input")[0].validity.valid &&
		  time[0] != "" &&
		  time[1] != ""
		 ) {
		time[0] = formateDate(time[0].split(/[\.\/\-,;:]/));
		return time;
	}
	return undefined;
}

// prove if this section has just got a value from url and
// jump to the next
function proveNextSection(section) {
	var dataUrl = History.getState().data;
	switch (section) {
		case "init" :		
			if (dataUrl.dep != undefined) {
				$(".js-from:last").hide();
				showSelectedBusstop(".js-from", getBusstopById(dataUrl.dep));
				toggleInputHideClass(".js-from:first");
			}
			break;	
		case "js-from": 
			if (dataUrl.arr != undefined) {
				$(".js-to:last").hide();
				showSelectedBusstop(".js-to", getBusstopById(dataUrl.arr));
				toggleInputHideClass(".js-to:first");
			}
			break;
		case "js-to": 
			if (dataUrl.time != undefined && dataUrl.date != undefined) {
				var time = new Array();
				time[0] = dataUrl.date;
				time[1] = dataUrl.time;
				$(".js-time-date:last").hide();
				showSelectetTime(time);
				toggleInputHideClass(".js-time-date:first");
			}
			break;
		case "js-time-date": console.log("js-time");
			//startRequest();
			break;
	}
}

function addZero(number) {
	if (number.toString().length == 1)
		return "0" + number.toString();
	return number;
}

function formateDate(date) {
	var dateTmp;
	// change postion of year if it is 1st postion
	if (date[0].toString().length == 4) {
		dateTmp = date[2];
		date[2] = date[0];
		date[0] = dateTmp;
	}
	else if (date[2].toString().length == 2)
		date[2] = "20" + date[2].toString();
	return date[0] + "." + date[1] + "." + date[2];
}

function onEnterEvent() {
	$("#date-input").keydown(function(event){
		if(event.keyCode == 13)
			submitTime();	
	});
	$("#time-input").keydown(function(event){
		if(event.keyCode == 13)
			submitTime();
	});
}

function hideKeyboard() {
	$(document.activeElement).filter(':input:focus').blur();
}

// Eliminates 300ms click delay on mobile 
function removeClickDelay() {
	window.addEventListener('load', function() {
			new FastClick(document.body);
			}, false);
}
