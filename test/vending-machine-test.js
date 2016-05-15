var expect    = require("chai").expect;
var machine = require("../methods/vending-logic.js");

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
}

var quarter = {
    "name" : "quarter",
    "value_dec" : "0.25",
    "value_int" : "25",
    "weight" : "5.7",
    "diameter" : "24"
}

describe("Vending Machine", function() {
    describe("weigh coins", function() {
        it("weigh coins", function() {
            var result1 = machine.checkWeight(nickel);
            var result2 = machine.checkWeight(dime);
            var result3 = machine.checkWeight(quarter);

            expect(result1).to.equal("5");
            expect(result2).to.equal("10");
            expect(result1).to.equal("25");

        });
    });


});