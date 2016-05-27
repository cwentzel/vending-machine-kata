$(function() {
    Money.init();
    VendingMachineClient.init();
});
var Money = {};
var VendingMachineClient = {};

VendingMachineClient.init = function(){
    this.addListeners();
    this.droppableCoinSlot();
    this.droppableBackpack();
    this.droppablePocket();

    this.makeProductDraggable(document.getElementById('product'));
};

VendingMachineClient.product = function(type){
    var product = $('<div/>',
        {
            id: 'product',
            class: 'product',
            html: type
        });
    VendingMachineClient.makeProductDraggable(product);
    return product;
};

VendingMachineClient.dispenseProduct = function(type){
    var dispenser = $('#product-dispense');
    var product = this.product(type);
    dispenser.append(product);
};


VendingMachineClient.droppableCoinSlot = function(){
    $('#coin-slot').droppable({
        accept: '.coin',
        hoverClass: "coin-hover",
        tolarance: "pointer",
        drop: function(e,ui){
            var url = '/insertcoin';
            var data = {};
            data.weight = ui.draggable.attr('data-weight');
            data.diameter = ui.draggable.attr('data-diameter');
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(data){
                    if (data.value != false){
                        VendingMachineClient.updateDisplay(data.message);
                    }
                    else{
                        VendingMachineClient.returnCoin(ui.draggable);
                    }
                },
                error: function(data,status,err){

                }
            });
        },
    });
};

VendingMachineClient.updateDisplay = function(str){
    $('#vending-display').html(str);
};

VendingMachineClient.returnCoin = function(coin){
    var clone = coin.clone(coin);
    clone.draggable();
    $('#coin-return').append(clone);
};

VendingMachineClient.droppableBackpack = function(){
    $('#backpack-pocket').droppable({
        accept: '.product',
        hoverClass: "product-hover",
        drop: function(e,ui ){
        },
    });
};

VendingMachineClient.addListeners = function(){
    //return coins
    $('#return-coins').on(
        'click',
        function(){
            $.ajax({
                type: "GET",
                url: '/returncoins',
                success: function(data){
                    VendingMachineClient.makeChange(data);
                },
                error: function(data,status,err){

                }
            });
        }
    );

    //vend product
    $('.product-button').on(
        'click',
        function(){
            var url = '/selectproduct';
            var data = {};
            data.product = $(this).attr('data-product');
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(data){
                    if (data.code == 0){
                        //do nothing special
                    }
                    else if (data.code == 1){
                        VendingMachineClient.dispenseProduct(data.product);
                    }
                    else if (data.code == 2){
                        VendingMachineClient.dispenseProduct(data.product);
                    }
                    VendingMachineClient.makeChange(data.change);
                    VendingMachineClient.updateDisplay(data.message);
                },
                error: function(data,status,err){

                }
            });
        }
    );
};

VendingMachineClient.makeCoin = function(val){
    var _class = false;
    if (val == 5){
        _class = 'nickel';
    }
    else if (val == 10){
        _class = 'dime';
    }
    else if (val == 25){
        _class = 'nickel'
    }
    var coin = $('<div/>',{
        class: 'coin '+ _class,
        html: val
    });
    coin.draggable({
        revert : 'invalid'
    });
    return coin;
};

VendingMachineClient.makeChange = function(coinobj){
    var keys = Object.keys(coinobj);
    var coinreturn = $('#coin-return');
    keys.forEach(
        function(v,i,a){
            if (v != 'result'){
                var coinset = coinobj[v];
                for (i=0;i<coinset;i++){
                    var coin = VendingMachineClient.makeCoin(v);
                    coinreturn.append(coin);
                    VendingMachineClient.updateDisplay('Insert Coins');
                }
            }
        }
    )
};

VendingMachineClient.makeProductDraggable = function(product){
    $(product).draggable({
        revert: 'invalid'
    });
};

VendingMachineClient.droppablePocket = function(){
    $('#pocket').droppable({
        accept: '.coin',
        hoverClass: "coin-hover",
        drop: function(e,ui){
            $('#coin-return').empty();
        }
    });
};


Money.init = function(){
    this.coins = $('.coin');
    this.draggableCoins(this.coins);
};

Money.draggableCoins = function(coins){
    $.each(
        coins,
        function(i,v){
            var coin = $(v);
            var clone = coin.clone();
            coin.draggable({
                cursor: clone,
                cursorAt: {left: 0, top: 0},
                helper: function(){
                    return clone;
                }
            });
        }
    )
};