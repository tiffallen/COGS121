var app = firebase.initializeApp(config);
document.getElementById("logout").onclick = function(){
    console.log("Clicked logout");
    firebase.auth().signOut();
    window.location.href = '/login.html';
};

document.getElementById("toMap").onclick = function(){
    console.log("Clicked Map");
    window.location.href = '/map.html';
};

$('.title').click(function(){
    $(this).nextUntil('tr.title').slideToggle(1000);
});




