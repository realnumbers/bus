function initLayout() {
  $(".js-load").hide();
  $(".js-no-matches").hide();
  $(".js-error").hide();
  $(":input").val("");
  $(".js-name").text("");
  $(".js-city").text("");
  $(".spinner").css("display", "none");
  $(".input-section-visible").hide(0).removeClass("input-section-visible").addClass("input-section-hidden");
  $(".input-section-hidden").hide(0);
  $(".details-hidden-right").hide(0);
  $(".js-from:last").show(0);
  $(".js-to:last").show(0);
  toggleInputHideClass("init");
}

$("#details").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
  if (History.getState().data.detail == "0") {
    $("#details").hide();
    $("#back").hide();
  } 
});

function l10nReplacement() {
  var l10n = {
    "l10n_en": [
      {"class": "l-from", "val": "From:"},
      {"class": "l-to", "val": "To:"},
      {"class": "l-when", "val": "When:"},
      {"class": "l-no-matches", "val": "No matching bus stops"},
      {"class": "l-more", "val": "Load more results"},
      {"class": "l-changes", "val": "changes"},
      {"class": "l-er-con-t", "val": "No connections found"},
      {"class": "l-er-con-m", "val": "It seems like there are no bus connections for these stations at the specified time. Please try changing your query."},
      {"class": "l-er-api-t", "val": "Couldn't fetch bus data"},
      {"class": "l-er-api-m", "val": "It seems like the SASA backend service which we use to obtain bus data is not responding. Please try again later."},
      {"class": "l-er-net-t", "val": "No network connection"},
      {"class": "l-er-net-m", "val": "It seems like your internet connection is not working. Please try to restore the connection and try again."},
      {"class": "l-er-unk-t", "val": "Unknown Error"},
      {"class": "l-er-unk-m", "val": "An unknown error has occurred. Shit is fucked up."},
      {"class": "lp-from", "val": "Start..."},
      {"class": "lp-to", "val": "Destination..."},
      {"class": "la-menu", "val": "Menu"},
      {"class": "la-cancel", "val": "Reset query"},
      {"class": "la-hide-input", "val": "Hide input"},
      {"class": "la-back", "val": "Back"},
    ],
    "l10n_de": [
      {"class": "l-from", "val": "Von:"},
      {"class": "l-to", "val": "Nach:"},
      {"class": "l-when", "val": "Wann:"},
      {"class": "l-no-matches", "val": "Keine passenden Haltestellen"},
      {"class": "l-more", "val": "Mehr Resultate laden"},
      {"class": "l-changes", "val": "Mal umsteigen"},
      {"class": "l-er-con-t", "val": "Keine Verbinungen"},
      {"class": "l-er-con-m", "val": "Es gibt keine Busverbindungen für diese Anfrage. Bitte versuchen Sie, ihre Anfrage zu ändern."},
      {"class": "l-er-api-t", "val": "Backend nicht erreichbar."},
      {"class": "l-er-api-m", "val": "Der SASA Backend Service von dem wir unsere Verbindungsdaten erhalten, konnte nicht erreicht werden. Bitte versuchen Sie es erneut."},
      {"class": "l-er-net-t", "val": "Keine Netzwerkverbindung"},
      {"class": "l-er-net-m", "val": "Es gibt ein Problem mit Ihrer Netzwerkverbindung. Bitte versuchen Sie dieses zu beheben und versuchen Sie es erneut."},
      {"class": "l-er-unk-t", "val": "Unbekannter Fehler"},
      {"class": "l-er-unk-m", "val": "Ein unbekannter Fehler ist aufgetreten."},
      {"class": "lp-from", "val": "Start..."},
      {"class": "lp-to", "val": "Ziel..."},
      {"class": "la-menu", "val": "Menü"},
      {"class": "la-cancel", "val": "Anfrage zurücksetzen"},
      {"class": "la-hide-input", "val": "Eingabefeld verstecken"},
      {"class": "la-back", "val": "Źurück"},
    ],
    "l10n_it": [
      {"class": "l-from", "val": "Da:"},
      {"class": "l-to", "val": "A:"},
      {"class": "l-when", "val": "Ora:"},
      {"class": "l-no-matches", "val": "Keine passenden Haltestellen"},
      {"class": "l-more", "val": "Carica altri risultati"},
      {"class": "l-changes", "val": "cambi"},
      {"class": "l-er-con-t", "val": "Keine Verbinungen."},
      {"class": "l-er-con-m", "val": "Es gibt keine Busverbindungen für diese Anfrage. Bitte versuchen Sie, ihre Anfrage zu ändern."},
      {"class": "l-er-api-t", "val": "Backend non raggiungibile"},
      {"class": "l-er-api-m", "val": "Der SASA Backend Service von dem wir unsere Verbindungsdaten erhalten, konnte nicht erreicht werden. Bitte versuchen Sie es erneut."},
      {"class": "l-er-net-t", "val": "Problema connessione rete"},
      {"class": "l-er-net-m", "val": "Es gibt ein Problem mit Ihrer Netzwerkverbindung. Bitte versuchen Sie dieses zu beheben und versuchen Sie es erneut."},
      {"class": "l-er-unk-t", "val": "Errore sconosciuto"},
      {"class": "l-er-unk-m", "val": ""},
      {"class": "lp-from", "val": "Partenza..."},
      {"class": "lp-to", "val": "Destinazione..."},
      {"class": "la-menu", "val": "Menu"},
      {"class": "la-cancel", "val": "Annulla richiesta"},
      {"class": "la-hide-input", "val": "Nascondi input"},
      {"class": "la-back", "val": "Indietro"},
    ]
  };

  console.log(navigator.language.substr(0, 2));
  var langUI = "l10n_en";
  if (navigator.language.substr(0, 2) == "de")
    langUI = "l10n_de";
  else if (navigator.language.substr(0, 1) == "it")
    langUI = "l10n_it";

  for (var i = 0; i < l10n[langUI].length; i++) {
    console.log($(l10n[langUI][i].class));
    var typ = l10n[langUI][i].class.split("-")[0];
    switch (typ) {
      case "l": 
        $("." + l10n[langUI][i].class).text(l10n[langUI][i].val);
        break;
      case "lp": 
        $("." + l10n[langUI][i].class).attr("placeholder",l10n[langUI][i].val);
        break;
      case "la": 
        $("." + l10n[langUI][i].class).attr("alt",l10n[langUI][i].val);
        break;
    }
  }
}

