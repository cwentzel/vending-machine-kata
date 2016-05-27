var monk = require("monk");
var db = monk('localhost:27017/vending-machine-db');

/*exports.getProduct = function(prodStr){
    var prod = db.get('products');
    var query = {
        type: prodStr
    };
    return prod.findOne(query);
};*/

exports.getProducts = function(){
    var products = db.get('products');
    var query = {};
    return products.find({});
};

exports.getBank = function(){
    var bank = db.get('bank');
    var query = {};
    return bank.find(query);
};

exports.updateBank = function(coinObj){
    var bank = db.get('bank');
    var query = {};
    var settings = {
        upsert: false,
        multi: false
    };
    return bank.update({},coinObj,settings);
};

exports.updateProduct = function(prodObj){
    var prod = db.get('products');
    var query = {
        type: prodObj.type
    };
    return prod.update(query,prodObj);
};