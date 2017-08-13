$(function() {
  var socket = io();

  /*$(".vertical-form.new-user").submit(function(event) {
    event.preventDefault();
  });*/

  $(".vertical-form.new-user button").click(function() {
    var formTemplate = {
      user : "",
      pass : "",
    };
    formTemplate["user"] = $("#user_email").val();
    formTemplate["pass"] = $("#user_password").val();
    socket.emit("new-login",formTemplate);
    return false;
  });

  $(".vertical-form.exist-user button").click(function() {
    var formTemplate = {
      user : "",
      pass : "",
    };
    formTemplate["user"] = $("#user_email1").val();
    formTemplate["pass"] = $("#user_password1").val();
    socket.emit("exist-login",formTemplate);
    return false;
  });

  socket.on("update", function(msg){
    if(msg != "Username Exists"){
      window.location.replace("/index1.html");
    }
    alert(msg);
  })
});
