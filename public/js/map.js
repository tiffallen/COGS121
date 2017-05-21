  var PATH = "search";
  var FIREBASE_INDEX = "firebase";
  var PLACE_TYPE = "place";
  var QUERY_SIZE = 1000;
  var app = firebase.initializeApp(config);
  var database = firebase.database();
  var buttonClicked = false;
  var started = false;

  
  $(function()
  {
    doSearch(buildQuery());
  });

  function buildQuery(term=null, matchWholePhrase=false, label=null)
  {
    // skeleton of the JSON object we will write to DB
    var query =
    {
      index: FIREBASE_INDEX,
      type: PLACE_TYPE,
      size: QUERY_SIZE
  };

  buildQueryBody(query, term, matchWholePhrase, label);
  return query;
}

function buildQueryBody(query, term, matchWholePhrase, label)
{
    var body = query.body =
    {    
    };
    body.query =
    {
        "bool":
        {
            "must":
            [
            ]
        }
    };
    if(term)
    {
        if(matchWholePhrase)
        {
            body.query.bool.must.push({"match_phrase": {"_all": term}});
        }
        else
        {
            body.query.bool.must.push({"match": {"_all": term}});
        }
    }

    if(!(label == null || label === "All" || label == false))
    {
        body.query.bool.must.push({"match": {"labels": label}});
    }
}

  // conduct a search by writing it to the search/request path
  function doSearch(query)
  {
    console.log(query);
    var ref = database.ref().child(PATH);
    var key = ref.child('request').push(query).key;
    ref.child('response/'+key).on('value', showResults);
}

  // when results are written to the database, read them and display
  function showResults(snap)
  {
    if( !snap.exists() )
    {
        return;
    } // wait until we get data
    var dat = snap.val().hits;

    // when a value arrives from the database, stop listening
    // and remove the temporary data from the database
    snap.ref.off('value', showResults);
    snap.ref.remove();
    applyFilter(dat);
}



$("footer > tab").click(function() {
    $(this).addClass("active").siblings().removeClass("active");
    $("#" + $(this).attr("id") + "-section").addClass("active").siblings().removeClass("active");
});

$("#found-form").submit(function() {
    postFound();
    return false;
});



function ajax(option) {
    option.success = function(result) {
        var data = JSON.parse(result);
        if (data.code == 0) {
            option.success(data.content);
        } else {
            alert("Error " + data.code + ": " + data.msg);
        }
    };
    option.error = function() {
        alert("Internet connection error");
    };
    $.ajax(option);
}

Recenter = function(opt_options) {
    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = 'C';

    var this_ = this;
    var handleRecenter = function() {
        this_.getMap().getView().animate({
            center: geolocation.getPosition(),
            zoom: 17,
            duration: 2000
        });
    };



    button.addEventListener('click', handleRecenter, false);
    button.addEventListener('touchstart', handleRecenter, false);

    var element = document.createElement('div');
    element.className = 'recenter ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};

ol.inherits(Recenter, ol.control.Control);

var iconStyle2 = new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/map-marker.png'
    }))
});



var iconFeatureArray = [];
var iconFeatureArrayFiltered = [];

var vectorSource = new ol.source.Vector({
    features: iconFeatureArrayFiltered
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});


function applyFilter(queryResult)
{
    iconFeatureArrayFiltered = [];
    if (queryResult.hits)
    {
        if(queryResult.hits && queryResult.hits.length > 0)
        {
          $.each(queryResult.hits, function(index, value)
          {
            var resultData = value._source;
            console.log(value._source);
            var iconStyle = new ol.style.Style(
            {
                image: new ol.style.Icon(
                {
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: resultData.icon_img
                })
            });

            var iconFeature1 = new ol.Feature(
            {
                geometry: new ol.geom.Point(ol.proj.transform(resultData.coordinates, 'EPSG:4326', 'EPSG:3857')),
                name: resultData.name,
                labels: resultData.labels,
                college: resultData.college
            });

            iconFeature1.setStyle(iconStyle);
            iconFeatureArrayFiltered.push(iconFeature1);
        });
          if(queryResult.hits[0] && queryResult.hits[0]._source && queryResult.hits[0]._source.coordinates)
          {
            map.getView().animate(
            {
                center: ol.proj.transform(queryResult.hits[0]._source.coordinates, 'EPSG:4326', 'EPSG:3857'),
                duration: 2000
            });
        }
    } 
}
      //$('#total').text(queryResult.total + ' results.');
      //alert(queryResult.total + ' results.');
      vectorSource.clear();
      vectorSource.addFeatures(iconFeatureArrayFiltered);
  }


  var rasterLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});


  var view = new ol.View({
    center: [0, 0],
    zoom: 3,
    minZoom: 15,
    maxZoom: 19
});


  /* Basis of overlay layer for popup functionality */
  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');


  var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
  }
}));


  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};


var styles = [
'Aerial',
'Road'
];
var layers = [];
var i, ii;
for (i = 0, ii = styles.length; i < ii; ++i) {
    layers.push(new ol.layer.Tile({
      visible: false,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: 'AjD5Z5DmhJFtP_cZwKgAKQ5vN6ihR_oVvR-1bJscmWVjXeq8AkT3DnRS-fNaRLxI',
        imagerySet: styles[i],
        maxZoom: 19
    })
  }));
}

styles.push('Default');

layers.push(rasterLayer);


