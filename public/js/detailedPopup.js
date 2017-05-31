  var PATH = "search";
  var FIREBASE_INDEX = "firebase";
  var PLACE_TYPE = "place";
  var QUERY_SIZE = 1000;
  var app = firebase.initializeApp(config);
  var database = firebase.database();
  var buttonClicked = false;
  var started = false;
  //var ref = new Firebase("https://explore-ucsd.firebaseio.com/");
  //var ref = firebase.database();
  var ref = firebase.database().ref("places");

  var popupName = localStorage.getItem('popupName');
  var popupID = localStorage.getItem('popupUID');

  var goBack = function goBack()
  {
    window.history.back();
  };

  document.getElementById("popup-title").innerHTML = popupName;


  var ref = firebase.database().ref('places/' + popupID);
  console.log(popupName + "(" + popupID + ") : " + ref);
  ref.once('value').then(function(snapshot) { 
    var popUpArray = snapshot.val();
    //console.log(Object.keys(snapshot.val()));
    console.log(snapshot.val());

    var coordinates = popUpArray.coordinates;
    var labels = popUpArray.labels;
    var category_icon = popUpArray.icon_img;
    var picture = popUpArray.picture;
    var sentence = popUpArray.sentence;
    var year = popUpArray.year;
    var artist = popUpArray.artist;
    var checkins = popUpArray.checkins;
    var article1 = popUpArray.article1;
    var article2 = popUpArray.article2;

    document.getElementById('popup-pics').src = picture;
    document.getElementById("popup-year").innerHTML = year;
    document.getElementById("popup-year-title").innerHTML = year;
    document.getElementById("popup-artist").innerHTML = artist;
    document.getElementById("popup-checkins").innerHTML = checkins;

    document.getElementById('article1').innerHTML = article1;
    document.getElementById('article2').innerHTML = article2;
    document.getElementById('article2').style.display = "none";
    started = true;
  });


  function checkinFunction() {
    if(buttonClicked == false) {
      ref.once('value').then(function(snapshot) { 
        var checkins = snapshot.val().checkins;
        checkins = parseInt(checkins) + 1;
        ref.child("checkins").set(checkins);
        document.getElementById("popup-checkins").innerHTML = checkins;
      });
      buttonClicked = true;
    }
  };

  function readmoreFunction() {
    if(started == true) { 
      document.getElementById('article2').style.display = "inline-block";
      started = false;
      document.getElementById('readmore-button').innerText = "Read Less";
    }
    else { 
      document.getElementById('article2').style.display = "none";
      started = true;
    }
  };
