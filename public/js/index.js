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



// Sun God Statue
var latitude = 32.878540; // West & East
var longitude = -117.239678; //North & South



/* Sets all marker points */

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
});
// creates what markers will look like 
var iconStyle = new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/map-marker.png'
    }))
});

iconFeature.setStyle(iconStyle);
iconFeature2.setStyle(iconStyle);
iconFeature3.setStyle(iconStyle);

/* Adds a layer for the markers */

var vectorSource = new ol.source.Vector({
    features: [iconFeature, iconFeature2, iconFeature3]
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

/* Creates new map type that extends recenter */

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




map.on('singleclick', function(evt) {
        var name = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('name');
        });
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));
        if (name == undefined) {
            popup.hide();
        }
        else { 
            content.innerHTML = '<h3><code>' + name + ': </h3>' + hdms +
            '</code>';
            overlay.setPosition(coordinate);
        }   

      });


/* Checks where youre clicking, and if its a marker, 
   create a text that tells user that that markers name */

/* var content = document.getElementById('popup');
map.on('singleclick', function(evt) {
    var name = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('name');
    });
    // shows marker name in HTML
    if (name === "undefined") {} else {
        var coordinate = evt.coordinate;
        content.innerHTML = name;
        overlay.setPosition(coordinate);
    }
}); */
// shows a hand when hovering over marker
map.on('pointermove', function(evt) {
    map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
});


// Zoom feature
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

// current location icon
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