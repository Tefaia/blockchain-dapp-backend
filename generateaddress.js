const { ethers } = require('hardhat');
const pool = require('./db'); // Import your database connection

// Function to generate a new address using Hardhat
async function generateNewAddress(username) {
  try {
    // Generate a new Ethereum wallet address
    const wallet = ethers.Wallet.createRandom();
    const newAddress = wallet.address;
    const privateKey = wallet.privateKey;

    // Convert private key to hex
    const privateKeyHex = privateKey.substring(2); // Removing the leading '0x'

    // Connect to your Hardhat node
    const provider = ethers.provider;

    // Send a transaction to the new address
    const balance = await provider.getBalance(newAddress);

    // Convert the balance to Ether
    const balanceInEther = ethers.utils.formatEther(balance);

    // Insert the new wallet information into the database
    await pool.query('INSERT INTO Wallets (username, address, private_key, balance) VALUES (?, ?, ?, ?)', [username, newAddress, privateKeyHex, balanceInEther]);

    return { address: newAddress, privateKey: privateKeyHex, balance: balanceInEther };
  } catch (error) {
    console.error('Error generating new address:', error);
    throw error;
  }
}

// Function to get user information from database
async function getUserFromDatabase(username) {
  return new Promise((resolve, reject) => {
    let userResult;
    let walletResult;

    // Query the users table
    pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
      if (error) {
        reject(error);
        return;
      } else {
        userResult = results[0]; // Store the result
        checkComplete(); // Check if both queries are complete
      }
    });

    // Query the Wallets table
    pool.query('SELECT * FROM Wallets WHERE username = ?', [username], (error, results) => {
      if (error) {
        reject(error);
        return;
      } else {
        walletResult = results[0]; // Store the result
        checkComplete(); // Check if both queries are complete
      }
    });

    // Function to check if both queries are complete
    function checkComplete() {
      if (userResult !== undefined && walletResult !== undefined) {
        // If user exists in both tables, return transactions and balance from Wallets
        const combinedResult = {
          transactions: walletResult.transactions,
          balance: walletResult.balance
        };
        resolve(combinedResult);
      } else if (userResult === undefined && walletResult === undefined) {
        // If user doesn't exist in users table, reject with an error
        reject(new Error('User not found'));
      } else if (userResult !== undefined && walletResult === undefined) {
        // If user exists in users table only, create wallet
        generateNewAddress(username)
          .then((walletInfo) => {
            resolve(walletInfo);
          })
          .catch((error) => {
            reject(error);
          });
      }
    }
  });
}

// Function to fetch wallet balance by address from the database
async function getWalletBalance(address) {
  try {
    // Query database to retrieve wallet balance by address
    const result = await pool.query('SELECT balance FROM Wallets WHERE address = ?', [address]);

    // If wallet is found, return its balance
    if (result.length === 0) {
      throw new Error('Wallet not found');
    }

    return result[0].balance;
  } catch (error) {
    throw error;
  }
}

// Function to fetch transactions by address from the database
async function getAddressTransactions(address) {
  try {
    // Query database to retrieve transactions by sender or recipient address
    const transactions = await pool.query('SELECT * FROM WalletTransactions WHERE sender_address = ? OR recipient_address = ?', [address, address]);

    return transactions;
  } catch (error) {
    throw error;
  }
}

module.exports = { generateNewAddress, getUserFromDatabase, getWalletBalance, getAddressTransactions };
