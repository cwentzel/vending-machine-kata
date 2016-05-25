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
    describe("weigh coins", function() {
        it("weighs coins", function() {
            var result1 = machine.checkWeight(nickel);
            var result2 = machine.checkWeight(dime);
            var result3 = machine.checkWeight(quarter);
            var result4 = machine.checkWeight(fake);
            var result5 = machine.checkWeight("sldkcasd");
            expect(result1).to.deep.equal({result:true,value:5});
            expect(result2).to.deep.equal({result:true,value:10});
            expect(result3).to.deep.equal({result:true,value:25});
            expect(result4).to.deep.equal({result:false,value:false});
            expect(result5).to.deep.equal({result:false,value:false})

        });
    });
    describe("measure coins", function() {
        it("measures coins", function() {
            var result1 = machine.checkDiameter(nickel);
            var result2 = machine.checkDiameter(dime);
            var result3 = machine.checkDiameter(quarter);
            var result4 = machine.checkDiameter(fake);
            var result5 = machine.checkDiameter('sdfwe');
            expect(result1).to.deep.equal({result:true,value:5});
            expect(result2).to.deep.equal({result:true,value:10});
            expect(result3).to.deep.equal({result:true,value:25});
            expect(result4).to.deep.equal({result:false,value:false});
            expect(result5).to.deep.equal({result:false,value:false});
        });
    });
    describe("test coins", function() {
        it("tests coins", function() {
            var result1 = machine.checkCoin(nickel);
            var result2 = machine.checkCoin(dime);
            var result3 = machine.checkCoin(quarter);
            var result4 = machine.checkCoin(fake);
            var result5 = machine.checkCoin('sdfwe');
            expect(result1).to.deep.equal({result:true,value:5});
            expect(result2).to.deep.equal({result:true,value:10});
            expect(result3).to.deep.equal({result:true,value:25});
            expect(result4).to.deep.equal({result:false,value:false});
            expect(result5).to.deep.equal({result:false,value:false});
        });
    });
    describe("add coin to hold",function(){
        var coin = nickel;
        afterEach(function() {
            machine.undoCoinInsert(coin);
        });
        it("if coin inserted and valid, it should be added to hold, hold value for coin will increase by one", function(){
            var result1 = machine.coinInserted(coin);
            var prev1 = result1.prev;
            var new_1 = result1.new_;
            var diff1 = (new_1-prev1);
            expect(diff1).to.equal(1);
        });
    });
    describe("check hold value",function(){
        it("checks total amount in hold, should return a number",function(){
            var result = machine.getHoldValue();
            var int = typeof result;
            expect(int).to.equal('number');
        });
        it("checks total amount in hold, should not return NaN",function(){
            var result = machine.getHoldValue();
            var string = result.toString().trim();
            expect(string).to.not.equal('NaN');
        });
    });
    describe("dispense product",function(){
        it("checks if null is returned by database if valid product request",function(){
            var result1 = database.getProduct('zfgtsdfg');
            return expect(Promise.resolve(result1)).to.eventually.be.null;
        });
        it("checks if a product is returned by database if valid product request",function(){
            var result1 = machine.dispenseProduct('candy');
            return expect(Promise.resolve(result1)).to.eventually.have.property("_id");
        });





    });
    describe("coin bank",function(){
        it("checks to see if bank has an object for each coin",function(){
            var result1 = database.getBank();
            return expect(Promise.resolve(result1)).to.eventually.have.property("_id");
        });
        it("checks to see if bank is updated properly",function(){
            var obj = {25:1,10:1,5:1};
            var result1 = database.updateBank(obj);
            return expect(Promise.resolve(result1)).to.eventually.equal(1);
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
    describe('reset hold to zero', function() {
        it('should reset money in hold to zero', function() {
            machine.hold[25] = 1;
            var result = machine.resetHold();
            expect(result).to.deep.equal({25: 0,10: 0, 5: 0});
        });
    });
    describe('check stock', function() {
        it('checking stock should return an object with a stock property', function() {
            var checkstock = database.getProduct('chips');
            return expect(Promise.resolve(checkstock)).to.eventually.have.property('stock');
        });
    });

});