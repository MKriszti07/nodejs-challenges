const WebSocket = require('ws');

const PORT = 8080;
const server = new WebSocket.Server({ port: PORT});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

// Listen for WebSocket connections
server.on('connection', (socket) => {
    console.log("A new client has connected!");

    // Notify others that a new client has joined
    broadcastToAll("A new client has joined the chat.");

    // Listen for messages from the client
    socket.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Broadcast the message to all clients
        broadcastToAll(message);
    });

    // Handle client disconnections
    socket.on('close', () => {
        console.log("A client has disconnected.");
        broadcastToAll("A client has left the chat.");
    });

    // Send a welcome message to the newly connected client
    socket.send("Welcome to the WebSocket server!");
});

// Function to broadcast messages to all connected clients
const broadcastToAll = (message) => {
    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);   // Send a message to the client
        }
    });
};