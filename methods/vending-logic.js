exports.hold = {
    5 : 0,
    10 : 0,
    25 : 0
};

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
    else{
        //return coin
    }
    return rtn;






};



