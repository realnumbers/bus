var lang = "it";
selectLanguage();

if (loadUrlData()) {
	if (!compareDataInput(getRouteData()[0], History.getState().data))
		requestRoute(History.getState().data);
	else
		console.log("Api data uptodate");
}
else {
	console.log("No input");
}

function selectLanguage() {
	if (navigator.language === "de")
		lang = "de";
}
