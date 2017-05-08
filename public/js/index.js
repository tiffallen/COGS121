$(document).ready(function(){
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
    var count = 0;
    // accessing the coordinates data json array
    console.log("BLAH");
    $(document).ready(function(){
        console.log("PAGE READY");
       $.getJSON('../data.json', function(place_data){
           console.log("Loaded JSON");
           $.each(place_data.places, function(x,y) {
                console.log("in json");
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.transform(y.coordinates, 'EPSG:3857', 'EPSG:4326')),
                        name: y.name,
                        population: y.population,
                        labels: y.labels
                });
                console.log("after icon Feature");
                iconFeature.setStyle(iconStyle);
                iconFeatureArray.push(iconFeature);
                iconFeatureArrayFiltered.push(iconFeature);
                count = count + 1;
           });
       }); 
    });
    console.log("count: " + count);

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

    /* Setting up map layout/types */

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });


    /* Setting up general map view settings */

    var view = new ol.View({
        center: [0, 0],
        zoom: 3,
        minZoom: 15,
        maxZoom: 25
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
            //return feature.get('names');
            return feature.get('name');
        });
        var coordinate = evt.coordinate;

        var hdms = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        var lon = hdms[0];
        var lat = hdms[1];
        console.log(names + ': [' + lon + ', ' + lat +']');
        var lat = hdms[1];
            // this prevents non markers from being popups
            if (names == undefined) {
                popup.hide();
            }
            else { 
                // what text shows up in popup
                content.innerHTML = '<h3><code>' + names + ': </h3>' + hdms + '  <p> lon,lat: ' + lon + ' ' + lat + ' ' + '</code>';
            overlay.setPosition(coordinate);
        }
    });



    // code to add new pins to map
    map.on('click',function(evt) {
        // get the name of the clicked area
        var names = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature.get('name');
        });

        // if clicked area has not been named, then add location
        if (names == undefined){

            //get coordinates of place clicked
            var coordinate = evt.coordinate;
            var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            var lon = lonlat[0];
            var lat = lonlat[1];

            // prompt user to input name of new place, if no name inputed, then 
            // it will prompt user again until a name is inputed
            var locname= prompt("Please enter name of new place", "Name");
            while(locname == "Name")
                locname= prompt("Name is required to add new place","Name");

             
             // check if user cancelled the process
             if (locname != null){
                // add pin to map
                var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([lon,lat],'EPSG:3857', 
                        'EPSG:4326')),
                name: locname
                });

                iconFeature.setStyle(iconStyle);
                vectorSource.addFeature(iconFeature);
            }
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

});