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
        drop: function(e,ui){
            console.log('DROPPPPPp');
            var url = '/insertcoin';
            var data = {};
            data.weight = ui.draggable.attr('data-weight');
            data.diameter = ui.draggable.attr('data-diameter');
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(data){
                    console.log(data);
                    if (data.value != false){
                        console.log("GOOD");
                        VendingMachineClient.updateDisplay(data.message);
                    }
                    else{
                        console.log('BAD');
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
            console.log(e);
            console.log(ui);
        },
    });
};

VendingMachineClient.addListeners = function(){
    //return coins
    $('#return-coins').on(
        'click',
        function(){
            console.log('return coins');
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

                    }
                    else if (data.code == 1){
                        VendingMachineClient.dispenseProduct(data.product);
                    }
                    VendingMachineClient.updateDisplay(data.message);
                    console.log(data);
                },
                error: function(data,status,err){

                }
            });
        }
    );
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