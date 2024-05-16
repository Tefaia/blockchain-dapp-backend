const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// If you want to test the connection pool, you can uncomment the following lines
// and execute this script. This will acquire a connection and release it back
// to the pool.

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error('Error getting MySQL connection:', err);
//     return;
//   }
//   console.log('MySQL connection successful');
//   connection.release(); // Release the connection back to the pool
// });

module.exports = pool;
