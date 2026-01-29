require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const app = express();

// Get environment variables
const PORT = process.env.PORT || 4000;  // Default to 4000 if PORT is not defined
const API_KEY = process.env.API_KEY || 'no-key';
const DB_HOST = process.env.DB_HOST || 'localhost';

// Middleware to filter sensitive data
app.get('/config', (req, res) => {
    if (!process.env.API_KEY) {
        console.error('Warning: Missing API_KEY in environment variables');
    }

    res.json({
        port: PORT,
        databaseHost: DB_HOST
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Key: ${API_KEY}`);
    console.log(`Database Host: ${DB_HOST}`);
});

//http://localhost:3000/config