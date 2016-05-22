var chai = require("chai");
var expect = chai.expect;
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
    describe("check hold", function() {
        it("should return a valid mongo object", function(){
            var result1 = database.checkHold(nickel);
            return expect(Promise.resolve(result1)).to.eventually.have.property("_id");
        });
        it("should return an object with a quantity property", function(){
            var result1 = database.checkHold(nickel);
            return expect(Promise.resolve(result1)).to.eventually.have.property("quantity");
        });
    });
    describe("add coin to hold",function(){
        it("if coin inserted and valid, it should be added to hold", function(){
            //working here , write test


            var result1 = database.checkHold(nickel);
            return expect(Promise.resolve(result1)).to.eventually.have.property("_id");
        });
    });




});