function toggleInput(el) {
  $(".selected").removeClass("selected");
  showSuggests(".js-section", -1);
  if ($(el).next(".js-from").length > 0 ||
    $(el).next(".js-to").length > 0 ||
    $(el).next(".js-time-date").length > 0) {
    $(el).next(":first").slideToggle(300, function () {
      $(".js-to").find(":input").val("");
      $(".js-from").find(":input").val("");
    }).find(":input:first").focus();
  } else
  //$(el).slideToggle(0, function () {
    $(el).slideToggle(300, function () {
      toggleInputHideClass(el);
      $(".js-to").find(":input").val("");
      $(".js-from").find(":input").val("");
    });
}

function showSuggests(section, number, busstop) {
  $(section).find(".js-no-matches").hide();
  $(".selected").removeClass("selected");
  $(section).find(".js-suggest").each(function (index, el) {
    if ($(el).parents(section) && index == number) {
      $(el).show();
      //$(el).slideToggle(400);
      $(el).find(".js-name").text(
        (busstop.name != "") ? busstop.name + ", " : "");
      $(el).find(".js-city").text(busstop.city);
    } else {
      if (index > number) {
        $(el).hide();
        //	$(el).slideToggle(400);
        $(el).find(".js-name").text();
        $(el).find(".js-city").text();
      }
    }
  });
}

function suggestInHover(el) {
  $(".selected").removeClass("selected");
  $(el).addClass("selected");
}

function suggestOutHover(el) {
  $(".selected").removeClass("selected");
}

