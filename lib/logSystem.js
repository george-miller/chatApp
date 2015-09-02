var assert = require("assert");
var log = function(ip, messageTail){
	assert(typeof(messageTail), "string");
	assert(typeof(ip), "number");
	console.log(new Date().toString() + " " + ip + messageTail);
};
module.exports ={
	log : log
}
