var database = require("../methods/db-logic.js");

//Object Contstuctors
///////////////////////
function Product(v){
    this.type = v.type;
    this.price = v.price;
    this.stock = v.stock;
};

function Bank(v){
    this[25] = v[25];
    this[10] = v[10];
    this[5] = v[5];
};

function Hold(){
    this[25] = 0;
    this[10] = 0;
    this[5] = 0;
};

function State(){
    this.status = false;
    this.code = false;
    this.message = false;
    this.product = false;
    this.change = false;
};

function InsertedState(){
    this.message = false;
    this.value = false;
};

//initiate objects
///////////////////
exports.hold = new Hold();
exports.state = new State();
exports.insertedState = new InsertedState();
exports.bank = {};
exports.products = {};

exports.initProducts = function(){
    var products = database.getProducts();
    products.then(function(doc){
        doc.forEach(function(v,i,a){
            exports.products[v.type] = new Product(v);
        })
    })
};

exports.initBank = function(){
    var bank = database.getBank();
    bank.then(function(doc){
        doc.forEach(function(v,i,a){
            exports.bank = new Bank(v);
        });
    });
};


exports.initProducts();
exports.initBank();


exports.reset = function(){
    exports.hold = new Hold();
    exports.state = new State();
    exports.insertedState = new InsertedState();
    exports.bank = {};
    exports.products = {};
    exports.initProducts();
    exports.initBank();
};
//HOLD object methods
///////////////////////



//BANK object methods
///////////////////////
exports.calcBankUpdate = function(coinsneeded,coinsinbank){
    var rtn;
    rtn = {};
    rtn[25] = coinsinbank[25] - coinsneeded[25] + exports.hold[25];
    rtn[10] = coinsinbank[10] - coinsneeded[10] + exports.hold[10];
    rtn[5] = coinsinbank[5] - coinsneeded[5] + exports.hold[5];
    return rtn;
};

exports.updateBank = function(obj){
    database.updateBank(obj);
};

exports.getBank = function(){
    return exports.bank;
};


//PRODUCT object methods
////////////////////////
exports.getProduct = function(prodStr){
    return exports.products[prodStr];
};

exports.updateProduct = function(prodStr){
    var prodObj = exports.products[prodStr];
    var update = database.updateProduct(prodObj);
};

exports.substractFromStock = function(prodStr){
    exports.products[prodStr].stock = exports.products[prodStr].stock - 1;
};

exports.getProductStock = function(prodStr){
    return exports.products[prodStr].stock;
};

exports.getProductPrice = function(prodStr){
    return exports.products[prodStr].price;
};





//STATUS object methods
///////////////////////
exports.setStateStatus = function(status){
    exports.state.status = status;
};

exports.getStateStatus = function(){
    return exports.state.status;
};

exports.setStateCode = function(code){
    exports.state.code = code;
};

exports.getStateCode = function(){
    return exports.state.code;
};

exports.setStateMessage = function(message){
    exports.state.message = message;
};

exports.getStateMessage = function(){
    return exports.state.message;
};

exports.setStateProduct = function(product){
    exports.state.product = product;
};

exports.getStateProduct = function(){
    return exports.state.product;
};

exports.setStateChange = function(change){
    exports.state.change = change;
};

exports.getStateChange = function(){
    return exports.state.change;
};
exports.resetState = function(){
    exports.setStateStatus(false);
    exports.setStateCode(false);
    exports.setStateMessage(false);
    exports.setStateProduct(false);
    exports.setStateChange(false)
};


//HOLD object methods
///////////////////////
exports.addCoinToHold = function(val){
    exports.hold[val] = exports.hold[val]+1;
};
exports.removeCoinFromHold = function(val){
    exports.hold[val] = exports.hold[val]-1;
};
exports.returnCoins = function(){
    exports.setStateChange(exports.hold);
    exports.resetHold();
};
exports.resetHold = function(){
    var keys;
    keys = Object.keys(exports.hold);
    keys.forEach(
        function(v,i,a){
            return exports.hold[v] = 0;
        }
    );
};
exports.getHoldValue = function(){
    var keys,rtn;
    rtn = false;
    keys = Object.keys(exports.hold);
    keys.forEach(
        function(v,i,a){
            if (typeof exports.hold[v] === 'number'){
                if(rtn === false){
                    rtn = 0
                }
                console.log(rtn);
                rtn += exports.hold[v] * v;
            }
        }
    );
    return rtn;
};


//COIN test methods
////////////////////
exports.checkWeight = function(coin){
    var rtn = false;
    if (coin.weight == 5){
        rtn = 5;
    }
    else if (coin.weight == 2.3){
        rtn = 10;
    }
    else if (coin.weight == 5.7){
        rtn = 25;
    }
    return rtn;
};

exports.checkDiameter = function(coin){
    var rtn = false;
    if (coin.diameter == 21){
        rtn = 5;
    }
    else if (coin.diameter == 18){
        rtn = 10;
    }
    else if (coin.diameter == 24){
        rtn = 25;
    }
    return rtn;
};

exports.checkCoin = function(coin){
    var rtn,weight,diameter;
    rtn = false;
    weight = exports.checkWeight(coin);
    diameter = exports.checkDiameter(coin);
    if (weight != false && diameter != false && weight === diameter){
        rtn = weight;
    }
    return rtn;
};

exports.coinInserted = function(coin){
    var test,added;
    var rtn = false;
    test = this.checkCoin(coin);
    if (test != false){
        rtn = test;
        exports.addCoinToHold(test);
        exports.insertedState.value = test;
        exports.insertedState.message = 'TOTAL: '+exports.getHoldValue()+'&#162;';
    }
    else{
        exports.insertedState.value = false;
        exports.insertedState.message = false;
    }

    return rtn;
};


