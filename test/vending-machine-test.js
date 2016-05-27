var chai = require("chai");
var expect = chai.expect;
var should = chai.should();
var chaiAsPromised = require("chai-as-promised");
var machine = require("../methods/vending-logic.js");
var database = require("../methods/db-logic.js");
chai.use(chaiAsPromised);

var nickel = {"name" : "nickel",
    "value_dec" : "0.05",
    "value_int" : "5",
    "weight" : "5",
    "diameter" : "21"};

var dime = {
    "name" : "dime",
    "value_dec" : "0.1",
    "value_int" : "10",
    "weight" : "2.3",
    "diameter" : "18"
};

var quarter = {
    "name" : "quarter",
    "value_dec" : "0.25",
    "value_int" : "25",
    "weight" : "5.7",
    "diameter" : "24"
};
var fake = {
    "name" : "fake",
    "value_dec" : "0",
    "value_int" : "0",
    "weight" : "4.3",
    "diameter" : "19"
};


describe("Vending Machine", function() {
    before(function(){
        machine.initProducts();
        machine.initBank();
    });
    describe("coin tests", function() {
        it("weighs coins, value returned if valid", function() {
            var result1 = machine.checkWeight(nickel);
            var result2 = machine.checkWeight(dime);
            var result3 = machine.checkWeight(quarter);
            var result4 = machine.checkWeight(fake);
            var result5 = machine.checkWeight("sldkcasd");
            expect(result1).to.equal(5);
            expect(result2).to.equal(10);
            expect(result3).to.equal(25);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
        it("measures coins, value returned if valid", function() {
            var result1 = machine.checkDiameter(nickel);
            var result2 = machine.checkDiameter(dime);
            var result3 = machine.checkDiameter(quarter);
            var result4 = machine.checkDiameter(fake);
            var result5 = machine.checkDiameter('sdfwe');
            expect(result1).to.equal(5);
            expect(result2).to.equal(10);
            expect(result3).to.equal(25);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
        it("tests coins, value returned if valid", function() {
            var result1 = machine.checkCoin(nickel);
            var result2 = machine.checkCoin(dime);
            var result3 = machine.checkCoin(quarter);
            var result4 = machine.checkCoin(fake);
            var result5 = machine.checkCoin('dxsfgsdfg');
            expect(result1).to.equal(5);
            expect(result2).to.equal(10);
            expect(result3).to.equal(25);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });
    describe("tests database",function(){
        it("when bank it retrieved, it returns a valid bank object",function(){
            var result1 = database.getBank();
            return expect(Promise.resolve(result1)).to.eventually.have.length(1);
        });
        it("when products are retrieved, it returns a valid array with length of 3",function(){
            var result1 = database.getProducts();
            return expect(Promise.resolve(result1)).to.eventually.have.length(3);
        });
        it("when a product is updated, it checks to see if a 1 is return by update function",function(){
            var prod = 'chips';
            var original = machine.products[prod];
            var test_product = {
                type : 'chips',
                price : '50',
                stock : '10'
            };
            after(function() {
                database.updateProduct(original);
            });
            var result1 = database.updateProduct(test_product);
            return expect(Promise.resolve(result1)).to.eventually.equal(1);
        });
        it("when products are retrieved, it..................",function(){
            var bank = {
                '25': 66,
                '10': 66,
                '5': 66
            };
            before(function(){
                machine.initBank();
                });
            after(function() {
                machine.undoBankUpdate();
            });
            var result1 = database.updateBank(bank);
            return expect(Promise.resolve(result1)).to.eventually.equal(1);
        });
    });
    describe("coin inserted",function(){
       it("when a coin is inserted, it is checked and added to hold if valid coin",function(){
           var coin = nickel;
           var result1 = machine.coinInserted(coin);
           after(function(){
               machine.removeCoinFromHold(coin.value_int);
           });
           expect(machine.hold[coin.value_int]).to.equal(1);
       });
    });
    describe("make change",function(){
        it("checks to see if correct amount of coins are found",function(){
            var bank = {5:1,10:1,25:1};
            var result1 = machine.getNeededCoins(35,bank);
            var result2 = machine.getNeededCoins(70,bank);
            var result3 = machine.getNeededCoins(105,bank);
            var result4 = machine.getNeededCoins(15,bank);
            expect(result1).to.deep.equal({25: 1,10: 1, 5: 0,result: true});
            expect(result2).to.deep.equal({25: 0,10: 0, 5: 0,result: false});
            expect(result3).to.deep.equal({25: 0,10: 0, 5: 0,result: false});
            expect(result4).to.deep.equal({25: 0,10: 1, 5: 1,result: true});
        });
    });
    describe('product methods', function() {
        var prod = 'candy';
        it('when getProduct() called, a product is returned',function(){
            var result = machine.getProduct(prod);
            expect(result).to.have.property('type');
            expect(result).to.have.property('price');
            expect(result).to.have.property('stock');
        });
        it('when getProductStock() called, a number is returned', function() {
            var result = machine.getProductStock(prod);
            expect(result).to.be.a('number');
        });
        it('when getProductPrice() called, a number is returned', function() {
            var result = machine.getProductPrice(prod);
            expect(result).to.be.a('number');
        });
        it('when substractFromStock() called, stock is reduced', function() {
            var stockBefore = machine.getProductStock(prod);
            var test = machine.substractFromStock(prod);
            var stockAfter = machine.getProductStock(prod);
            var result = (parseInt(stockBefore) - parseInt(stockAfter));
            expect(result).to.equal(1);
        });
    });
    describe("hold object methods",function(){
        var coin = nickel;
        beforeEach(function(){
            machine.hold = {5:2,10:2,25:2};
        });
        afterEach(function(){
            machine.resetHold();
        });
        it("when get hold value called, a number is returned",function(){
            var result = machine.getHoldValue();
            expect(result).to.be.a('number');
        });
        it("when resetHold is called, values in hold are reset to zero",function(){
            var result = machine.resetHold();
            expect(machine.hold).to.deep.equal({25: 0,10: 0, 5: 0});
        });
        it("when a coin is added to hold, the hold value for that coin is increased by one",function(){
            var before = machine.hold[coin.value_int];
            var result = machine.addCoinToHold(coin.value_int);
            var after = machine.hold[coin.value_int];
            expect(after-before).to.equal(1);
        });
        it("when a coin is substract from hold, the hold value for that coin is decreased by one",function(){
            var before = machine.hold[coin.value_int];
            var result = machine.removeCoinFromHold(coin.value_int);
            var after = machine.hold[coin.value_int];
            expect(before-after).to.equal(1);
        });
    });
});