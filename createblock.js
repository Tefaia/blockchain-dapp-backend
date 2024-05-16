const SHA256 = require('crypto-js/sha256');

class CreateBlock {
    constructor(index, timestamp, transactions, previousHash = '', minerAddress = '', difficulty = 0, reward = 10) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.minerAddress = minerAddress;
        this.difficulty = difficulty;
        this.reward = reward; // Add reward property
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce + this.minerAddress + this.reward).toString();
    }

    mineBlock() {
        console.log("Mining block...");
        console.log("Miner Address:", this.minerAddress);
        console.log("Difficulty:", this.difficulty);
        console.log("Hash:", this.hash);

        while (this.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log("Block mined: " + this.hash);
    }

    static createBlock(transactions, previousBlock, minerAddress, difficulty, reward) {
        const newIndex = previousBlock.index + 1;
        const newTimestamp = Date.now();
        const newPreviousHash = previousBlock.hash;

        return new CreateBlock(newIndex, newTimestamp, transactions, newPreviousHash, minerAddress, difficulty, reward);
    }
}

module.exports = CreateBlock;
