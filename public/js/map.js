var PATH = "search";
var FIREBASE_INDEX = "firebase";
var PLACE_TYPE = "place";
var QUERY_SIZE = 1000;
var app = firebase.initializeApp(config);
var database = firebase.database();
var storageRef = firebase.storage().ref();
var buttonClicked = false;
var started = false;
var iconFeatureArray = [];
var iconFeatureArrayFiltered = [];
var defaultLabels = ["Art", "Library", "Stuart Collection"];
var allLabels = defaultLabels;
var imageUploadSwitch = false;

var vectorSource = new ol.source.Vector(
{
    features: iconFeatureArrayFiltered
});

var vectorLayer = new ol.layer.Vector(
{
    source: vectorSource
});

var organizeQueryInputs = function organizeQueryInputs(searchTerm, strictMatchTerm, filterTerm)
{
    if(searchTerm)
    {
        doSearch(buildQuery(searchTerm, strictMatchTerm, filterTerm), true);
    }
    else
    {
        doSearch(buildQuery(searchTerm, false, filterTerm), true);
    }
};

var buildQuery = function buildQuery(term=null, matchWholePhrase=false, label=null)
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
};

var buildQueryBody = function buildQueryBody(query, term, matchWholePhrase, label)
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
            body.query.bool.must.push(
            {
                "match_phrase":
                {
                    "_all": term
                }
            });
        }
        else
        {
            body.query.bool.must.push(
            {
                "match":
                {
                    "_all": term
                }
            });
        }
    }

    if(!(label == null || label === "All" || label == false))
    {
        body.query.bool.must.push(
        {
            "match":
            {
                "labels": label
            }
        });
    }
};

  // conduct a search by writing it to the search/request path
  var doSearch = function doSearch(query, recenter=false)
  {
    console.log(query);
    var ref = database.ref().child(PATH);
    var key = ref.child('request').push(query).key;
    ref.child('response/'+key).on('value', function(snap)
    {
        showResults(snap, recenter);
    });
};

var queryLabels = function queryLabels()
{
    var query =
    {
      index: FIREBASE_INDEX,
      type: PLACE_TYPE,
      size: QUERY_SIZE
  };

  query.body=
  {
    "size": 0,
    "aggs" :
    {
        "labels" :
        {
            "terms" :
            {
                "field" : "labels",
                "size": 0,
                "order":
                {
                   "_term" : "asc"
               }
           }
       }
   }
};

var ref = database.ref().child(PATH);
var key = ref.child('request').push(query).key;

ref.child('response/'+key).on('value', function(snap)
{
    if(snap.val() != null && snap.val().aggregations != null && snap.val().aggregations.labels != null && snap.val().aggregations.labels.buckets != null)
    {
        setLabels(snap.val().aggregations.labels.buckets);
    }
});
};

var setLabels = function setLabels(queryResult)
{
    if(queryResult != null && queryResult.length != null && queryResult.length > 0)
    {
        allLabels = [];

        $.each(queryResult, function(index, value)
        {
            allLabels.push(value.key);
        });
    }
};


  // when results are written to the database, read them and display
  var showResults = function showResults(snap, recenter=false)
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
    applyFilter(dat, recenter);
};

var applyFilter = function applyFilter(queryResult, recenter=false)
{
    iconFeatureArrayFiltered = [];

    if (queryResult.hits)
    {
        if(queryResult.hits && queryResult.hits.length > 0)
        {
            $.each(queryResult.hits, function(index, value)
            {
                var resultData = value._source;
                //console.log(value._source);
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
                    coordinates: resultData.coordinates,
                    sentence: resultData.sentence,
                    picture: resultData.picture
                });

                iconFeature1.setStyle(iconStyle);
                iconFeatureArrayFiltered.push(iconFeature1);
            });

            if(queryResult.hits[0] && queryResult.hits[0]._source && queryResult.hits[0]._source.coordinates && recenter)
            {
                map.getView().animate(
                {
                    center: ol.proj.transform(queryResult.hits[0]._source.coordinates, 'EPSG:4326', 'EPSG:3857'),
                    duration: 2000
                });
            }
        } 
    }

    vectorSource.clear();
    vectorSource.addFeatures(iconFeatureArrayFiltered);
    if(queryResult.total === 0)
    {
        bootbox.alert(
        {
            message: "Search returned no results!",
            size: 'small',
            backdrop: true
        });
    }
};

