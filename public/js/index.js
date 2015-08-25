var previousMessage = null;
// TODO setTimeout clearTimeout
window.setInterval(function(){
	console.log("Get");
	$(".userTyping").each(function(i){
		var currentOpacity = $(this).css("opacity");
		console.log(currentOpacity);
		if (currentOpacity != 0){
			var newOpacity = currentOpacity - 0.1 < 0 ? 0 : currentOpacity - 0.1;
			$("#"+user).css("opacity", newOpacity);
		}
	});
}, 50);
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
		"<li>You are not logged in.  Please login with '/login &lt;username&gt;'</li>");
	var messageContainer = document.getElementById("messageContainer");
	messageContainer.scrollTop = messageContainer.scrollHeight
});
socket.on('userIsTyping', function(user){
	if ($("#"+user).length){
		$("#"+user).css("opacity", 1);
	}
	else{
		$("#userTyping").append("<div id='" + user + 
			"' class='userTyping'>" + user + "</div>");
	}
});

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
