var express = require('express');
var router = express.Router();
var machine = require("../methods/vending-logic.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Vending Machine' });
  machine.reset();
});

module.exports = router;

router.post(
    '/insertcoin',
    function(req,res){
        var inserted = machine.coinInserted(req.body);
        res.json(machine.insertedState);
    }
);

router.post(
    '/selectproduct',
    function(req,res){
        var product = machine.dispenseProduct(req.body.product);
        res.json(machine.state);
    }
);

router.get(
    '/returncoins',
    function(req,res){
        var holdobj = machine.returnCoins();
        res.json(holdobj);
        machine.resetHold();
    }
);