var resizeMap = function resizeMap()
{
    $("#map").css("height", $(window).height() - 55); this.map.updateSize();
}

var populateSelectFilter = function populateSelectFilter()
{
    var optionsAsString = "<option value='All' selected='selected'>All</option>";

    $.each(allLabels, function(index, value)
    {
        optionsAsString += "<option value='" + value + "'>" + value + "</option>";
    });

    $("select[name='selectFilter']").find('option').remove().end().append($(optionsAsString));
};


var switchImageInput = function switchImageInput()
{
    imageUploadSwitch = !imageUploadSwitch;

    if(imageUploadSwitch)
    {
        $('#files').hide();
        $('#defaultSwitch').hide();
        $('#imageInput').show();
        $('#secondarySwitch').show();
    }

    else
    {
        $('#imageInput').hide();
        $('#secondarySwitch').hide();
        $('#files').show();
        $('#defaultSwitch').show();
    }
};

var handleFileSelect = function handleFileSelect(evt)
{
    var files = evt.target.files; // FileList object

    // Loop through the FileList
    for (var i = 0, f; f = files[i]; i++)
    {

      // Only process image files.
      if (!f.type.match('image.*'))
      {
        bootbox.alert(
        {
            message: "Invalid image format!",
            size: 'small',
            backdrop: true
        });

        continue;
    }

    var reader = new FileReader();
    var imageFolder = 'images/';

      // Closure to capture the file information.
      reader.onload = (function(theFile)
      {
        return function(e)
        {
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
            {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });

            var uploadTask = storageRef.child(imageFolder + uuid).put(theFile);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', function(snapshot)
{
    console.log(snapshot);
},
function(error) 
{
    console.error("Error uploading image to firebase storage.", error);
},
function() 
{
  var downloadURL = uploadTask.snapshot.downloadURL;
  $('#imageInput').val(downloadURL);
  console.log("Image uploaded to firebase storage.", downloadURL);
});


};
})(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
  }
};




