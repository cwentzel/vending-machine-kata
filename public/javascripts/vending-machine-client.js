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

    this.makeProductDraggable(document.getElementById('product'));
};


VendingMachineClient.droppableCoinSlot = function(){
    $('#coin-slot').droppable({
        accept: '.coin',
        hoverClass: "coin-hover",
        drop: function(e,ui ){
            console.log(e);
            console.log(ui);
        },
    });
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
            console.log('buy something');
        }
    );
};

VendingMachineClient.makeProductDraggable = function(product){
    $(product).draggable({
        revert: 'invalid'
    });
};


Money.init = function(){
    this.coins = $('.coin');
    this.draggableCoins(this.coins);


};

Money.draggableCoins = function(coins){
    console.log(coins);
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