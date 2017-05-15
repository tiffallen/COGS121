var app = firebase.initializeApp(config);
document.getElementById("logout").onclick = function(){
    console.log("Clicked logout");
    firebase.auth().signOut();
};

document.getElementById("toMap").onclick = function(){
    console.log("Clicked Map");
    window.location.href = '/map.html';
};