var select = document.getElementById('layer-select');
function onChange() {
    var style = select.value;
    for (var i = 0, ii = layers.length; i < ii; ++i) {
      layers[i].setVisible(styles[i] === style);
  }
}
select.addEventListener('change', onChange);
onChange();

var vectorLayers = [vectorLayer];
var allLayers = layers.concat(vectorLayers);



var map = new ol.Map({
    layers: allLayers,
    loadTilesWhileInteracting: true,
    overlays: [overlay],
    target: 'map',
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }).extend([
    new Recenter()
    ]),
    view: view
});

function resizeMap()
{
    $("#map").css("height", $(window).height() - 200); this.map.updateSize();
}

resizeMap();

$(window).resize(function() {
    resizeMap();
});



var popupName;

/* Functionality for when Popup when markers are clicked */
map.on('singleclick', function(evt) {
    // gets the name from the json array
    var names = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('name');
    });
    popupName = names;

    // gets college name from json array
    var col = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('col');
    });

    // gets the picture from the json array
    var pic = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('pic');
    });

    // gets the info of the landmark from json array
    var sentence = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('sent');
    });

    //gets coordinates of place clicked
    var coordinate = evt.coordinate;
    var hdms = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    var lon = hdms[0];
    var lat = hdms[1];

        // clicking anywhere on map will close the popup
        if (names == undefined) {
            overlay.setPosition(undefined);
            closer.blur();
        }

        // clicking on pin will cause this to run (displays pop up)
        else { 
            // HTML for what shows on pop up, Title, College, Rating, Picture, Info
            content.innerHTML = 
            '<h3><code>' + '<a class="popup-link" onclick="redirectPopup()" href="./detailedPopup.html">' + 
            '<option style=' + '"font-family: Cinzel, serif;"' + '>' + names + ':' + '</option>' + '</a>' + ' </h3>' + 

            '<img src= ' +  '../img/fourstars.png' + ' width=60 height="15" ' + '>' + '<br />' +

            '<a href=' + pic +'>' + '<img src= ' +  pic + ' width="200" height="120" ' + '>' + '</a>' +

            '<h3> <option style=' + '"font-family: Cinzel, serif;"' + '> College: ' + col + '</option>' + '</h3>' +

            '<p>' + sentence + '</option>' + '<a href="https://tinyurl.com/kce9a6o"> Read more..</a>' + '</p>';

            overlay.setPosition(coordinate);


        }
    });


function redirectPopup() {
    localStorage.setItem('popupName', String(popupName));
};


// Add event handler, Button to add a new place
$("#addNewPlaceButton").click (function() {
  alert("Click anywhere on map to add the new place..");
  buttonClicked = true;

// code to add new pins to map
map.on('click', function(evt) {
    if (buttonClicked)
    {
        // get the name of the clicked area
        var names = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('name');
        });

        // if clicked area has not been named, then add location
        if (names == undefined){

        //get coordinates of place clicked
        var coordinate = evt.coordinate;
       // var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        //var lon = lonlat[0];
        //var lat = lonlat[1];

        // prompt user to input name of new place, if no name inputed, then 
        // it will prompt user again until a name is inputed
        var locname= prompt("Please enter name of new place", "Name");
        while(locname == "Name")
            locname= prompt("Name is required to add new place","Name");


         // check if user cancelled the process
         if (locname != null){

            // add pin to map

            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point([coordinate[0], coordinate[1]]),
                name: locname,
                 //dummy things for now
                 col: ["Pending"],
                 pic: ["https://tinyurl.com/ln69r72"],
                 sent: ["This is the place you just added, it is being reviewed by our team"],
                 labels: ["None"]
             });

            iconFeature.setStyle(iconStyle2);
            iconFeatureArray.push(iconFeature);
            vectorSource.addFeature(iconFeature);
            buttonClicked = false;

        }
    }   
}
});
//end code to add new pin



});
// end code for button listener


// shows a hand when hovering over marker
map.on('pointermove', function(evt) {
    map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
});


var zoomslider = new ol.control.ZoomSlider();
map.addControl(zoomslider);

var geolocation = new ol.Geolocation({
    projection: view.getProjection(),
    tracking: true
});


var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function() {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

var positionFeature = new ol.Feature();
positionFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
            color: 'blue'
        }),
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 2
        })
    })
}));

geolocation.on('change:position', function()
{
    var position = geolocation.getPosition();
    positionFeature.setGeometry(position ? new ol.geom.Point(position) : null);
    if (!started)
    {
        view.setCenter(position); //this gets annoying, only do it once on load
        started = true;
    }
});

new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: [accuracyFeature, positionFeature]
    })
});

//logout
document.getElementById("logout").onclick = function(){
    console.log("Clicked logout");
    firebase.auth().signOut();
};


(function ($) {
  "use strict";

  function organizeQueryInputs(searchTerm, strictMatchTerm, filterTerm)
  {
    if(searchTerm)
    {
        doSearch(buildQuery(searchTerm, strictMatchTerm, filterTerm));
    }
    else
    {
        doSearch(buildQuery(searchTerm, false, filterTerm));
    }
}

  //search functionality
  $('#search').submit(function(event)
  {
    event.preventDefault();
    organizeQueryInputs($('#searchInput').val(), $('#matchExact').is(':checked'), $('#selectFilter').val());
});

  $('#selectFilter').change(function()
  {
    organizeQueryInputs($('#searchInput').val(), $('#matchExact').is(':checked'), this.value);
});
})(jQuery);
