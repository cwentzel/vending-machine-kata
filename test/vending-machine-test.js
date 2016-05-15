var expect    = require("chai").expect;
var machine = require("../methods/vending-logic.js");

describe("Vending Machine", function() {
    describe("weigh coins", function() {
        it("weigh nickel", function() {
            var nickel = {"name" : "nickel",
                "value_dec" : "0.05",
                "value_int" : "5",
                "weight" : "5",
                "diameter" : "21"};
            var result = machine.checkWeight(nickel);

            expect(result).to.equal("5");
        });
    });


});