const express = require('express');
const pool = require('./db'); // Import the MySQL connection pool
const router = express.Router();

// Check if the database connection is successful
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database successfully!');
    connection.release(); // Release the connection
  }
});

// Add a product
router.post('/addProduct', (req, res) => {
  const { name, price, description, seller, condition } = req.body;
  const product = { name, price, description, seller, condition };

  // Log received data
  console.log('Received product data:', product);

  // Insert the product into the database
  pool.query('INSERT INTO Product SET ?', product, (err, result) => { // Changed variable name to result
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).send('Error adding product');
    }
    res.status(201).send('Product added successfully');
  });
});
// List all products
router.get('/listAllProducts', (req, res) => {
  pool.query('SELECT * FROM Product', (err, results) => {
      if (err) {
          console.error('Error listing all products:', err);
          return res.status(500).json({ error: 'An error occurred while listing all products.' });
      }
      console.log('All Products:', results); // Add this line to check the results
      res.json(results);
  });
});





module.exports = router;