/******* code to add new pins to map ******/
// Pop up to ask user to click anywhere to add place
var addNewPlace = function addNewPlace()
{
    bootbox.alert(
    {
        message: "Click anywhere on map to add a new site.",
        size: 'small',
        backdrop: true
    });

    buttonClicked = true;


// add pin wherever user clicked
map.on('click', function(evt)
{
    if (buttonClicked == true)
    {
        buttonClicked = false;
        // get the name of the clicked area
        var names = map.forEachFeatureAtPixel(evt.pixel, function(feature)
        {
            return feature.get('name');
        });

        // if clicked area has not been named, then add location
        if (names == undefined)
        {

        //get coordinates of place clicked
        var coordinate = evt.coordinate;
        imageUploadSwitch = false;

        var newname = null;
        var headerHTML = "<h4 class='modal-title'>Add New Site</h4><br />";
        var nameInputHTML = "<input class='bootbox-input bootbox-input-text form-control' autocomplete='off' type='text' id='nameInput' name='nameInput' placeholder='Name'><br />";
        var imageLabelHTML = "<span>Image(s)</span>";
        var imageUploadHTML = "<input type='file' id='files' name='files[]' multiple />"
        var imageURLHTML = "<input class='bootbox-input bootbox-input-text form-control' autocomplete='off' type='text' id='imageInput' name='imageInput' placeholder='Image URL'>";
        var defaultSwitchHTML = "<a href='#' id='defaultSwitch' class='switchText' onclick='switchImageInput()'>Upload via URL instead...</a>";
        var secondarySwitchHTML = "<a href='#' id='secondarySwitch' class='switchText' onclick='switchImageInput()'>Choose file(s) to upload instead...</a>";
        var imageInputHTML = imageLabelHTML + imageUploadHTML + imageURLHTML + "<br />" + defaultSwitchHTML + secondarySwitchHTML + "<br /><br />";
        var checkboxHTML = "<div class='dropdownCheckbox'></div><br />";
        var descriptionHTML = "<textarea class='bootbox-input bootbox-input-textarea form-control' id='descriptionInput' placeholder='Description'></textarea>";
        var inputsHTML = nameInputHTML + imageInputHTML + checkboxHTML + descriptionHTML;
        var bodyHTML = "<div class='bootbox-body'><form class='bootbox-form' id='addNewPlaceForm' role='form'>" + inputsHTML + "</form></div>";

        var promptHTML = headerHTML + bodyHTML;


        var createPlaceCallback = function createPlaceCallback()
        {
            var rootRef = database.ref();
            var places = rootRef.child('places');
            var labels = [];
            var name = $('#nameInput').val();

            if(!name || name == null || name === "")
            {
                name = "Unnamed";
            }

            var pictureURL = $('#imageInput').val();

            if(!pictureURL || pictureURL == null || pictureURL === "")
            {
                pictureURL = "https://tinyurl.com/ln69r72";
            }

            var sentence = $('#descriptionInput').val();

            if(!sentence || sentence == null || sentence === "")
            {
                sentence = "...";
            }

            $.each($('.dropdownCheckbox').dropdownCheckbox('checked'), function(index, value)
            {
                labels.push(value.label);
            });
            
            places.push(
            {
                name: name,
                coordinates: ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'),
                labels: labels,
                icon_img: "img/map-marker.png",
                picture: pictureURL,
                sentence: sentence
            });

            var dialog = bootbox.dialog({
                title: 'Creating Site',
                message: '<p><i class="fa fa-spin fa-spinner"></i> Creating Site...</p>'
            });

            var waitTime = 2000;

            dialog.init(function()
            {
                setTimeout(function()
                {
                    bootbox.hideAll();
                }, 2000);
            });

            setTimeout(function()
            {
                doSearch(buildQuery(), false);
            },
            2000);
        };

        var bootboxForm = bootbox.dialog(
        {
            message: promptHTML, 
            closeButton: true,
            backdrop: true,
            buttons:
            {
                cancel:
                {
                    label: "Cancel",
                    className: "btn-danger"
                },
                confirm:
                {
                    label: "Create",
                    className: "btn-primary",
                    callback: createPlaceCallback
                }
            },
            onEscape: function() {}
        });

        bootboxForm.init(function()
        {
            var allDropdownLabels = [];

            $.each(allLabels, function(index, value)
            {
                allDropdownLabels.push({id: value, label: value});
            });

            $(".dropdownCheckbox").dropdownCheckbox(
            {
                data: allDropdownLabels,
                title: "Select Labels",
                autosearch: true,
                hideHeader: false
            });

            document.getElementById('files').addEventListener('change', handleFileSelect, false);
        });
    }
}
});
};


var setMapSource = function setMapSource(mapType)
{
    if(mapType && mapType != '')
    {
        for (var i = 0, ii = layers.length; i < ii; ++i)
        {
          layers[i].setVisible(styles[i] === mapType);
      }
  }
};

