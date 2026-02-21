const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const PORT = 3000;

// 1) Create HTTP server explicitly
const server = http.createServer(app);

// 2) Attach Socket.IO to HTTP server
const io = new Server(server);

// Serve static files (for the client HTML/JS)
app.use(express.static(path.join(__dirname, 'public', 'index.html')));

// Basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3) Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Notify others that a new user joined
    socket.broadcast.emit('serverMessage', `User ${socket.id} joined the chat`);

    // Listen for chat messages from this client
    socket.on('chatMessage', (msg) => {
        console.log(`Message from ${socket.id}:`, msg);

        // Broadcast message to everyone (including sender)
        io.emit('chatMessage', {
            id: socket.id,
            text: msg,
            timestamp: new Date().toISOString(),
        });
    });

    // Optional: handle custom events from client
    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('typing', {
            id: socket.id,
            isTyping,
        });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        io.emit('serverMessage', `User ${socket.id} left the chat`);
    });
});

// Start the server (using http server, not app.listen)
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
