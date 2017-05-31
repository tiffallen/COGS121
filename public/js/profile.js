
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
            //email
            firebase.database().ref().child('users/' + user.uid + '/email').once('value').then(function(snapshot){
                console.log("email: " + snapshot.val());
            }); 
            
            //user image
            firebase.database().ref().child('users/' + user.uid + '/photoURL').once('value').then(function(snapshot){
                console.log("photo: " + snapshot.val());
                var pic = snapshot.val();
                var toAdd = "<img src=" + pic + " class = 'img-circle' height='130' width='130' alt='Avatar'>"
                console.log(toAdd);
                $(toAdd).appendTo("#userpic");
            }); 
            
             //username 
             firebase.database().ref().child('users/' + user.uid + '/name').once('value').then(function(snapshot){
                console.log("name: " + snapshot.val());
                var username = snapshot.val();
                var tblRow = "<h1>" + username + "</h1>"
                $(tblRow).appendTo("#userdata");
            }); 
            
            //user year
            firebase.database().ref().child('users/' + user.uid + '/year').once('value').then(function(snapshot){
                var user_year = snapshot.val();
                if(user_year){
                    var tblRow = "<p> Year: " + user_year + "</p>" 
                    $(tblRow).appendTo("#useryear");
                }
            }); 
            
            //user college
            firebase.database().ref().child('users/' + user.uid + '/college').once('value').then(function(snapshot){
                var user_college = snapshot.val();
                if(user_college){
                    var tblRow = "<p> College : " + user_college + "</p>" 
                    $(tblRow).appendTo("#usercollege");
                }
            }); 
            
            //user favorite places
            firebase.database().ref().child('users/' + user.uid + '/favorites').once('value').then(function(snapshot){
                var user_favorites = snapshot.val();
                if(user_favorites){
                      var tblRow =  "<p>" + 
                      "<span class= " + "'label label-default'" + " > " + user_favorites+ "</span> </p>" ;
                        $(tblRow).appendTo("#userfavorites");
         
                }
            }); 
            
        } else {
        }
    });
 




});
