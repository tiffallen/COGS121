
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

var app = firebase.initializeApp(config);
var database = firebase.database();
var rootRef = database.ref();
var storageRef = firebase.storage().ref();
var imageUploadSwitch = false;

var goBack = function goBack()
{
    window.history.back();
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

  var waitDialog = bootbox.dialog(
  {
    title: 'Processing...',
    message: '<p><i class="fa fa-spin fa-spinner"></i> Processing...</p>'
});

  setTimeout(function()
  {
    waitDialog.modal('hide');
}, 2000);
};

$(function() {

    document.getElementById("logout").onclick = function(){
        console.log("Clicked logout");
        firebase.auth().signOut();
    };

    
    firebase.auth().onAuthStateChanged(function(user){
        if(user) {
            console.log(user.uid);
            //email
            firebase.database().ref().child('users/' + user.uid + '/email').once('value').then(function(snapshot){
                console.log("email: " + snapshot.val());
            }); 
            
            //user image
            firebase.database().ref().child('users/' + user.uid + '/photoURL').once('value').then(function(snapshot){
                console.log("photo: " + snapshot.val());
                var pic = snapshot.val();
                $('#profilePic').attr('src', pic);
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
            firebase.database().ref().child('users/' + user.uid + '/sites').once('value').then(function(snapshot){
                var user_favorites = snapshot.val();
                if(user_favorites)
                {
                    var count = 0;

                    $.each(user_favorites, function(index, value)
                    {
                        var siteID = value;
                        

                        rootRef.child('places/' + siteID).once('value').then(function(snapshot)
                        {
                            count++;
                            var siteName = snapshot.val().name;
                            var picture = snapshot.val().picture;
                            var labels = snapshot.val().labels;
                            var countColHTML = "<th scope='row'>" + count + "</th>";
                            var nameColHTML = "<td><a class='nameCol' id='col" + count + "' siteID='" + siteID + "'>" + siteName + "</a></td>";
                            var labelColHTML = "<td>" + labels + "</td>";
                            var imageColHTML = "<td><img class='img-fluid' alt='site picture' src='" + picture + "'></td>";
                            var entryHTML = "<tr>" + countColHTML + nameColHTML + labelColHTML + imageColHTML + "</tr>";
                            $('#tableBody').append(entryHTML);
                            $('#col' + count).on('click', function()
                            {
                                localStorage.setItem('popupName', String(siteName));
                                localStorage.setItem('popupUID', String($(this).attr('siteID')));
                                window.location = "detailedPopup.html";
                            });
                        });
                    });
                 // var tblRow =  "<p>" + 
                  //"<span class= " + "'label label-default'" + " > " + user_favorites+ "</span> </p>" ;
                  //$(tblRow).appendTo("#userfavorites");

              }
          }); 


            $('#editButton').click(function(){
                imageUploadSwitch = false;

                var headerHTML = "<h4 class='modal-title'>Edit Profile Picture</h4><br />";
                var imageLabelHTML = "<span>Image</span><br />";
                var imageUploadHTML = "<input type='file' id='files' name='files[]' multiple />"
                var imageURLHTML = "<input class='bootbox-input bootbox-input-text form-control' autocomplete='off' type='text' id='imageInput' name='imageInput' placeholder='Image URL'>";
                var defaultSwitchHTML = "<a href='#' id='defaultSwitch' class='switchText' onclick='switchImageInput()'>Upload via URL instead...</a>";
                var secondarySwitchHTML = "<a href='#' id='secondarySwitch' class='switchText' onclick='switchImageInput()'>Choose file(s) to upload instead...</a>";
                var imageInputHTML = imageLabelHTML + imageUploadHTML + imageURLHTML + "<br />" + defaultSwitchHTML + secondarySwitchHTML + "<br /><br />";
                var bodyHTML = "<div class='bootbox-body'><form class='bootbox-form' id='editProfilePictureForm' role='form'>" + imageInputHTML + "</form></div>";
                var promptHTML = headerHTML + bodyHTML;


                var editProfilePictureCallback = function editProfilePictureCallback()
                {
                    var users = rootRef.child('users');
                    var pictureURL = $('#imageInput').val();

                    if(!pictureURL || pictureURL == null || pictureURL === "")
                    {
                        pictureURL = "img/default_profile.png";
                    }

                    users.child(user.uid + '/photoURL').set(pictureURL);
                    console.log("set new picture: " + pictureURL);


                    var dialog = bootbox.dialog({
                        title: 'Changing picture',
                        message: '<p><i class="fa fa-spin fa-spinner"></i> Changing Picture...</p>'
                    });

                    var waitTime = 2000;

                    dialog.init(function()
                    {
                        setTimeout(function()
                        {
                            dialog.modal('hide');
                        }, 2000);
                    });
                    location.reload();

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
                            callback: editProfilePictureCallback
                        }
                    },
                    onEscape: function() {}
                });

                bootboxForm.init(function()
                {
                    document.getElementById('files').addEventListener('change', handleFileSelect, false);
                });

            });


        } else {
        }
    });





});