function showSelectedBusstop(section, busstop) {
  $(section + ":first").find(".js-name").text(busstop.name + ", ");
  $(section + ":first").find(".js-city").text(busstop.city);
}

function selectNext(el) {
  if ($(".selected").length == 0)
    $(el).find(".js-suggest:first").addClass("selected");
  else {
    if ($(".selected").next(".js-suggest").length > 0)
      $(".selected").removeClass("selected").next(".js-suggest").addClass("selected");
    else
      $(".selected").removeClass("selected").prevAll(".js-suggest:last").addClass("selected");
  }
}

function selectPrevious(el) {
  if ($(".selected").length == 0)
    $(el).find(".js-suggest:last").addClass("selected");
  else {
    if ($(".selected").prev(".js-suggest").length > 0)
      $(".selected").removeClass("selected").prev(".js-suggest").addClass("selected");
    else
      $(".selected").removeClass("selected").nextAll(".js-suggest:last").addClass("selected");
  }
}

function selectEnterBusstop() {
  selectBusstop(".selected:first");
}

function showSelectetTime(time) {
  $(".js-time-date:first").find(".js-name").text(time[1] + ", ");
  $(".js-time-date:first").find(".js-city").text(time[0]);
}

// Moves the next input section into visible and
// and proves if the next feld is already fulled
function toggleInputHideClass(el) {
  //To validate the next input feld
  if (el == "init") proveNextSection("init");
  else if ($(el).hasClass("js-from")) proveNextSection("js-from");
  else if ($(el).hasClass("js-to")) proveNextSection("js-to");
  else if ($(el).hasClass("js-time-date")) proveNextSection("js-time-date");

  $(".input-section-hidden:first").show(0).removeClass("input-section-hidden").addClass("input-section-visible").find(":input:first").focus();
}

function showStartRequestStuff() {
  $(".spinner").css("display", "block");
  $(".js-error").hide();
  $(".js-load").hide();
  $("#cancel").show(0).removeClass("icon-hidden-left").addClass("icon-visible");
  $(".js-overview").hide().children().hide();
  $(".js-overview").find(".js-time").text("");
  $(".js-overview").find(".js-duration").text("");
}

function showOverview() {
  var routeData = getRouteData();
  var el = $(".js-overview").children(":first");
  if (routeData != undefined) {
    $(".js-overview").show();

    for (var i = 1; i < routeData.length; i++) {
      if (routeData[i] !== null) {
        el.show();
        el.find(".js-time").text(routeData[i].overview.depTime + " - " + routeData[i].overview.arrTime);
        el.find(".js-duration").text(routeData[i].overview.duration);
        if (el.next().length == 0 && i < routeData.length - 1) {
          console.log("add Element");
          $(".js-overview").append('<div class="text-element list-element " onclick="showDetails(this)"> <p class="line-big bigger js-time"></p><p class="line-small list js-duration"></p></div>');
        }
        el = el.next();
      }
    }
    while (el.length != 0) {
      var nextEl = el.next();
      el.remove();
      el = nextEl;
    }

    $(".js-load").show();
  } else {
    console.log("Invalide Error: Noconnection");
  }

}

function changeToDetails(index) {
  console.log("go to Detail");
  $(".js-transit").hide();
  $(".js-intermediate").hide();
  $(".search-visible:first").show(0).removeClass("search-visible").addClass("search-hidden");
	$(".menu-visible:first").removeClass("menu-visible").addClass("menu-hidden");
  $(".details-hidden-right:first").show(0).removeClass("details-hidden-right").addClass("details-visible");
  $(".details-hidden-left:first").show(0).removeClass("details-hidden-left").addClass("details-visible");
  $("#cancel").removeClass("icon-visible").addClass("icon-hidden-left");
  $("#back").show(0).removeClass("icon-hidden-right").addClass("icon-visible");
	$("#menu").show(0).removeClass("icon-hidden-left").addClass("icon-visible");
  genDetails(index);
}

