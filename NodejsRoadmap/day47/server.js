require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Serve a tiny HTML client (optional)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Day 47: WebSockets + Redis</h1>
        <input id="msg" placeholder="Type a message"/>
        <button onclick="send()">Send</button>
        <ul id="messages"></ul>

        <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
        <script>
          const socket = io();

          socket.on('connect', () => {
            console.log('Connected, id:', socket.id);
          });

          socket.on('chat:message', (msg) => {
            const li = document.createElement('li');
            li.textContent = msg;
            document.getElementById('messages').appendChild(li);
          });

          function send() {
            const input = document.getElementById('msg');
            const text = input.value;
            if (!text) return;
            socket.emit('chat:message', text);
            input.value = '';
          }
        </script>
      </body>
    </html>
  `);
});

// Create Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

// Redis connection configuration
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

async function start() {
    // Create Redis pub/sub clients
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.error('Redis pub error:', err));
    subClient.on('error', (err) => console.error('Redis sub error:', err));

    await pubClient.connect();
    await subClient.connect();

    // Use Redis adapter for Socket.IO
    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Listen for chat messages from this client
        socket.on('chat:message', (msg) => {
            console.log('Received message from', socket.id, ':', msg);

            // Broadcast to all clients on all instances
            io.emit('chat:message', msg);
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`HTTP/WebSocket server running on http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error('Server start error:', err);
    process.exit(1);
});