const SHA256 = require("crypto-js/sha256");

class Block {
    // Index: Where is the blocks sit on the chain.
    // Timestamp: Tell us when the block are created
    // Data: Any type of data which you want to associate with this block.
    // PreviousHash: The string which contains the hash of the block before.
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    // Calculate hash value
    calculateHash() {
        return SHA256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data)
        ).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]; // Array of blocks
    }

    // First block object
    createGenesisBlock() {
        return new Block(0, "08/05/2018", "Genesis Block", "0")
    }

    /**
     * Note: Use it to get latest block hash values
     * @returns Latest block
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        // The prev hash must have the hash which the prev block has
        newBlock.previousHash = this.getLatestBlock().hash;
        // We need to calculate new hash and assing
        newBlock.hash = newBlock.calculateHash();
        // Adding nevblock to chain
        this.chain.push(newBlock);
    }

    /**
     * Checking that "is the chain valid?"
     * @returns "true" for valid
     */
    isChainValid() {
        // 0 block is genesis block, we wont look that.
        for (let i = 1; i < this.chain.length; i++) {
            // Checking that Is the hash correct
            if (this.chain[i].hash !== this.chain[i].calculateHash()) {
                return false;
            }
            // Checking that is the prev hash (the connection) correct
            if (this.chain[i].previousHash !== this.chain[i - 1].hash) {
                return false;
            }
        }

        return true;
    }
}

let savjeeCoin = new Blockchain();
savjeeCoin.addBlock(new Block(1, "08/05/2018", { amount: 4 }));
savjeeCoin.addBlock(new Block(2, "08/05/2018", { amount: 10 }));
savjeeCoin.addBlock(new Block(3, "08/05/2018", { amount: 20 }));

console.log(JSON.stringify(savjeeCoin, null, 4));

/**
 * If we change the data, the new hash will be difference.
 * Blockchain will find another hash value in [isChainValid] first if line.
 */
savjeeCoin.chain[1].data = { amount: 100 }
console.log("Is the first blockchain valid? " + savjeeCoin.isChainValid());
/**
 * If we change the hash, the connection which is provided by prevHash
 * opportunity will be break. Because the prevHash wont be equal to new hash.
 */
savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();
console.log("Is the second blockchain valid? " + savjeeCoin.isChainValid());
