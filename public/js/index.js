$(document).ready(function(){
	// fill #messageContainer with messages
});

var socket = io();

var postMessage = function(inputId){
	console.log("posting...");
	var val = $(inputId).val();
	if (val == "" || val == null){
		console.log("Invalid input");
		return;
	}
	socket.emit('newMessage', val);
	//$.post('/postMessage', { 'message': $(inputId).val() }, function(data, status){
	//	console.log(data);
	//});
}
