var lang = "it";
var History = window.History;
var matchingBusstops = new Array(5);
// init all stuff
$(document).on("requestComplete", requestComplete);
$(document).on("busstopsLoaded", initApp);

checkStorage();
loadBusstopsList();

function initApp() {
	console.log("init App");
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
	else if (History.getState().data.detail > 0) {
		changeToDetails(History.getState().data.detail);	
	}
	msg(e)
}
function msg(e) {
	console.log("Event: " + e.type + " Msg: " + e.message);
}

History.Adapter.bind(window,'statechange',function() {
	var state = History.getState();
	console.log("New Url State");
	if (state.data.detail == 0) {
		changeToSearch();
		startRequest();
	}
	else if (state.data.detail > 0)
		startRequest();
	
});

function selectLanguage() {
	if (navigator.language === "de")
		lang = "de";
}

// creats localStorage by using cookies for IE 6,7 if it doesnt exist
function checkStorage() {
	if (!window.localStorage) {
	window.localStorage = {
		getItem: function (sKey) {
			if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
				return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		},
		key: function (nKeyId) {
				return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
		},
		setItem: function (sKey, sValue) {
			if(!sKey) { return; }
				 document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				 this.length = document.cookie.match(/\=/g).length;
		},
		length: 0,
		removeItem: function (sKey) {
			if (!sKey || !this.hasOwnProperty(sKey)) { return; }
				document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				this.length--;
		},
		hasOwnProperty: function (sKey) {
			return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		}
		};
		window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
	}
}
// load busstops to localStorage if the arnt loaded
function loadBusstopsList() {
	if (!localStorage.busstops){
		$.getJSON( "js/busstops.json", function(data) {
			localStorage.setItem('busstops', JSON.stringify(data));
			$.event.trigger({
				type: "busstopsLoaded"
			});
		});
	}
	else
		$.event.trigger({
			type: "busstopsLoaded"
		});
}
