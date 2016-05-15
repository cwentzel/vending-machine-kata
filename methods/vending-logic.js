exports.checkWeight = function(coin){
    var rtn = {result:false,value:false};
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
    var rtn = {result:false,value:false};
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
    if (weight.result == true && diameter.result == true && weight.value == diameter.value){
        rtn.result = true;
        rtn.value = weight.value
    }

    return rtn;
};


