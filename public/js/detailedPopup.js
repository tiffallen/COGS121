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
    var picture2 = popUpArray.picture2;
    var picture3 = popUpArray.picture3;
    var sentence = popUpArray.sentence;
    var year = popUpArray.year;
    var artist = popUpArray.artist;
    var checkins = popUpArray.checkins;
    var article1 = popUpArray.article1;
    var article2 = popUpArray.article2;
    var article3 = popUpArray.article3;
    var article4 = popUpArray.article4;
    var article5 = popUpArray.article5;

    document.getElementById('popup-pics1').src = picture;
    document.getElementById('popup-pics2').src = picture2;
    document.getElementById('popup-pics3').src = picture3;
    document.getElementById("popup-year").innerHTML = year;
    document.getElementById("popup-year-title").innerHTML = year;
    document.getElementById("popup-artist").innerHTML = artist;
    document.getElementById("popup-checkins").innerHTML = checkins;

    document.getElementById('article1').innerHTML = article1;
    document.getElementById('article2').innerHTML = article2;
    document.getElementById('article3').innerHTML = article3;
    document.getElementById('article4').innerHTML = article4;
    document.getElementById('article5').innerHTML = article5;
    document.getElementById('article2').style.display = "none";
    document.getElementById('article3').style.display = "none";
    document.getElementById('article4').style.display = "none";
    document.getElementById('article5').style.display = "none";
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
      document.getElementById('article3').style.display = "inline-block";
      document.getElementById('article4').style.display = "inline-block";
      document.getElementById('article5').style.display = "inline-block";
      started = false;
      document.getElementById('readmore-button').innerText = "Read Less";
    }
    else { 
      document.getElementById('article2').style.display = "none";
      document.getElementById('article3').style.display = "none";
      document.getElementById('article4').style.display = "none";
      document.getElementById('article5').style.display = "none";
      started = true;
    }
  };


  $(function(){
  //logout
  document.getElementById("logout").onclick = function(){
    console.log("Clicked logout");
    firebase.auth().signOut();
  };

});


  var slideIndex = 1;
  showDivs(slideIndex);

  function plusDivs(n) {
    showDivs(slideIndex += n);
  }

      function showDivs(n) {
        var i;
        var x = document.getElementsByClassName("mySlides");
        if (n > x.length) {slideIndex = 1}    
        if (n < 1) {slideIndex = x.length}
        for (i = 0; i < x.length; i++) {
           x[i].style.display = "none";  
        }
        x[slideIndex-1].style.display = "block";  
      }