var app = require('express')();											// use express for routing
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  });
var sharedsession = require("express-socket.io-session");
var people = {};
var Client = require('node-rest-client').Client;

var client = new Client();

// Attach session
app.use(session);

// Share session with io sockets

io.use(sharedsession(session));

app.get('/', function (req,res){
	res.sendFile(__dirname+"/index.html");
});

app.get('/:fileName', function (req,res){
	res.sendFile(__dirname+"/"+req.params.fileName);
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(__dirname+'/ui/'+req.params.fileName);
});

io.on('connection', function(socket){
	console.log(socket.handshake.session);
	socket.on("new-login",function(msg) {
		var args = {
		    data: {
		    "type": "select",
		    "args": {
		        "table": "Users",
		        "columns": [
		            "*"
		        ],
						"where": {"username" : msg.user}
		    }
		 },
		    headers: { "Content-Type": "application/json", "Authorization" : "Bearer ubrygy622eki09te7ugo0harkcwbpb6i" }
		};
		client.post("https://data.repellent90.hasura-app.io/v1/query", args, function (data, response) {
		    // parsed response body as js object
		    console.log(data);
				if(data.length == 0) {
					var args = {
					    data: {
					    "type": "insert",
					    "args": {
					        "table": "Users",
					        "objects": [{
										"username" : msg.user,
										"password" : msg.pass
									}],
					    }
					 },
					    headers: { "Content-Type": "application/json", "Authorization" : "Bearer ubrygy622eki09te7ugo0harkcwbpb6i" }
					};
					client.post("https://data.repellent90.hasura-app.io/v1/query", args, function (data, response) {
					    // parsed response body as js object
					    console.log(data);
							socket.handshake.session.username = msg.user;
							socket.handshake.session.save(); 														// SAVE LOGIN COOKIE
					});
				}
				else {
					socket.emit("update", "Username Exists");
				}
		    // raw response
		    //console.log(response);
		});
	});

	socket.on("exist-login", function(msg){
		var args = {
				data: {
				"type": "select",
				"args": {
						"table": "Users",
						"columns": [
								"*"
						],
						"where": {"username" : msg.user,"password" : msg.pass}
				}
		 },
				headers: { "Content-Type": "application/json", "Authorization" : "Bearer ubrygy622eki09te7ugo0harkcwbpb6i" }
		};
		client.post("https://data.repellent90.hasura-app.io/v1/query", args, function (data, response) {
				// parsed response body as js object
				console.log(data);
				if(data.length != 0){
					socket.emit("update", "Welcome !");
					socket.handshake.session.username = msg.user;
					socket.handshake.session.save();
				}

		});
	});
});

var port = process.env.PORT || 8080	;																// listen on env or local port

http.listen(port, function(){
	console.log('listening on '+port);
});
