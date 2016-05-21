var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req,res,next) {
  res.send('respond with a resource');
});

router.post('/insertcoin',function(req,res,next){
  var db = req.db;
});


module.exports = router;
