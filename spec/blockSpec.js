const SHA256 = require('crypto-js/sha256');

const BlockClass = require('../src/block.js');

describe("A block", function () {
    it("validates correct block", function () {
        return new BlockClass.Block({some: "data"})
            .setHash()
            .then(block => block.validate())
            .then(result => expect(result).toBe(true, "block should be valid"));
    });
    it("invalidates tampered block", function () {
        let block = new BlockClass.Block({some: "dataa"});
        block.hash = SHA256("hi");
        return block.validate()
            .then(result => expect(result).toBe(false, "tampered block should be invalid"))
    });
});
