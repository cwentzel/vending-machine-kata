var monk = require("monk");
var db = monk('localhost:27017/vending-machine-db');

exports.checkHold = function(coin){
    var hold = db.get('hold');
    var rtn = false;
    var query = {
        value: coin.value_int
    };
    var doc = hold.findOne(query);
    return doc;
};

exports


