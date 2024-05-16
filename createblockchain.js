const Block = require('./createblock');
const Transaction = require('./Transaction');

class CreateBlockchain {
  constructor(difficulty = 4) {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = difficulty; // Assign the provided difficulty value or default to 4
    this.reward = 10;
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    this.chain.push(block);
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  displayBlockchain() {
    console.log("Blockchain:");
    this.chain.forEach(block => {
      console.log(`Index: ${block.index}`);
      console.log(`Timestamp: ${block.timestamp}`);
      console.log(`Data: ${JSON.stringify(block.data)}`);
      console.log(`Previous Hash: ${block.previousHash}`);
      console.log(`Hash: ${block.hash}`);
      console.log("---------------------------------------------------");
    });
  }

  submitMinedBlock(block) {
    console.log('Block mined:', block);
  }

  async mineBlock(minerAddress, difficulty) {
    try {
        // Create a reward transaction for the miner
        const rewardTransaction = new Transaction(
            null,
            minerAddress,
            this.reward,
            Date.now()
        );
        this.pendingTransactions.push(rewardTransaction);

        // Create a copy of pendingTransactions to avoid mutating original array
        const transactionsCopy = [...this.pendingTransactions];

        // Create a new block with pending transactions
        const block = new Block(
            this.chain.length,
            Date.now(),
            transactionsCopy,
            this.getLatestBlock().hash,
            minerAddress,
            difficulty,
            this.reward
        );

        // Mine the block
        await block.mineBlock();

        // Submit the mined block
        this.submitMinedBlock(block);

        // Add the mined block to the chain
        this.addBlock(block);

        // Clear pending transactions
        this.pendingTransactions = [];

        return block;
    } catch (error) {
        console.error('Error mining block:', error);
        throw error;
    }
}

  async getBalance(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.sender === address) {
          balance -= transaction.amount;
        }
        if (transaction.recipient === address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  // Method to reset the blockchain to an empty state
  resetBlockchain() {
    // Clear the chain and pending transactions
    this.chain = [];
    this.pendingTransactions = [];
  }

  displayMiningJobDetails() {
    console.log("Mining job details:");
    console.log("-------------------");
    console.log("Block Timestamp:", this.pendingTransactions[0].timestamp);
    console.log("Block Transactions:", this.pendingTransactions.map(transaction => ({
        id: transaction.id,
        sender: transaction.sender,
        recipient: transaction.recipient,
        amount: transaction.amount,
        status: transaction.status,
        timestamp: transaction.timestamp,
        transactionId: transaction.transactionId
    })));
    console.log("-------------------");
}

}

module.exports = CreateBlockchain;
