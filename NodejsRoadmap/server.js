/**
 * server.js
 * * Creates a simple HTTP server using Node.js's built-in 'http' module.
 */

// 1. Import the built-in 'http' module
const http = require('http');

// Define the port the server will listen on
const PORT = 3000;

// 2. Create the HTTP server
// The createServer() method accepts a function (the request listener) that is 
// executed every time the server receives an HTTP request.
const server = http.createServer((req, res) => {
    // req: Request object (contains information about the incoming request, 
    //      like headers, URL, method, etc.)
    // res: Response object (used to send data back to the client)

    // Set the HTTP response header
    // Status Code: 200 (OK)
    // Content-Type: text/plain
    res.writeHead(200, {'Content-Type': 'text/plain' });

    // Send the response body "Hello World!" and close the connection
    res.end('Hello World!\n');
});

// 3. Start the server and make it listen for incoming connections
server.listen(PORT, () => {
    // This callback function runs once the server is successfully started
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Open your web browser and navigate to this address.');
    console.log('Press Ctrl + C to stop the server.');
});