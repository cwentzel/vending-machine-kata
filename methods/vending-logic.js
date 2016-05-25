var database = require("../methods/db-logic.js");

exports.hold = {
    5 : 0,
    10 : 0,
    25 : 0
};
exports.bank = {};
exports.product = {};
exports.product.status = false;
exports.product.code = false;
exports.product.type = false;
exports.product.change = false;

exports.checkWeight = function(coin){
    var rtn = {};
    rtn.result = false;
    rtn.value = false;
    if (coin.weight == 5){
        rtn.result = true;
        rtn.value = 5;
    }
    else if (coin.weight == 2.3){
        rtn.result = true;
        rtn.value = 10;
    }
    else if (coin.weight == 5.7){
        rtn.result = true;
        rtn.value = 25;
    }
    return rtn;
};

exports.checkDiameter = function(coin){
    var rtn = {};
    rtn.result = false;
    rtn.value = false;
    if (coin.diameter == 21){
        rtn.result = true;
        rtn.value = 5;
    }
    else if (coin.diameter == 18){
        rtn.result = true;
        rtn.value = 10;
    }
    else if (coin.diameter == 24){
        rtn.result = true;
        rtn.value = 25;
    }
    return rtn;
};

exports.checkCoin = function(coin){
    var rtn,weight,diameter;
    rtn = {};
    rtn.result = false;
    rtn.value = false;
    weight = this.checkWeight(coin);
    diameter = this.checkDiameter(coin);
    if (weight.result === true && diameter.result === true && weight.value == diameter.value){
        rtn.result = true;
        rtn.value = weight.value
    }
    return rtn;
};


exports.coinInserted = function(coin){
    var test,added;
    var rtn ={};
    rtn.result = false;
    rtn.prev = false;
    rtn.new_ = false;
    test = this.checkCoin(coin);
    if (test.result === true){
        rtn.result = true;
        rtn.prev = exports.hold[test.value];
        exports.hold[test.value] += 1;
        rtn.new_ = exports.hold[test.value];
    }
    return rtn;
};

exports.undoCoinInsert = function(coin){
    exports.hold[coin.value_int] = exports.hold[coin.value_int] - 1;
};

exports.getHoldValue = function(){
    var keys,rtn;
    rtn = false;
    keys = Object.keys(exports.hold);
    keys.forEach(
        function(v,i,a){
            var quant = exports.hold[v];
            if (typeof quant === 'number'){
                if(rtn === false){
                    rtn = 0
                }
                rtn += quant * v;
            }
        }
    );
    return rtn;
};

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

exports.calcBankUpdate = function(coinsneeded,coinsinbank){
    var rtn;
    rtn = {};
    rtn[25] = coinsinbank[25] - coinsneeded[25] + exports.hold[25];
    rtn[10] = coinsinbank[10] - coinsneeded[10] + exports.hold[10];
    rtn[5] = coinsinbank[5] - coinsneeded[5] + exports.hold[5];
    return rtn;
};



//substract stock

//return coins from hold

exports.dispenseProduct = function(request){
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
                                var update = database.updateBank(newvals);
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
};

exports.resetHold = function(){
    exports.hold[25] = 0;
    exports.hold[10] = 0;
    exports.hold[5] = 0;
    return exports.hold;
};














