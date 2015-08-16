$(document).ready(function(){
	$("#messageInput").keydown(function (event){
		if (event.keyCode == 13){
			postMessage("#messageInput");
		}
	});
});

var socket = io();
var user = "anon";

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
		return;
	}
	socket.emit('messageToServer', { "message": val, "user": user});
}
var processCommand = function(val){
	var valIndex = 0;
	while (val.charAt(valIndex) != ' '){
		valIndex++;
	}
	var command = val.substring(0, valIndex);
	if (command == 'login'){
		user = val.substring(valIndex, val.length);
		$("#messageContainer").append("<li>You are now logged in as "+ user +"</li>");
		var messageContainer = document.getElementById("messageContainer");
		messageContainer.scrollTop = messageContainer.scrollHeight
	}
}

socket.on('messageFromServer', function(msgJson){
	$('#messageContainer').append(
		"<li>" +
			"<div class='messageUser'>" +
			msgJson.user + "</div>" +
			"<div class='messageContent'>" +
			msgJson.message +
			"</div>" +
			"<div class='messageDate'>" +
			msgJson.time.dateString +
			"</div>" +
		"</li>"
	);
	var messageContainer = document.getElementById("messageContainer");
	messageContainer.scrollTop = messageContainer.scrollHeight
});
socket.on('listOfMessages', function(list){
	for (var i = 0; i < list.length; i++){
		if (list[i].message != null){
			$('#messageContainer').append(
				"<li>" +
					"<div class='messageUser'>" +
					list[i].user + "</div>" +
					"<div class='messageContent'>" +
					list[i].message +
					"</div>" +
					"<div class='messageDate'>" +
					list[i].time.dateString +
					"</div>" +
				"</li>"
			);
		}
	}
	$("#messageContainer").append(
		"<li>You are not logged in.  Please login with '/login &lt;username&gt;'</li>");
	var messageContainer = document.getElementById("messageContainer");
	messageContainer.scrollTop = messageContainer.scrollHeight
});
