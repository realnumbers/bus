var lang = "it";
var matchingBusstops = new Array(5);
$(document).on("requestComplete", msg);
initApp();



function initApp() {
	selectLanguage();
	loadUrlData();
	initLayout();
	initInput();
}
// event for a complete request is "requestComplete"
//$(document).on("requestComplete", msg);


// check if there are right arguments in url and load them
function startRequest() {
if (validateUrlData(History.getState().data)) {
	showStartRequestStuff();
	if (getRouteData() == undefined || !compareDataInput(getRouteData()[0], History.getState().data))
		requestRoute(History.getState().data);
	else {
		$.event.trigger({
			type: "requestComplete",
			message: "API data uptodate"
			});
	}
}
else {
	console.log("No input");
}
}
function cancelQuery() {
	$(".icon-visible:last").removeClass("icon-visible").addClass("icon-hidden-left");
	var data = new Object();
	pushUrl(data);
	initApp();
}

function msg(e) {
	$(".spinner").hide();
	console.log("Event: " + e.type + " Msg: " + e.message);
}

function selectLanguage() {
	if (navigator.language === "de")
		lang = "de";
}
