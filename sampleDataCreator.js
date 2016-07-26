var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var log = require('./lib/logSystem.js');

MongoClient.connect(url, function(err, db){
	log.log(127001, ' Connected correctly to db');
    var d1 = new Date(2014, 5, 17, 10, 34, 22);
    var d2 = new Date(2015, 2, 5, 23, 55, 41);
    var d3 = new Date(2015, 6, 28, 18, 41, 2);
    var d4 = new Date(2015, 11, 30, 10, 34, 6);
    var d5 = new Date(2016, 2, 18, 9, 4, 3);
    db.collection('messageArchive').insertMany([
    {
        "message": "Hello, this is anon",
        "dateObject" : {
            "time" : d1.toLocaleTimeString(),
            "month" : d1.getMonth()+1,
            "day" : d1.getDate(),
            "year": d1.getFullYear()
        },
        "user" : "anon"
    },
    {
        "message": "It works!",
        "dateObject" : {
            "time" : d2.toLocaleTimeString(),
            "month" : d2.getMonth()+1,
            "day" : d2.getDate(),
            "year": d2.getFullYear()
        },
        "user" : "anon"
    },
    {
        "message": "You can even see when a use is typing",
        "dateObject" : {
            "time" : d3.toLocaleTimeString(),
            "month" : d3.getMonth()+1,
            "day" : d3.getDate(),
            "year": d3.getFullYear()
        },
        "user" : "anon"

    },
    {
        "message": "I am logged in as George",
        "dateObject" : {
            "time" : d4.toLocaleTimeString(),
            "month" : d4.getMonth()+1,
            "day" : d4.getDate(),
            "year": d4.getFullYear()
        },
        "user" : "george"
    },
    {
        "message": "Still works!",
        "dateObject" : {
            "time" : d5.toLocaleTimeString(),
            "month" : d5.getMonth()+1,
            "day" : d5.getDate(),
            "year": d5.getFullYear()
        },
        "user" : "george"
    }], function(err, result){
       if (err){
        log.log(err);
       } else {
        log.log(result);
       }
	   db.close();
    });
});

