const mysql = require("mysql2");

// Create the connection pool
const pool = mysql.createPool({
  host: "mysql-87c8ad9-yesaswinipamidi19-4d96.h.aivencloud.com",
  port: 13682,
  user: "avnadmin",
  password: process.env.DB_PASSWORD, // We'll set this in Vercel
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false, // Required for Aiven's "REQUIRED" SSL mode
  },
  waitForConnections: true,
  connectionLimit: 10,       // Keeps you safe under Aiven's free limit
  queueLimit: 0,
});

// Use the promise wrapper for easier async/await if you prefer, 
// but for your current code, we'll export the standard pool.
module.exports = pool;