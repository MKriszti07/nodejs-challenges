/**
 * postExample.js
 * * Demonstrates handling POST requests and parsing the request body.
 */

const express = require('express');
const app = express();
const PORT = 3000;

// --- 1. Middleware to parse request bodies ---

// This allows us to read JSON data sent in the body
app.use(express.json());

// This allows us to read data sent from an HTML form (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// --- 2. Routes ---

// A simple GET route that provides an HTML form for testing
app.get('/', (req, res) => {
    res.send(`
        <h1>Day 10: POST Request Demo</h1>
        <h3>Test with an HTML Form:</h3>
        <form action="/submit-form" method="POST">
            <input type="text" name="username" placeholder="Enter Username" required>
            <button type="submit">Submit via Form</button>
        </form>
        <p>Or use a tool like Postman to send JSON to <code>/api/data</code>.</p>
    `);
});

// A POST route to handle Form Submissions
app.post('/submit-form', (req, res) => {
    // Data from the form is available in req.body
    const username = req.body.username;

    console.log(`Form submission received: ${username}`);
    res.send(`<h1>Success!</h1><p>Welcome, ${username}!</p><a href="/">Back</a>`);
});

// A POST route to handle JSON Data (common for APIs)
app.post('/api/data', (req, res) => {
    const receivedData = req.body;

    console.log('JSON Data received:', receivedData);

    res.status(201).json({
        message: 'Data received successfully!',
        yourData: receivedData
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log('1. Test the form by visiting the URL above.');
    console.log('2. Test the JSON API using Postman or curl at /api/data.');
});

