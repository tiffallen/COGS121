var sitesJson = [
{
    "name": "Sun God Statue",
    "coordinates": [-117.239678, 32.878540],
    "population": 4000,
    "labels": ["Art", "Stuart Collection"]
},
{
    "name": "Geisel Library",
    "coordinates": [-117.237441, 32.881132],
    "population": 4000,
    "labels": ["Library", "Study"]
},
{
    "name": "Graffiti Walls",
    "coordinates": [-117.238898, 32.877466],
    "population": 4000,
    "labels": ["Art"]
},
{
    "name": "Fallen Star",
    "coordinates": [-117.235312, 32.881427],
    "population": 4000,
    "labels": ["Art", "Stuart Collection"]
},
{
    "name": "Big Red Chair",
    "coordinates": [-117.241216, 32.873435],
    "population": 4000,
    "labels": ["Art"]
},
{
    "name": "Glider Port",
    "coordinates": [-117.251903, 2.889600],
    "population": 4000,
    "labels": ["Other?"]
}
];



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


var iconStyle = new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/map-marker.png'
    }))
});


var iconFeatureArray = [];
var iconFeatureArrayFiltered = [];


sitesJson.forEach(function(obj){
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(
            ol.proj.transform(obj.coordinates,
                'EPSG:4326', 'EPSG:3857')),
        name: obj.name,
        population: obj.population,
        labels: obj.labels
    });

    iconFeature.setStyle(iconStyle);
    iconFeatureArray.push(iconFeature);
    iconFeatureArrayFiltered.push(iconFeature);

});




var vectorSource = new ol.source.Vector({
    features: iconFeatureArrayFiltered
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

$('input[type=radio][name=filter]').change(function(){

    if (this.value === "All") iconFeatureArrayFiltered = iconFeatureArray;
    else
    {
        var selectedFilterValue = this.value;
        iconFeatureArrayFiltered = [];
        $.each(iconFeatureArray, function(index, value){
            var label = value.get('labels');
            $.each(label, function(index2, value2){
                if(value2 === selectedFilterValue)
                {
                   iconFeatureArrayFiltered.push(value);
               }
           });

        });
    }

    vectorSource.clear();
    vectorSource.addFeatures(iconFeatureArrayFiltered);
});


var rasterLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});


var view = new ol.View({
    center: [0, 0],
    zoom: 3,
    minZoom: 15,
    maxZoom: 19
});


/*
// Object constructor for locations
function tritonLoc(names, latitude, longitude) {
    this.names = names;
    this.latitude = latitude;
    this.longitude = longitude;
}
// all location data here
var tritonLocations = [
    loc1 = new tritonLoc("Sun God Statue", 32.878540, -117.239678),
    loc2 = new tritonLoc("Geisel Library", 32.881132, -117.237441),
    loc3 = new tritonLoc("Graffiti Walls", 32.877466, -117.238898),
    loc4 = new tritonLoc("Fallen Star", 32.881427, -117.235312),
    loc5 = new tritonLoc("Glider Port", 32.889600, -117.251903),
    loc6 = new tritonLoc("Big Red Chair", 32.873435, -117.241216)
];


// what markers will look like
var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(  ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/map-marker.png'
    }))
});
// this is needed so locations show up, they are "features" that appear
var vectorSource = new ol.source.Vector({
    features: []
});
// for loop that creates all the tritonlocations from the array object
for(var i = 0; i < tritonLocations.length; i++) {
    var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(
        ol.proj.transform([tritonLocations[i].longitude, tritonLocations[i].latitude],
            'EPSG:4326', 'EPSG:3857')),
    names: tritonLocations[i].names,
    });
    iconFeature.setStyle(iconStyle);
    vectorSource.addFeature(iconFeature);
} */


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

var map = new ol.Map({
    layers: [rasterLayer, vectorLayer],
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



/* Functionality for when Popup when markers are clicked */
map.on('singleclick', function(evt) {
    var names = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('name');
    });
    var coordinate = evt.coordinate;
    var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
        coordinate, 'EPSG:3857', 'EPSG:4326'));
        // this prevents non markers from being popups
        if (names == undefined) {
            popup.hide();
        }
        else { 
            // what text shows up in popup
            content.innerHTML = '<h3><code>' + names + ': </h3>' + hdms +
            '</code>';
            overlay.setPosition(coordinate);
        }   

    });
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


geolocation.on('error', function(error) {
    var info = document.getElementById('info');
    info.innerHTML = error.message;
    info.style.display = '';
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

geolocation.on('change:position', function() {
    var position = geolocation.getPosition();
    positionFeature.setGeometry(position ? new ol.geom.Point(position) : null);
    view.setCenter(position);
});

new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: [accuracyFeature, positionFeature]
    })
});