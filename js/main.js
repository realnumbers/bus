var lang = "it";
var History = window.History;
var matchingBusstops = new Array(5);
$(document).on("requestComplete", requestComplete);
initApp();

function initApp() {
	selectLanguage();
	loadUrlData();
	initLayout();
	initInput();
	startRequest();
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

function goBack() {
	History.back();
}
function showDetails(el) {
	var data = History.getState().data;
	// 1 based index
	var index = $(el).index() + 1;
	// push new state
	data.detail = index;
	pushUrl(data);
}

function requestComplete(e) {
	$(".spinner").hide();
	if (History.getState().data.detail == 0)
		showOverview();
	else if (History.getState().data.detail > 0)
		changeToDetails(History.getState().data.detail);	
	msg(e)
}
function msg(e) {
	console.log("Event: " + e.type + " Msg: " + e.message);
}

History.Adapter.bind(window,'statechange',function() {
	var state = History.getState();
	console.log("New Url State");
	if (state.data.detail == 0)
		changeToSearch();
	else if (state.data.detail > 0)
		changeToDetails(state.data.detail);	
});

function selectLanguage() {
	if (navigator.language === "de")
		lang = "de";
}