var createRecenterButton = function createRecenterButton(opt_options)
{
    var options = opt_options || {};
    var button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-dot-circle-o fa-fw" aria-hidden="true"></i>';
    var this_ = this;

    var handleRecenter = function handleRecenter()
    {
        this_.getMap().getView().animate(
        {
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

    ol.control.Control.call(this,
    {
        element: element,
        target: options.target
    });
};

var createAddPinButton = function createAddPinButton(opt_options)
{
    var options = opt_options || {};
    var button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-thumb-tack fa-fw" aria-hidden="true"></i>';
    var this_ = this;

    var handleAddPin = function handleAddPin()
    {
        addNewPlace();
    };

    button.addEventListener('click', handleAddPin, false);
    button.addEventListener('touchstart', handleAddPin, false);

    var element = document.createElement('div');
    element.className = 'addPin ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this,
    {
        element: element,
        target: options.target
    });
};

var createSettingsButton = function createSettingsButton(opt_options)
{
    var options = opt_options || {};
    var button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-cog fa-fw" aria-hidden="true"></i>';
    var this_ = this;

    var handleSettings = function handleSettings()
    {
        bootbox.prompt(
        {
            title: "Map Settings",
            inputType: 'select',
            backdrop: true,
            inputOptions:
            [
            {
                text: 'Choose Map Type...',
                value: ''
            },
            {
                text: 'Default',
                value: 'Default'
            },
            {
                text: 'Satellite',
                value: 'Aerial'
            },
            {
                text: 'Road',
                value: 'Road'
            }
            ],
            callback: function (result)
            {
                if(result != '')
                {
                    setMapSource(result);
                }
            }
        });
    };

    button.addEventListener('click', handleSettings, false);
    button.addEventListener('touchstart', handleSettings, false);

    var element = document.createElement('div');
    element.className = 'settings ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this,
    {
        element: element,
        target: options.target
    });
};

$(function()
{
    doSearch(buildQuery(), false);
    queryLabels();
    setMapSource('Default');
    resizeMap();
/*
    $(document).on('click', '[data-toggle="lightbox"]', function(event)
    {
        event.preventDefault();
        $(this).ekkoLightbox();
    });*/

    $(document).click(function (event)
    {
        var clickover = $(event.target);
        console.log(clickover);
        var _opened = $("#navbarCollapse").hasClass("show");
        if (_opened === true && !clickover.hasClass("navbar-toggle") && (clickover.hasClass("ol-unselectable") || clickover.hasClass("searchButton") || clickover.hasClass("fa-search")))
        {
            $("button.navbar-toggler").click();
        }
    });

    setTimeout(populateSelectFilter, 1000);
    setTimeout(populateSelectFilter, 2000);



});



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


/* Function to add data to firebase database
function addNewPin(coor, icon, label, names, pic, description) {
  // A pin entry.
  var pinData = {
    coordinates : coor,
    icon_img : icon,
    labels : label,
    name: names,
    picture: pic,
    sentence : description
  };

  // Get a key for a new Post.
  var newPinKey = firebase.database().ref().child('places').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/places/' + newPinKey] = pinData;
//  updates['/user-posts/' + name + '/' + newPostKey] = pinData;

  return firebase.database().ref().update(updates);
}
*/


ol.inherits(createRecenterButton, ol.control.Control);
ol.inherits(createAddPinButton, ol.control.Control);
ol.inherits(createSettingsButton, ol.control.Control);

var iconStyle2 = new ol.style.Style({
    image: new ol.style.Icon( ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/map-marker.png'
    }))
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




var overlay = new ol.Overlay(({
    autoPan: true,
    autoPanAnimation: {
      duration: 250
  }
}));



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
    new createSettingsButton(),
    new createRecenterButton(),
    new createAddPinButton()
    ]),
    view: view
});


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


    // gets the picture from the json array
    var pic = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('picture');
    });

    // gets the info of the landmark from json array
    var sentence = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('sentence');
    });

    //gets coordinates of place clicked
    var coordinate = evt.coordinate;
    var hdms = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    var lon = hdms[0];
    var lat = hdms[1];

        // clicking anywhere on map will close the popup
        if (names == undefined) {
            //overlay.setPosition(undefined);
            //closer.blur();
        }

        // clicking on pin will cause this to run (displays pop up)
        else { 
            // HTML for what shows on pop up, Title, Rating, Picture, Info
            //content.innerHTML = 

            var titleHTML = "<h4 class='modal-title popup-title'>" + popupName + "</h4><br />";
            var imageHTML = "<img onLoad='this.src=\"" + pic + "\"' alt='site image' src='img/spinner.gif' class='img-fluid rounded mx-auto d-block site-image'>";
            var textHTML = "<p class='popup-text'>" + sentence + "</p>";
            var footerHTML = "<a class='popup-link' onclick='redirectPopup()' href='./detailedPopup.html'>Read more...</a>"
            var bodyHTML = imageHTML + textHTML + footerHTML;
            var bodyWrapperHTML = "<div class='bootbox-body'><div class='container'>" + bodyHTML + "</div></div>";

            var popupHTML = titleHTML + bodyWrapperHTML;

            /*var popupHTML = 
            '<h1>' +  names + ':' +' </h1>' + 


            '<a href= "#"  +'</option>' + '</a>' + '<br />' +

            '<img src= ' +  '../img/fourstars.png' + ' width=60 height="15" ' + '>' + '<br />' +  '<br />' + '<br />' +

            '<p>' +  '<a href=' + pic +'>' + '<img src= ' +  pic + ' width="100" height="60" ' + '>' + '</a>' + 

            sentence + '</option>' + '<a class="popup-link" onclick="redirectPopup()" href="./detailedPopup.html"> Read more..</a>' + '</p>';
            */
            bootbox.dialog(
            {
                message: popupHTML, 
                closeButton: true,
                backdrop: true,
                onEscape: function() {}
            });
        }
    });


function redirectPopup() {
    localStorage.setItem('popupName', String(popupName));
};



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