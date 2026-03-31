require('dotenv').config();

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('WebSocket server running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    ws.send(JSON.stringify({ type: 'welcome', time: Date.now() }));

    ws.on('message', (msg) => {
        // Echo back, with server timestamp (useful for RTT measurement)
        ws.send(
            JSON.stringify({
                type: 'echo',
                serverTime: Date.now(),
                payload: msg.toString()
            })
        );
    });

    ws.on('error', (err) => {
        console.error('WS error:', err.message);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`HTTP+WS listening on http://localhost:${PORT}`);
    console.log(`WebSocket URL: ws://localhost:${PORT}`);
});