var matchingBusstops = new Array(5);

removeClickDelay();
onEnterEvent();

function busstopInput(el) {
	console.log(el);
	var inputString = $(el).val();
	var i = 0;	
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
				console.log(element.label);
				i++;
				}
				//return true if I don't have enough results
				return (i < 5) ? true : false;
		});
		if (resMatch && i == 0)
			showMatchMsg();
		else
			hideMatchMsg();
	}
}

function showMatchMsg(){
	alert("No Matches");
}
function hideMatchMsg(){
}

function selectBusstop(el) {
	console.log($(el));
}

function autoSetTime() {
		var currentdate = new Date();
		var day = addZero(currentdate.getDate());
		var month = addZero(currentdate.getMonth() + 1);
		var year = currentdate.getFullYear();
		var hours = addZero(currentdate.getHours());
		var minutes = addZero(currentdate.getMinutes());
}
function selectTime() {
	var date = $(".date").val();
	var time = $(".time").val();
	if ($("#date-input")[0].validity.valid &&
		  $("#time-input")[0].validity.valid &&
		  date != "" &&
		  time != ""
		 ) {
		date = formateDate(date.split(/[\.\/\-,;:]/));
		alert("Time input Correct");
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
	return date
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
