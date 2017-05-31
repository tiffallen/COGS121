
/* Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyAUtYufWXtVSdttPTQKoxt20kuqRuIkZqk ",
    authDomain: "ucsd-explorer-users.firebaseapp.com",
    databaseURL: "https://ucsd-explorer-users.firebaseio.com/",
    storageBucket: "gs://ucsd-explorer-users.appspot.com/"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();
  

var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = snapshot.val().username;
  // ...
});*/
//var app = firebase.initializeApp(config);
//var database = firebase.database();
//alert(firebase.auth().currentUser.email);

  $(function() {


   var people = [];

// get name
   $.getJSON('users.json', function(data) {
       $.each(data.users, function(i, f) {
          var tblRow = "<h1>" + f.names + "</h1>"
           $(tblRow).appendTo("#userdata");
     });

   });


// get year
    $.getJSON('users.json', function(data) {
       $.each(data.users, function(i, f) {
          var tblRow = "<p> Year: " + f.year + "</p>" 
           $(tblRow).appendTo("#useryear");
     });

   });


// get college
    $.getJSON('users.json', function(data) {
       $.each(data.users, function(i, f) {

          var tblRow = "<p>" + f.college + " College</p>" 
           $(tblRow).appendTo("#usercollege");
     });

   });


//get favorite places
    $.getJSON('users.json', function(data) {
       $.each(data.users, function(i, f) {

          var i = 0;

          while(f.favorites[i]){


          var tblRow =  "<p>" + 
          "<span class= " + "'label label-default'" + " > " + f.favorites[i] + "</span> </p>" ;//+
         // "<span class=" + "'label label-primary'" + ">Warren Bear</span>";
          //<span class="label label-success">Geisel</span>

          i++;
       

          
           $(tblRow).appendTo("#userfavorites");
         }
     });

   });


});