function genDetails(index) {
  var data = getRouteData()[index].connections;
  var htmlTransit = '<section class="transit-block js-transit"><div class="location-line"><p class="timestamp js-time left-column line-big bigger">07:18</p><div class="text-element"><p class="line-big chosen js-name">Waltherplatz,</p><p class="line-small chosen js-city">Bozen</p></div></div><div class="connection-line"><div class="left-column bigger"><img src="img/arrow.svg" class="connection-symbol"></div><p class="action line-big thin blue js-lineNo">10A Bus Line</p></div><div class="location-line"><p class="timestamp js-time left-column line-big bigger">07:21</p><div class="text-element"><p class="line-big chosen js-name">Grieser Platz,</p><p class="line-small chosen js-city">Bozen</p></div></div></section>';

  var htmlIntermediate = '<section class="intermediate-block js-intermediate"><div class="left-column bigger"></div><p class="action line-big thin blue">Wait 4 minutes</p></section>';

  console.log(index);
  var tBlock = $(".js-transit:first");
  var iBlock = $(".js-intermediate:first");
  var i = 0;
  while (i < data.length) {
    if (data[i].depTime != undefined) {
      tBlock.show();
      tBlock.find(".js-time:first").text(data[i].depTime);
      tBlock.find(".js-time:last").text(data[i].arrTime);
      tBlock.find(".js-name:first").text(data[i].depBusstop[1] + ", ");
      tBlock.find(".js-name:last").text(data[i].arrBusstop[1] + ", ");
      tBlock.find(".js-city:first").text(data[i].depBusstop[0]);
      tBlock.find(".js-city:last").text(data[i].arrBusstop[0]);
      tBlock.find(".js-lineNo").text("Line " + data[i].lineNo);
      if (tBlock.nextAll(".js-transit").length == 0 && i < data.length - 1)
        tBlock.parent().append(htmlTransit);
      tBlock = tBlock.nextAll(".js-transit:first");
    }
    if (data[i].waitTime != "") {
      iBlock.show().find("p").text(data[i].waitTime);
      if (iBlock.nextAll(".js-intermediate").length == 0)
        iBlock.parent().append(htmlIntermediate);
      iBlock = iBlock.nextAll(".js-intermediate:first");
    }

    i++;
  }
  while (tBlock.length != 0) {
    var nextTBlock = tBlock.nextAll(".js-transit:first");
    tBlock.remove();
    tBlock = nextTBlock;
  }
  while (iBlock.length != 0) {
    var nextIBlock = iBlock.nextAll(".js-intermediate:first");
    iBlock.remove()
    iBlock = nextIBlock;
  }

}

function changeToSearch() {
	var UrlData = History.getState().data;
	console.log("Change To Search");
	$(".details-visible:first").removeClass("details-visible").addClass("details-hidden-right");
	$(".menu-visible:first").removeClass("menu-visible").addClass("menu-hidden");
	$(".search-hidden:first").show(0).removeClass("search-hidden").addClass("search-visible");
	$("#back").removeClass("icon-visible").addClass("icon-hidden-right");
	$("#menu").show(0).removeClass("icon-hidden-left").addClass("icon-visible");
	if (UrlData.arr != undefined && UrlData.dep != undefined)
		$("#cancel").show(0).removeClass("icon-hidden-left").addClass("icon-visible");
}

function showMenu() {
  var data = new Object();
  data.about = true;
  History.pushState(data, "Bus", "?menu");
}

function changeToMenu() {
	console.log("go to Menu");
  if ($(".search-visible").length)
	  $(".search-visible:first").removeClass("search-visible").addClass("search-hidden");
  else if ($(".details-visible").length)
	  $(".details-visible:first").removeClass("details-visible").addClass("details-hidden-left");
	$(".menu-hidden:first").show(0).removeClass("menu-hidden").addClass("menu-visible");
	$("#cancel").removeClass("icon-visible").addClass("icon-hidden-left");
	$("#menu").removeClass("icon-visible").addClass("icon-hidden-left");
	$("#back").show(0).removeClass("icon-hidden-right").addClass("icon-visible");
}
