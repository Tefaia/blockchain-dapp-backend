const crypto = require('crypto');

class Transaction {
    constructor(sender, recipient, amount) {
      this.sender = sender;
      this.recipient = recipient;
      this.amount = amount;
      this.timestamp = new Date().toISOString();
      this.transactionId = this.calculateHash();
    }
  
    calculateHash() {
      const data = this.sender + this.recipient + this.amount + this.timestamp;
      return crypto.createHash('sha256').update(data).digest('hex');
    }

    toJSON() {
      return {
        sender: this.sender,
        recipient: this.recipient,
        amount: this.amount,
        timestamp: this.timestamp,
        transactionId: this.transactionId
      };
    }
}

module.exports = Transaction;
