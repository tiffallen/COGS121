Vue.use(VueFire);

var app = firebase.initializeApp(config);
var db = app.database()
var refUsers = db.ref('data/users')
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
                    if(newUser)
                    {
                        window.location.href = '/introduction.html';
                    }
                    else
                    {
                        window.location.href = '/map.html';
                    }

                } 
            }.bind(this))
        },

        data:
        {
            userSignup:
            {
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
                } else
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

                var self = this;
                newUser = true;
                firebase.auth().createUserWithEmailAndPassword(this.userSignup.email, this.userSignup.password).catch(function(error)
                {
                    self.processError(error);
                });
            },

            login: function()
            {
                var self = this;
                var userId = this.userLogin.email;
                firebase.auth().signInWithEmailAndPassword(this.userLogin.email, this.userLogin.password).catch(function(error)
                {
                    self.processError(error);
                });
            },

            googleAuth: function()
            {
                var provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('https://www.googleapis.com/auth/plus.login');
                firebase.auth().signInWithPopup(provider).then(function(result)
                {
                    var user = result.user;
                    var userId = result.user.email;
                    console.log("Google email: " + userId);
                    window.location.href = '/map.html';
                }).catch(function(error)
                {
                    bootbox.alert(
                    {
                        message: error,
                        backdrop: true
                    });
                    console.log(error);
                });
            }
        }
    });
})
