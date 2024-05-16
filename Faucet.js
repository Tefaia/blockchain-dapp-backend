const express = require('express');
const { ethers } = require('hardhat');
const pool = require('./db'); // Import your database connection
require('dotenv').config();

const router = express.Router();
router.use(express.json());

let token; // Define token variable globally

async function deployTokenContract() {
    try {
        const Token = await ethers.getContractFactory('Token');
        token = await Token.deploy();
        await token.deployed();
        console.log('Token deployed to:', token.address);
    } catch (error) {
        console.error('Error deploying token contract:', error);
        throw error; // Rethrow the error to handle it at a higher level
    }
}

async function getTokenOwner() {
    try {
        const owner = await token.owner();
        console.log('Contract owner:', owner);
        return owner;
    } catch (error) {
        console.error('Error getting token owner:', error);
        throw error;
    }
}

async function getOwnerBalance() {
    try {
        const owner = await getTokenOwner();
        const ownerBalance = await token.balanceOf(owner);
        console.log('Owner balance:', ownerBalance.toString());
        return ownerBalance;
    } catch (error) {
        console.error('Error getting owner balance:', error);
        throw error;
    }
}

async function getFaucetBalance() {
    try {
        const ownerBalance = await getOwnerBalance();
        return ownerBalance.toString();
    } catch (error) {
        console.error('Error getting faucet balance:', error);
        throw error;
    }
}
// Endpoint to retrieve balance by address
router.get('/balance/:address', async (req, res) => {
  const address = req.params.address;
  try {
    // Define the SQL query to select the balance based on the address
    const query = 'SELECT balance FROM Wallets WHERE address = ?';
    // Execute the query with the provided address as a parameter
    pool.query(query, [address], (err, results) => {
      if (err) {
        // If an error occurs during the database query, log the error and send a 500 status with an error message
        console.error('Error retrieving balance:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      // Check if results are defined and contain balance data
      if (results && results.length > 0) {
        const balance = results[0].balance;
        // If balance is found, send it in the response
        res.status(200).json({ balance });
      } else {
        // If balance is not found, send a 404 status with an error message
        res.status(404).json({ error: 'Balance not found for the provided address' });
      }
    });
  } catch (error) {
    // If an error occurs during the process, send a 500 status with the error message
    console.error('Error retrieving balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Endpoint to send tokens and update balance
router.post('/sendtokens/:address', async (req, res) => {
  const receiverAddress = req.params.address; // Use req.params to get the address parameter
  console.log('Received data:', receiverAddress); // Log received data

  try {
    if (!receiverAddress) {
      throw new Error('Receiver address is required.');
    }

    // Retrieve the amount from environment variables
    const amount = parseInt(process.env.AMOUNT);

    // Assuming you have access to ethers and token objects
    const [sender] = await ethers.getSigners();
    await token.connect(sender).requestTokens(receiverAddress, amount);

    // Update wallet balance with the new balance
    const initialBalanceQuery = 'SELECT balance FROM Wallets WHERE address = ?';
    pool.query(initialBalanceQuery, [receiverAddress], async (err, results) => {
      if (err) {
        console.error('Error retrieving initial balance:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      if (results && results.length > 0) {
        const initialBalance = results[0].balance;

        // Calculate new balance
        const newBalance = initialBalance + amount;

        // Update balance in the database
        const updateQuery = 'UPDATE Wallets SET balance = ? WHERE address = ?';
        pool.query(updateQuery, [newBalance, receiverAddress], async (updateErr) => {
          if (updateErr) {
            console.error('Error updating balance:', updateErr);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Send response with new balance and faucet balance
          const faucetBalance = await getFaucetBalance();
          res.status(200).json({ message: 'Tokens requested successfully.', newBalance, faucetBalance });
        });
      } else {
        res.status(404).json({ error: 'Balance not found for the provided address' });
      }
    });
  } catch (error) {
    console.error('Error sending tokens:', error);
    // Check if the error message is from the contract
    const contractErrorMessage = error.reason ? `Contract Error: ${error.reason}` : error.message;
    res.status(400).send(`Token request failed: ${contractErrorMessage}`);
  }
});


async function initialize() {
    try {
        await deployTokenContract();
        await getTokenOwner();
        await getOwnerBalance();
    } catch (error) {
        console.error('Initialization error:', error);
        // Handle initialization error, possibly exit the application gracefully
    }
}

initialize(); // Initialize the contract deployment and logging

module.exports = router;
