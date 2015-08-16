var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	console.log('Connected correctly to server');
	db.close();
});

var newComment = function(io, message, time, user){
	MongoClient.connect(url, function(err, db){

		var messageJson = {
			"message": message,
			"time" : {
						"date" : time,
						"dateString" : time.toTimeString().substring(0,8) + "&nbsp;-&nbsp;" + time.toDateString()
					},
			"user" : user
		};
		db.collection('messageArchive').insertOne(messageJson, function(err, result){
			assert.equal(err, null);
			db.close();
			io.emit('messageFromServer', messageJson);
			console.log("Inserted document to messageArchive");
		});

	});
};
var getCollection = function(socket, collection){

	MongoClient.connect(url, function(err, db){
		assert.equal(err, null);
		var itemsToReturn = [];
		var items = db.collection(collection).find();
		items.each(function(err, item){
			if (item != null){
				itemsToReturn.push(item);
			}
			else{
				db.close();
				socket.emit('listOfMessages', itemsToReturn);
			}
		});	
		
	});
};



module.exports = {
	newComment: newComment,
	getCollection : getCollection
}
