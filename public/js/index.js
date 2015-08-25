var previousMessage = null;
var userTypingTimeouts = [];
var users = [];
// TODO setTimeout clearTimeout
$(document).ready(function(){
	$("#messageInput").keydown(function (event){
		if (event.keyCode == 13){
			postMessage("#messageInput");
		}
		else {
			// User is typing event
			socket.emit("userIsTyping", {"user" : user});
		}
	});
});

var socket = io();
var user = "anon";

socket.on('messageFromServer', function(msgJson){appendMessageFromJson(msgJson)});

socket.on('listOfMessages', function(list){
	for (var i = 0; i < list.length; i++){
		if (list[i].message != null){
			appendMessageFromJson(list[i]);
		}
	}
	$("#messageContainer").append(
		"<li>You are logged in as 'anon'.  Please login with '/login &lt;username&gt;'</li>");
	var messageContainer = document.getElementById("messageContainer");
	messageContainer.scrollTop = messageContainer.scrollHeight
});
socket.on('userIsTyping', function(user){
	console.log(user);
	var userTimeoutIndex = users.indexOf(user);
	console.log(userTimeoutIndex);
	// If the user doesn't currently exist
	if (userTimeoutIndex == -1) {
		users.push(user);
		console.log(users);
		$("#userTyping").append("<div id='" + user + 
			"' class='userTyping'>..." + user + "...</div>");	
		$("#"+user).css("opacity", 1);
		console.log("fdsaf");
		var userTimeout = window.setTimeout(function(){stopFunction(user);}, 1000);
		userTypingTimeouts.push(userTimeout);
		
	}
	else{
		$("#"+user).css("display", "inline");
		clearTimeout(userTypingTimeouts[userTimeoutIndex]);
		userTimeout = window.setTimeout(function(){stopFunction(user);}, 1000);
	}
});
var stopFunction = function(user){
	console.log("Stopped");
	$("#"+user).css("display", "none");
};

var postMessage = function(inputId){
	console.log("posting...");
	var val = $(inputId).val();
	$(inputId).val('');
	if (val == "" || val == null){
		console.log("Invalid input");
		return;
	}
	if (val.substring(0,1) == "/"){
		console.log("command");
		processCommand(val.substring(1,val.length));
	}
	else{
		socket.emit('messageToServer', { "message": val, "user": user});
	}
}
var processCommand = function(val){
	var valIndex = 0;
	while (val.charAt(valIndex) != ' ' && valIndex < val.length){
		valIndex++;
	}
	var command = val.substring(0, valIndex);
	if (command == 'login'){
		user = val.substring(valIndex+1, val.length);
		if (user == ""){
			console.log("Empty usernames not allowed");
			return;
		}
		for (var i=0; i < user.length; i++){
			if (user.charAt(i) == " "){
				console.log("Spaces are not allowed in usernames");
				return;
			}
		}
		$("#messageContainer").append("<li>You are now logged in as "+ user +"</li>");
		var messageContainer = document.getElementById("messageContainer");
		messageContainer.scrollTop = messageContainer.scrollHeight
	}
};
var appendMessageFromJson = function(msgJson){
	addDateBannerIfNecessary(msgJson);
	previousMessage = msgJson;
	$('#messageContainer').append(
		"<li>" +
			"<div class='messageUser'>" +
			msgJson.user + "</div>" +
			"<div class='messageContent'>" +
			msgJson.message +
			"</div>" +
			"<div class='messageDate'>" +
			msgJson.dateObject.time +
			"</div>" +
		"</li>"
	);
	var messageContainer = document.getElementById("messageContainer");
	messageContainer.scrollTop = messageContainer.scrollHeight;
};
var addDateBannerIfNecessary = function(msgJson){
	if (previousMessage == null){
		$('#messageContainer').append(
			"<li class='dateBanner'>" + (msgJson.dateObject.month) + "/" +
			(msgJson.dateObject.day) + "/" +
			(msgJson.dateObject.year) + "</li>"	
		);
	}
	else if (previousMessage.dateObject.day != msgJson.dateObject.day ||
			previousMessage.dateObject.month != msgJson.dateObject.month ||
			previousMessage.dateObject.year != msgJson.dateObject.year
			){
		$('#messageContainer').append(
			"<li class='dateBanner'>" + (msgJson.dateObject.month) + "/" +
			(msgJson.dateObject.day) + "/" +
			(msgJson.dateObject.year) + "</li>"	
		);
	}
};
