const express = require('express');
const router = express.Router();
const CreateBlockchain = require('./createblockchain');
const CreateBlock = require('./createblock');
const Transaction = require('./Transaction');
const pool = require('./db.js');
const peer = require('./peer.js');

// Initialize the blockchain
const blockchain = new CreateBlockchain();
// Endpoint to get general information about the blockchain
router.get('/', (req, res) => {
  const generalInfo = {
    blocksCount: blockchain.chain.length,
    difficulty: blockchain.difficulty,
    reward: blockchain.reward,
  };
  res.json(generalInfo);
});

// Endpoint to get detailed information about the blockchain
router.get('/info', (req, res) => {
  res.json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions,
  });
});

// Endpoint to get debugging information for the blockchain
router.get('/debug', (req, res) => {
  res.json({
    isValid: blockchain. isChainValid(),
  });
});
// Endpoint to reset the blockchain to its initial state
router.get('/debug/reset-chain', (req, res) => {
  blockchain.resetBlockchain();
  res.json({ message: 'Blockchain reset to initial state' });
});
router.get('/debug/mine/:address/:difficulty', async (req, res) => {
  const { address, difficulty } = req.params;

  // Log the address and difficulty
  console.log('Mining request received with Address:', address, 'Difficulty:', difficulty);

  try {
    // Retrieve 3 pending transactions from the database
    const transactions = await getPendingTransactionsFromDatabase();

    // Mine a new block with the retrieved transactions
    const minedBlock = await mineBlock(transactions, address, parseInt(difficulty));

    // Check if mineBlock returned null (indicating insufficient transactions)
    if (minedBlock === null) {
        console.log('No block mined due to insufficient transactions.');
        res.status(400).send('Insufficient transactions for mining.');
        return;
    }

    // Update the status of the mined transactions to "Confirmed" in the database
    await updateTransactionStatus(minedBlock.transactions.map(transaction => transaction.transactionId));

    res.status(200).send('Blockchain mining completed successfully.');
  } catch (error) {
    console.error('Error mining blocks:', error);
    res.status(500).send('Failed to mine blocks.');
  }
});

