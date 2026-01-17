/**
 * expressExample.js
 * * Demonstrates setting up a basic Express application and defining routes.
 */

const express = require('express');
const app = express();
const PORT = 3000;

// 1. Basic Route (Home)
// Express provides methods like .get(), .post(), .put(), .delete() 
// corresponding to HTTP methods.
app.get('/', (req, res) => {
    // res.send() automatically sets the Content-Type and handles the response ending
    res.send('<h1>Welcome to the Express Home Page!</h1>');
});

// 2. About Route
app.get('/about', (req, res) => {
    res.send('<h1>About Page</h1><p>Express makes routing so much easier!</p>');
});

// 3. JSON Route (API)
app.get('/api/status', (req, res) => {
    // .json() is a helper method to send JSON objects directly
    res.json({
        status: 'Success',
        message: 'The server is running smoothly',
        framework: 'Express.js',
        day: 8
    });
});

// 4. Catch-all Route (404 Not Found)
// This should always be placed AFTER your other routes.
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// 5. Start the server
app.listen(PORT, () => {
    console.log(`🚀 Express server is running at http://localhost:${PORT}`);
    console.log('Available endpoints: /, /about, /api/status');
});

// Visit http://localhost:3000/ for the home page.
// Visit http://localhost:3000/api/status to see the JSON response.
// Visit http://localhost:3000/random-page to see your custom 404 page.

//Nodemon (npm install -g nodemon) which restarts the server automatically whenever you save a file!