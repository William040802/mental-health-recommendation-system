const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');

    // Read and execute the SQL file
    const schema = fs.readFileSync('./Data/schema.sql', 'utf8');
    db.query(schema, (err) => {
        if (err) {
            console.error('Failed to execute schema.sql:', err);
        } else {
            console.log('Database setup completed.');
        }
    });
});

module.exports = db;
