var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	console.log('Connected correctly to db');
	db.close();
});

var newComment = function(io, message, dateObject, user){
	assert.equal(typeof(message), 'string');
	assert.equal(dateObject instanceof Date, true);
	assert.equal(typeof(user), 'string');
	MongoClient.connect(url, function(err, db){

		var messageJson = {
			"message": message,
			"dateObject" : {
				"time" : dateObject.toLocaleTimeString(),
				"month" : dateObject.getMonth(),
				"day" : dateObject.getDate(),
				"year": dateObject.getFullYear()
			},
			"user" : user
		};
		console.log(messageJson);
		db.collection('messageArchive').insertOne(messageJson, function(err, result){
			assert.equal(err, null);
			db.close();
			io.emit('messageFromServer', messageJson);
			console.log("Inserted document to messageArchive");
		});

	});
};
var getCollectionAndEmit = function(socket, collection){

	MongoClient.connect(url, function(err, db){
		assert.equal(err, null);
		var itemsToReturn = [];
		var items = db.collection(collection).find();
		items.each(function(err, item){
			if (item != null){
				itemsToReturn.push(item);
			}
			else{
				socket.emit('listOfMessages', itemsToReturn);
				db.close();		
			}
		});	

	});
};



module.exports = {
	newComment: newComment,
	getCollectionAndEmit : getCollectionAndEmit
}
