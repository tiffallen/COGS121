
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

  $(function() {
    

   var people = [];
/*    var user = firebase.auth().currentUser;
console.log("blah"); */
var app = firebase.initializeApp(config);


    console.log("blah");
    var user = firebase.auth().currentUser;
 //window.onload = function(){
    console.log("Loaded");
   /*  if(user != null){
        console.log("name: " + user.displayName);
        
    } else {
        console.log(" null value");
        console.log("pic: " + user.photoURL);
    } */
    
    firebase.auth().onAuthStateChanged(function(user){
        if(user) {
            //console.log("name: " + user.uid.displayName);
            //console.log("pic: " + user.uid.photoURL);
            console.log("userID: " + user.uid);
            //console.log("email" + user.uid.user.userID);
            firebase.database().ref().child('users/' + user.uid + '/email').once('value').then(function(snapshot){
                console.log("email: " + snapshot.val());
            }); 
            firebase.database().ref().child('users/' + user.uid + '/photoURL').once('value').then(function(snapshot){
                console.log("photo: " + snapshot.val());
                var pic = snapshot.val();
                var toAdd = "<img src=" + pic + " class = 'img-circle' height='130' width='130' alt='Avatar'>"
                console.log(toAdd);
                $(toAdd).appendTo("#userpic");
            }); 
             firebase.database().ref().child('users/' + user.uid + '/name').once('value').then(function(snapshot){
                console.log("name: " + snapshot.val());
                var username = snapshot.val();
                var tblRow = "<h1>" + username + "</h1>"
                $(tblRow).appendTo("#userdata");
            }); 
        } else {
        }
    });
 

// get name
  /*  $.getJSON('users.json', function(data) {
       $.each(data.users, function(i, f) {
          var tblRow = "<h1>" + f.names + "</h1>"
           $(tblRow).appendTo("#userdata");
     });

   }); */


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
