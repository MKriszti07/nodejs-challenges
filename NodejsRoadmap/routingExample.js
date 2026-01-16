/**
 * routingExample.js
 * * Demonstrates simple manual routing using the built-in 'http' module.
 */

const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 1. Get the URL and HTTP method from the request
    const path = req.url.toLowerCase();
    const method = req.method;

    console.log(`Received ${method} request for: ${path}`);

    // 2. Routing Logic
    // We use a switch statement or if/else to check the requested path
    if (path === '/' || path === '/home') {
        // --- About Route ---
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('<h1>About Us</h1><p>We are learning Node.js routing today!</p>');
    } else if (path === '/api/user' && method === 'GET') {
        // --- API Route (Returning JSON) ---
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const userData = {
            id: 1,
            name: 'Node Learner',
            day: 7,
            topic: 'Routing'
        };
        res.end(JSON.stringify(userData));
    } else {
        // --- 404 Not Found ---
        // If the path doesn't match any of our defined routes
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>');
    }
});

// 3. Start the server
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
    console.log('Available routes: /, /about, /api/user');
    console.log('Press Ctrl + C to stop.');
});

// http://localhost:3000/	Home Page HTML	Matches the / condition.
// http://localhost:3000/about	About Us HTML	Matches the /about condition.
// http://localhost:3000/api/user	JSON Data	Demonstrates serving machine-readable data.
// http://localhost:3000/contact