//OTHER METHODS
////////////////////
exports.getNeededCoins = function(changeneeded,coinsinbank){
    var rtn,lefttogive;
    rtn = {};
    rtn[25] = 0;
    rtn[10] = 0;
    rtn[5] = 0;
    rtn.result = null;
    rtn['25'] = Math.floor(changeneeded/25);
    if (coinsinbank[25] < rtn['25']){
        rtn['25'] = coinsinbank[25];
    }
    lefttogive = (changeneeded-(rtn['25']*25));
    if (lefttogive != 0){
        rtn['10'] = Math.floor(lefttogive/10);
        if (coinsinbank[10] < rtn['10']){
            rtn['10'] = coinsinbank[10];
        }
        lefttogive = (lefttogive-(rtn['10']*10));
        if (lefttogive != 0){
            rtn['5'] = Math.floor(lefttogive/5);
            if (coinsinbank[5] < rtn['5']){
                rtn['5'] = coinsinbank[5];
            }
            lefttogive = (lefttogive-(rtn['5']*5));
        }
    }
    if (lefttogive == 0){
        rtn.result = true;
    }
    else{
        rtn.result = false;
        rtn[25] = 0;
        rtn[10] = 0;
        rtn[5] = 0;
    }
    return rtn;
};

/////////
///CODES
// 0 = not enough inserted
// 1 = purchase approved, no change
// 2 = purchase approved, change needed
// 3 = not in stock
// 4 = exact change only



//I think the key here is to preload the products into an object for instant comparison
//ditto with the bank.  Why am I making this so hard.
exports.dispenseProduct = function(prodStr) {
    var inserted, status, code, message, product, change, price, stock, bank, changeneeded, coinsneeded;
    exports.resetState();
    inserted = exports.getHoldValue();
    price = exports.getProductPrice(prodStr);
    stock = exports.getProductStock(prodStr);
    bank = exports.getBank();
    changeneeded = inserted - price;
    coinsneeded = exports.getNeededCoins(changeneeded,bank);
    if (inserted < price) {
        status = false;
        code = 0;
        message = 'PRICE ' + price;
        product = false;
        change = inserted;
    }
    if (inserted == price) {
        if (stock > 0) {
            status = true;
            code = 1;
            message = 'THANK YOU';
            product = prodStr;
            change = false;
        }
        else {
            status = false;
            code = 1;
            message = 'SOLD OUT';
            product = false;
            change = inserted;
        }
    }
    if (inserted > price) {
        if (stock > 0) {
            if (coinsneeded.result == true) {
                status = true;
                code = 1;
                message = 'THANK YOU';
                product = prodStr;
                change = coinsneeded;
            }
            else {
                status = false;
                code = 1;
                message = 'EXACT CHANGE ONLY';
                product = false;
                change = inserted;
            }
        }
        else {
            status = false;
            code = 1;
            message = 'SOLD OUT';
            product = false;
            change = inserted;
        }

    }
    exports.setStateStatus(status);
    exports.setStateCode(code);
    exports.setStateMessage(message);
    exports.setStateProduct(product);
    exports.setStateChange(change);
    if (status == true){
        var newvals = exports.calcBankUpdate(coinsneeded,bank);
        var updatebank = exports.updateBank(newvals);
        var adjuststock = exports.substractFromStock(prodStr);
        var updateproduct = exports.updateProduct(prodStr);
    }
};


//UNDO tests
exports.undoProductUpdate = function(prodStr){
    console.log('gggggggggggggggggggggggggggggggggggggggggggggggg');
    console.log(exports.products[prodStr]);
    database.updateProduct(exports.products[prodStr]);
};

exports.undoBankUpdate= function() {
    database.updateBank(exports.bank);
};



/*exports.dispenseProduct = function(request){
    var prodRequest = database.getProduct(request);
    prodRequest.then(
        function(doc) {
            if (doc) {
                var inserted = exports.getHoldValue();
                if (inserted < doc.price) {
                    exports.product.status = true;
                    exports.product.message = 'PRICE ' + doc.price;
                    exports.product.type = false;
                    exports.product.change = false;
                }
                if (inserted == doc.price) {
                    if (doc.stock > 0) {
                        exports.product.status = true;
                        exports.product.message = 'THANK YOU';
                        exports.product.type = doc.type;
                        exports.product.change = false;
                    }
                    else{
                        exports.product.status = false;
                        exports.product.message = 'SOLD OUT';
                        exports.product.type = false;
                        exports.product.change = false;
                    }
                }
                if (inserted > doc.price) {
                    if (doc.stock > 0){
                        var bank = database.getBank();
                        bank.then(function(coinsinbank) {
                            var changeneeded = (inserted - doc.price);
                            var coinsneeded = exports.getNeededCoins(changeneeded,coinsinbank);
                            if (coinsneeded.result == true){
                                var newvals = exports.calcBankUpdate(coinsneeded,coinsinbank);
                                var update = exports.updateBank(newvals);
                                exports.product.status = true;
                                exports.product.message = 'THANK YOU';
                                exports.product.type = doc.type;
                                exports.product.change = coinsneeded;
                            }
                            else{
                                exports.product.status = false;
                                exports.product.message = 'EXACT CHANGE ONLY';
                                exports.product.type = false;
                                exports.product.change = false;
                            }
                        });
                    }
                    else{
                        exports.product.status = false;
                        exports.product.message = 'SOLD OUT';
                        exports.product.type = false;
                        exports.product.change = false;
                    }
                }
            }
            else{
                exports.product.status = false;
                exports.product.message = 'OUT OF ORDER';
                exports.product.type = false;
            }
        });
    return prodRequest;
};*/














