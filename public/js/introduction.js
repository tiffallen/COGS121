var app = firebase.initializeApp(config);

document.getElementById("toMap").onclick = function(){
    console.log("Clicked Map");
    window.location.href = '/map.html';
};

$('.title').click(function(){
    $(this).nextUntil('tr.title').slideToggle(1000);
});



document.getElementById("title").onClick = function(){
    $(this).nextUntil('tr.title').slideToggle(1000);
    
}

window.onload = function(){
    document.getElementById("title").slideToggle(1000);
}