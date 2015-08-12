$(document).ready(function(){
	// fill #messageContainer with messages
});

var postMessage = function(inputId){
	console.log("posting...");
	var val = $(inputId).val();
	if (val == "" || val == null){
		console.log("Invalid input");
		return;
	}
	$.post('/postMessage', { 'message': $(inputId).val() }, function(data, status){
		console.log(data);
	});
}
