var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	console.log('Connected correctly to db');
	db.close();
});

var newComment = function(io, message, time, user){
	assert.equal(typeof(message), 'string');
	assert.equal(time instanceof Date, true);
	assert.equal(typeof(user), 'string');
	MongoClient.connect(url, function(err, db){

		var messageJson = {
			"message": message,
			"time" : {
						"date" : time,
						"dateString" : time.toTimeString().substring(0,8) + 
							"&nbsp;-&nbsp;" + time.toDateString(),
						"dateForMobile" : time.toLocaleTimeString() + 
							" " + time.toLocaleDateString()
					},
			"user" : user
		};
		db.collection('messageArchive').insertOne(messageJson, function(err, result){
			assert.equal(err, null);
			console.log(err);
			db.close();
			io.emit('messageFromServer', messageJson);
			console.log("Inserted document to messageArchive");
		});

	});
};
var getCollectionAndEmit = function(socket, collection){

	MongoClient.connect(url, function(err, db){
		console.log(url);
		console.log(db);
		console.log(err);
		assert.equal(err, null);
		var itemsToReturn = [];
		var items = db.collection(collection).find();
		console.log(items);
		items.each(function(err, item){
			if (item != null){
				itemsToReturn.push(item);
			}
		});	
		console.log(itemsToReturn);
		socket.emit('listOfMessages', itemsToReturn);
		db.close();
	});
};



module.exports = {
	newComment: newComment,
	getCollectionAndEmit : getCollectionAndEmit
}
