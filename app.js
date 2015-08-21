var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();

var db = require("./lib/db.js");

var http = require('http').createServer(app);
var io = require('socket.io').listen(http);


io.on('connection', function(socket){
	console.log("a user logged in");
	db.getCollectionAndEmit(socket, 'messageArchive');
	socket.on('disconnect', function(){
		console.log("a user logged off");
	});
	socket.on('messageToServer', function(messageJson){
		db.newMessage(io, messageJson.message, new Date(), messageJson.user);
	})
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/HumanComputer.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.set('port', 3000);

http.listen(3000, '127.0.0.1', function(){
	console.log('up');
});
