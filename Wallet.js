const express = require('express');
const router = express.Router();
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
    pool.query('INSERT INTO Wallets (username, address, private_key, balance) VALUES (?, ?, ?, ?)', [username, newAddress, privateKeyHex, balanceInEther]);

    return { address: newAddress, privateKey: privateKeyHex, balance: balanceInEther };
  } catch (error) {
    console.error('Error generating new address:', error);
    throw error;
  }
}

// Define the endpoint to search for a user
router.get('/search/:username', async (req, res) => {
  const { username } = req.params;
  console.log('Searching for user:', username); // Logging username
  try {
    // Search for the user in the wallets database
    pool.query('SELECT address,private_key, balance FROM Wallets WHERE username = ?', [username], async (error, results) => {
      if (error) {
        console.error('Error searching for user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        // If the user is not found, generate a new address for them
        console.log('User not found, generating new address...');
        const walletAddress = await generateNewAddress(username);

        // Log address and private key
        console.log('Address:', walletAddress.address);
        console.log('Private Key:', walletAddress.privateKey);

        return res.json({ address: walletAddress.address, privateKey: walletAddress.privateKey });
      } else {
        // If the user is found, fetch their balance
        console.log('User found');
        const { address, private_key, balance } = results[0];
        
        // Log address, balance
        console.log('Address:', address);
        console.log('Private Key:', private_key); // Log private key here
        console.log('Balance:', balance);

        return res.json({ address, privateKey: private_key, balance });
      }
    });
  } catch (error) {
    console.error('Error searching for user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
