Vue.use(VueFire);

var app = firebase.initializeApp(config);
var rootRef = app.database().ref();
var newUser = false;

function signinSwitch() { 
    document.getElementById('id01').style.display='none';
    document.getElementById('id02').style.display='block';
}
function loginSwitch() { 
    document.getElementById('id01').style.display='block';
    document.getElementById('id02').style.display='none';
}

window.addEventListener('load', function()
{
    var vm = new Vue(
    {
        el: "#app",
        beforeCreate: function()
        {
            firebase.auth().onAuthStateChanged(function(user)
            {                 
                if(user)
                {
                    var userID = user.uid;

                    if(newUser)
                    {
                        console.log("Creating new user entry for NEW user.")

                        rootRef.child('users/' + userID).set(
                        {
                            photoURL: "img/default_profile.jpg",
                            name: document.getElementById("displayName").value,
                            email: user.email,
                            userID: userID,
                            sites: false,
                            year: false,
                            college: false,
                            favorites: false
                        });
                       

                        window.location.href = '/introduction.html';
                    }

                    else
                    {
                        rootRef.child('users').once('value').then(function(snapshot)
                        {
                            if(snapshot.hasChild(userID))
                            {
                                console.log("Database entry already exists.");
                            }
                            
                            else
                            {
                                console.log("Creating new user entry for EXISTING user.");
                                console.log("Name: " + this.userSignup.displayName);
                                rootRef.child('users/' + userID).set(
                                {
                                    photoURL: "img/default_profile.jpg",
                                    displayName: this.userSignup.displayName,
                                    email: user.email,
                                    userID: userID,
                                    sites: false,
                                    year: false,
                                    college: false,
                                    favorites: false
                                });
                            }

                            window.location.href = '/map.html';
                        });
                    }

                } 
            }.bind(this))
        },

        data:
        {
            userSignup:
            {
                displayName: "",
                email: "",
                password: "",
                confirm_password: ""
            },
            userLogin:
            {
                email: "",
                password: ""
            }
        },

        methods:
        {
            processError: function(error)
            {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password')
                {
                    bootbox.alert(
                    {
                        message: "Wrong password.",
                        backdrop: true
                    });
                }
                else if (errorCode == 'auth/weak-password')
                {
                    bootbox.alert(
                    {
                        message: 'The password is too weak.',
                        backdrop: true
                    });
                }
                else
                {
                    bootbox.alert(
                    {
                        message: errorMessage,
                        backdrop: true
                    });
                }
                console.log(error);
            },

            signupUser: function()
            {
                if (this.userSignup.password !== this.userSignup.confirm_password)
                {
                    bootbox.alert(
                    {
                        message: "Passwords don't match.",
                        backdrop: true
                    });
                    return;
                }

                newUser = true;

                var self = this;

                firebase.auth().createUserWithEmailAndPassword(this.userSignup.email, this.userSignup.password).catch(function(error)
                {
                    self.processError(error);
                });
                
                
            },

            login: function()
            {
                var self = this;

                firebase.auth().signInWithEmailAndPassword(this.userLogin.email, this.userLogin.password).catch(function(error)
                {
                    self.processError(error);
                });
            },
            
        }  
        
    });
    
})
