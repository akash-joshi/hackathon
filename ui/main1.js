$(function() {
  var socket = io();

  socket.on("update", function(msg){
    if(msg != "Username Exists"){
      window.location.replace("/index1.html");
    }
    alert(msg);
  })
});
