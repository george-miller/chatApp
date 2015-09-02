var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
var log = require('./logSystem.js');

MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	log.log(127001, ' Connected correctly to db');
	db.close();
});

var newMessage = function(io, message, dateObject, user){
	assert.equal(typeof(message), 'string');
	assert.equal(dateObject instanceof Date, true);
	assert.equal(typeof(user), 'string');
	MongoClient.connect(url, function(err, db){

		var messageJson = {
			"message": message,
			"dateObject" : {
				"time" : dateObject.toLocaleTimeString(),
				"month" : dateObject.getMonth()+1,
				"day" : dateObject.getDate(),
				"year": dateObject.getFullYear()
			},
			"user" : user
		};
		db.collection('messageArchive').insertOne(messageJson, function(err, result){
			assert.equal(err, null);
			db.close();
			io.emit('messageFromServer', messageJson);
			log.log(127001, " Inserted document to messageArchive");
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
	newMessage: newMessage,
	getCollectionAndEmit : getCollectionAndEmit
}
