var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log("index!");
});

router.post('/', function(req, res){
	if (req.body.message == null || req.body.message == ""){
		res.send("You didn't send a message");
	}
	else{
		fs.close(fs.open("archive.txt", "a", function(err, fd){
			fs.write(fd, (req.body.message + "\n"), function(err, bytesWritten, string){
				if (err) console.log(err);
			});
		})
		);
		res.send(req.body.message);
	}
});

module.exports = router;
