//var sitesJson;
/*$.getJSON("../../data/sites.json", function(data){

});
*/

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

sitesJson.forEach(function(obj){
    var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(
        ol.proj.transform(obj.coordinates,
            'EPSG:4326', 'EPSG:3857')),
    /*
           geometry: new ol.geom.Point([0, 0]), */
    name: obj.name,
    population: obj.population
});

iconFeature.setStyle(iconStyle);
iconFeatureArray.push(iconFeature);

});


// Sun God Statue
/*var latitude = 32.878540; // West & East
var longitude = -117.239678; //North & South

*/


/*
var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(
        ol.proj.transform([longitude, latitude],
            'EPSG:4326', 'EPSG:3857')),
    name: 'Sun God Statue',
    population: 4000
});
var iconFeature2 = new ol.Feature({
    geometry: new ol.geom.Point(
        ol.proj.transform([-117.237441, 32.881132],
            'EPSG:4326', 'EPSG:3857')),
    name: 'Geisel Library',
    population: 4000
});
var iconFeature3 = new ol.Feature({
    geometry: new ol.geom.Point(
        ol.proj.transform([-117.238898, 32.877466],
            'EPSG:4326', 'EPSG:3857')),
    name: 'Graffiti Walls',
    population: 4000
});*/

/*

iconFeature.setStyle(iconStyle);
iconFeature2.setStyle(iconStyle);
iconFeature3.setStyle(iconStyle);
*/
var vectorSource = new ol.source.Vector({
    features: iconFeatureArray
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
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

var map = new ol.Map({
    layers: [rasterLayer, vectorLayer],
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






var content = document.getElementById('popup');
map.on('singleclick', function(evt) {
    var name = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('name');
    });
    if (name === "undefined") {} else {
        var coordinate = evt.coordinate;
        content.innerHTML = name;
        overlay.setPosition(coordinate);
    }
});
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