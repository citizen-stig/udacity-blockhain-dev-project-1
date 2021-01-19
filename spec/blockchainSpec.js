const BlockChain = require('../src/blockchain.js');

describe('Blockchain', function () {
    it('initializes on creation', function () {
        let chain = new BlockChain.Blockchain();
        return chain.getChainHeight()
            .then(height => expect(height).toBe(0));
    });


});


describe('Request Message Ownership Verification', function () {
    let chain = new BlockChain.Blockchain();

});

describe('Submit star', function () {
    let chain = new BlockChain.Blockchain();
    let address = "1DDfj6Gz5mYCaH4avMwfh5tcrete2SteBX";
    let signature = "Hw3GH6PG3AXCePQHuXNeMu9hEYM8jlt5YddKXkiyj6erJxRu0hPikmWU6aTTNlVia3cdljRuo8ubqCf/72Fq+iQ=";
    let message = "1DDfj6Gz5mYCaH4avMwfh5tcrete2SteBX:1611090644";
    let star = {
        "dec": "68° 51' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "testing story 4"
    };

    beforeEach(() => {
        jasmine.clock().install();
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });

    it('works within timeout and correct signature', function () {
        let baseTime = new Date(2021, 0, 19, 21, 10, 45);
        jasmine.clock().mockDate(baseTime);
        return chain.submitStar(address, message, signature, star)
            .then(blockData => {
                expect(blockData.body).toEqual('7b2261646472657373223a22314444666a36477a356d594361483461764d77666835746372657465325374654258222c2273746172223a7b22646563223a223638c2b0203531272035362e39222c227261223a223136682032396d20312e3073222c2273746f7279223a2274657374696e672073746f72792034227d7d');
            })
    });


    it('fails with incorrect signature', function (done) {
        let baseTime = new Date(2021, 0, 19, 21, 10, 45);
        jasmine.clock().mockDate(baseTime);
        return chain.submitStar(address, message, "Aw3GH6PG3AXCePQHuXNeMu9hEYM8jlt5YddKXkiyj6erJxRu0hPikmWU6aTTNlVia3cdljRuo8ubqCf/72Fq+iQ=", star)
            .then(
                () => done(new Error('Promise should not be resolved')),
                reason => {
                    expect(reason).toEqual(new Error('Message is not verified'));
                    done(); // Success
                });
    })

    it('fails on timeout', function (done) {
        return chain.submitStar(address, message, signature, star)
            .then(
                () => done(new Error('Promise should not be resolved')),
                reason => {
                    expect(reason).toEqual(new Error('submit error, more than 300 seconds have passed'));
                    done(); // Success
                });
    });


});


describe('Get stars by wallet address', function () {
    let chain = new BlockChain.Blockchain();
    let address1 = "1DDfj6Gz5mYCaH4avMwfh5tcrete2SteBX";
    let signature1 = "Hw3GH6PG3AXCePQHuXNeMu9hEYM8jlt5YddKXkiyj6erJxRu0hPikmWU6aTTNlVia3cdljRuo8ubqCf/72Fq+iQ=";
    let message1 = "1DDfj6Gz5mYCaH4avMwfh5tcrete2SteBX:1611090644";

    let address2 = "1B7tyPYxw2xyE3kp7AkCh3JKGBSnQeft5S"
    let signature2 = "IOS0md0Ph+xusDDQ+IBrtcUMMR9bUQyW9qRqVXIxWG+kVgfUJsdx57AGgNVptOpcw/Grbb1e8boToYgZ1YNexVg=";
    let message2 = "1B7tyPYxw2xyE3kp7AkCh3JKGBSnQeft5S:1611090644"

    let star1 = {
        "dec": "68° 51' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "testing story 1"
    };
    let star2 = {
        "dec": "18° 51' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "testing story 2"
    };
    let star3 = {
        "dec": "28° 51' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "testing story 3"
    };


    beforeAll(() => {
        jasmine.clock().install();
        let baseTime = new Date(2021, 0, 19, 21, 10, 45);
        jasmine.clock().mockDate(baseTime);
        return chain.submitStar(address1, message1, signature1, star1)
            .then(() => chain.submitStar(address2, message2, signature2, star3))
            .then(() => chain.submitStar(address1, message1, signature1, star2));
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });


    it('returns for address1', function () {
        chain.getStarsByWalletAddress(address1)
            .then(stars => expect(stars.length).toBe(2));
    });
    it('returns for address2', function () {
        chain.getStarsByWalletAddress(address2)
            .then(stars => expect(stars.length).toBe(1));
    });
    it('returns empty for non existing address', function () {
        chain.getStarsByWalletAddress("test-address")
            .then(stars => expect(stars.length).toBe(0));
    });

});
