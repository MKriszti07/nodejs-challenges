/**
 * app.js
 * * Demonstrates serving static files using express.static middleware.
 */

 const express = require('express');
 const path = require('path');
 const app = express();
 const PORT = 3000;

 // --- 1. The Magic Middleware ---
// This line tells Express: "If a request comes in and it doesn't match a route, 
// look for a file inside the 'public' folder."
app.use(express.static(path.join(__dirname, 'public')));

// --- 2. Routes ---
// Note: If you have an 'index.html' in your public folder, 
// Express will automatically serve it at the '/' route by default.
app.get('/api/info', (req, res) => {
    res.json({ message: "Static files are being served from the /public folder!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`Files in the 'public' folder are now accessible.`);
});