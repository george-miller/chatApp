var onMobile = false;
var previousMessage = null;
$(document).ready(function(){
	$("#messageInput").keydown(function (event){
		if (event.keyCode == 13){
			postMessage("#messageInput");
		}
	});
	if ($(window).width() < 480){
		console.log("Mobile!");
		onMobile = true;
	}
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
	messageContainer.scrollTop = messageContainer.scrollHeight
};
var addDateBannerIfNecessary = function(msgJson){
	if (previousMessage == null){
		$('#messageContainer').append(
			"<li class='dateBanner'>" + (msgJson.dateObject.month+1) + "/" +
			(msgJson.dateObject.day+1) + "/" +
			(msgJson.dateObject.year) + "</li>"	
		);
		return;
	}
	if (previousMessage.dateObject.date != msgJson.dateObject.date ||
			previousMessage.dateObject.month != msgJson.dateObject.month ||
			previousMessage.dateObject.year != msgJson.dateObject.year
			){
		$('#messageContainer').append(
			"<li class='dateBanner'>" + (msgJson.dateObject.month+1) + "/" +
			(msgJson.dateObject.day+1) + "/" +
			(msgJson.dateObject.year) + "</li>"	
		);
	}
}
