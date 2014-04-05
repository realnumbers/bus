var lang = "it";
selectLanguage();
loadUrlData();
// event for a complete request is "requestComplete"
//$(document).on("requestComplete", msg);

$(document).on("requestComplete", msg);

// check if there are right arguments in url and load them
function startRequest() {
if (loadUrlData()) {
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

function msg(e) {
	console.log("Event: " + e.type + " Msg: " + e.message);
}

function selectLanguage() {
	if (navigator.language === "de")
		lang = "de";
}
