const SHA256 = require('crypto-js/sha256');

const BlockClass = require('../src/block.js');

describe("Block validation", function () {
    let block;
    beforeEach(() => {
        block = new BlockClass.Block({some: "data"});
    })
    it("true for correct block", function () {
        return block.setHash()
            .then(block => block.validate())
            .then(result => expect(result).toBe(true, "block should be valid"));
    });
    it(`false for tampered block`, function () {
        block.hash = SHA256('hi');
        return block.validate()
            .then(result => expect(result).toBe(false, "tampered block should be invalid"));
    });
});

describe('Block data', function () {
    let block;
    let data = {some: 'data'};
    beforeEach(() => {
        block = new BlockClass.Block(data);
    });

    it('rejects for genesis block', function (done) {
        block.getBData().then(function () {
            // Promise is resolved
            done(new Error('Promise should not be resolved'));
        }, function (reason) {
            // Promise is rejected
            // You could check rejection reason if you want to
            expect(reason).toEqual(new Error('genesis block'));
            done(); // Success
        });
    });
    it('loads data back for regular block', function () {
        block.previousBlockHash = SHA256('hi');
        return block.getBData()
            .then(actualData => expect(actualData).toEqual(data));
    })

});