// Function to retrieve 3 pending transactions from the database
async function getPendingTransactionsFromDatabase() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM Transactions WHERE status = ? LIMIT 3', ['Pending'], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to update transaction status to "Confirmed" in the database
async function updateTransactionStatus(transactionIds) {
  if (transactionIds.length === 0) {
    return; // No need to update if there are no transaction IDs
  }

  return new Promise((resolve, reject) => {
    pool.query('UPDATE Transactions SET status = "Confirmed" WHERE transactionId IN (?)', [transactionIds], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
// Function to retrieve balance from the wallets based on the address
async function getBalanceFromWallets(address) {
  return new Promise((resolve, reject) => {
    const initialBalanceQuery = 'SELECT balance FROM Wallets WHERE address = ?';
    pool.query(initialBalanceQuery, [address], (err, results) => {
      if (err) {
        console.error('Error retrieving initial balance:', err);
        reject(err);
      } else {
        if (results && results.length > 0) {
          const initialBalance = results[0].balance;
          resolve(initialBalance);
        } else {
          resolve(0); // Return 0 if no balance found for the address
        }
      }
    });
  });
}

async function mineBlock(transactions, address, difficulty) {
  console.log('Mining blocks...');

  // If there are no transactions or fewer than 3 transactions, return null
  if (transactions.length === 0 || transactions.length < 3) {
    console.log('Insufficient transactions for mining. Skipping block creation.');
    return null;
  }

  // Retrieve balance from the wallets based on the address
  const balance = await getBalanceFromWallets(address);
  console.log(`Balance for address ${address}: ${balance}`);

  // Create a new block with the provided transactions, address, and difficulty
  const block = new CreateBlock(
    transactions.map(transaction => transaction.transactionId),
    Date.now(),
    transactions,
    blockchain.getLatestBlock().hash,
    address,
    difficulty,
    blockchain.reward
  );

  // Display the mining job details
  displayMiningJobDetails(block);

  // Mine the block
  await blockchain.mineBlock(address, difficulty);

  // Update the wallet balance with the new balance after successful mining
  const updateWalletBalanceQuery = 'UPDATE Wallets SET balance = ? WHERE address = ?';
  const newBalance = balance + blockchain.reward; // Assuming reward is added to the miner's balance
  pool.query(updateWalletBalanceQuery, [newBalance, address], (err) => {
    if (err) {
      console.error('Error updating wallet balance:', err);
      return;
    }
    console.log(`Wallet balance updated for address ${address}: ${newBalance}`);
  });

  console.log(`Block ${block.index} successfully added to the blockchain.`);
  console.log('Is blockchain valid? ' + blockchain.isChainValid());
  console.log('Blockchain:');
  blockchain.displayBlockchain();

  return block;
}

// Function to display the mining job details
function displayMiningJobDetails(minedBlock) {
  console.log('Mining job details:');
  console.log('-------------------');
  console.log('Block Index:', minedBlock.index);
  console.log('Block Timestamp:', minedBlock.timestamp);
  console.log('Block Transactions:', minedBlock.transactions);
  console.log('Block Miner Address:', minedBlock.minerAddress);
  console.log('Block Difficulty:', minedBlock.difficulty);
  console.log('-------------------');
}
// Endpoint to retrieve information about all blocks in the blockchain
router.get('/blocks/', (req, res) => {
  const blocks = blockchain.chain.map(block => {
    return {
      index: block.index,
      data: block.transactions,
      timestamp: block.timestamp,
      hash: block.hash,
      previousHash: block.previousHash,
      nonce: block.nonce,
    };
  });
  res.json(blocks);
});
// POST /peers/connect endpoint
router.post('/peers/connect/:username', async (req, res) => {
  try {
    const { username } = req.params; // Extract username from route parameters

    // Call the connectToPeer function from the peer module
    const success = await peer.connectToPeer(username);

    if (success) {
      console.log(`Connected to peer: ${username}`);
      res.json({ message: 'Connected to peer successfully' });
    } else {
      res.status(500).json({ error: 'Failed to connect to peer' });
    }
  } catch (error) {
    console.error('Error connecting to a new peer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /peers/notify-new-block endpoint
router.post('/peers/notify-new-block', async (req, res) => {
    try {
        const { newBlock } = req.body;

        // Assuming newBlock has properties like index, timestamp, transactions, previousHash
        const block = new CreateBlock(
            newBlock.index,
            newBlock.timestamp,
            newBlock.transactions,
            newBlock.previousHash
        );

        console.log('New block received from peer:', block);
        res.json({ message: 'New block notified to peers successfully' });
    } catch (error) {
        console.error('Error notifying peers about a new block:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const updateProduct = async (productId) => {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE Product SET purchased = true WHERE id = ?', [productId], (err, result) => {
      if (err) {
        console.error('Error updating product status:', err);
        return reject(err);
      }
      resolve();
    });
  });
};


router.post('/transactions/add', async (req, res) => {
  const { productId, price, seller, address, mybalance } = req.body;

  try {
    // Retrieve the product details based on productId
    const product = await pool.query('SELECT * FROM Product WHERE id = ?', [productId]);

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product status to "purchased" 
    await updateProduct(productId);

    // Create a new transaction object using the Transaction class
    const newTransaction = new Transaction(address, seller, price);

    // Add the transaction to the pending transactions of the blockchain
    blockchain.addTransaction(newTransaction);

    // Check if timestamp and transactionId are NULL, set default values if necessary
    const timestamp = newTransaction.timestamp || new Date().toISOString();
    const transactionId = newTransaction.transactionId || generateTransactionId();

    // Insert the transaction into the database
    await new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO Transactions (sender, recipient, amount, timestamp, transactionId) VALUES (?, ?, ?, ?, ?)', 
        [address, seller, price, timestamp, transactionId], 
        (err) => {
          if (err) {
            console.error('Error adding transaction to the database:', err);
            return reject(err);
          }
          resolve();
        }
      );
    });

    // Update the wallet balance using mybalance
    await new Promise((resolve, reject) => {
      pool.query('UPDATE Wallets SET balance = ? WHERE address = ?', [mybalance, address], (err, result) => {
        if (err) {
          console.error('Error updating wallet balance:', err);
          return reject(err);
        }
        resolve();
      });
    });

    res.json({
      message: 'Transaction added successfully',
      transaction: newTransaction.toJSON()
    });
  } catch (error) {
    // Handle errors
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /transactions/pending
router.get('/transactions/pending', async (req, res) => {
  try {
    // Retrieve the list of pending transactions from the database
    pool.query("SELECT * FROM Transactions WHERE status = 'Pending'", (err, results) => {
      if (err) {
        console.error('Error fetching pending transactions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Pending Transactions:', results); // Log the results
        res.json(results);
      }
    });
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /transactions/confirmed
router.get('/transactions/confirmed', async (req, res) => {
  try {
    // Retrieve the list of confirmed transactions from the database
    pool.query("SELECT * FROM Transactions WHERE status = 'Confirmed'", (err, results) => {
      if (err) {
        console.error('Error fetching confirmed transactions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Confirmed Transactions:', results); // Log the results
        res.json(results);
      }
    });
  } catch (error) {
    console.error('Error fetching confirmed transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /transactions/:tranHash
router.get('/transactions/:tranHash', async (req, res) => {
  const tranHash = req.params.tranHash;
  try {
    // Fetch the transaction by transaction ID from the database
    pool.query("SELECT * FROM Transactions WHERE transactionId = ?", [tranHash], (err, results) => {
      if (err) {
        console.error('Error fetching transaction by ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length > 0) {
          console.log('Transaction by ID:', results[0]); // Log the result
          res.json(results[0]);
        } else {
          res.status(404).json({ error: 'Transaction not found' });
        }
      }
    });
  } catch (error) {
    console.error('Error fetching transaction by hash:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve information about a specific block by index
router.get('/blocks/:index', (req, res) => {
  const index = parseInt(req.params.index);

  // Check if the requested index is valid
  if (index >= 1 && index <= blockchain.chain.length) {
    const block = blockchain.chain[index - 1];
    res.json({
      index: block.index,
      data: block.transactions,
      timestamp: block.timestamp,
    });
  } else {
    res.status(404).json({ error: 'Block not found' });
  }
});

module.exports = router;