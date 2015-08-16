$(document).ready(function(){
	var messageContainer = document.getElementById("messageContainer");
	messageContainer.scrollTop = messageContainer.scrollHeight
	$("#messageInput").keydown(function (event){
		if (event.keyCode == 13){
			postMessage("#messageInput");
		}
	});
});

var socket = io();

var postMessage = function(inputId){
	console.log("posting...");
	var val = $(inputId).val();
	$(inputId).val('');
	if (val == "" || val == null){
		console.log("Invalid input");
		return;
	}
	socket.emit('messageToServer', val);
}
socket.on('messageFromServer', function(msgJson){
	$('#messageContainer').append(
		"<li>" +
			"<div class='messageLeftSide'>" +
			msgJson.message +
			"</div>" +
			"<div class='messageRightSide'>" +
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
			console.log(list[i]);
			$('#messageContainer').append(
				"<li>" +
					"<div class='messageLeftSide'>" +
					list[i].message +
					"</div>" +
					"<div class='messageRightSide'>" +
					list[i].time.dateString +
					"</div>" +
				"</li>"
			);
		}
	}
});
