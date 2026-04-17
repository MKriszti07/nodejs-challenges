require("dotenv").config();

const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();

// HTTP routes (Express)
app.get("/", (req, res) => {
  res
    .type("text")
    .send("Day 68: Express + WebSocket. Connect to ws://localhost:3000/ws\n");
});

app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Create a single HTTP server and attach BOTH Express and WebSocket to it
const server = http.createServer(app);

// WebSocket server, mounted at /ws (same host/port as Express)
const wss = new WebSocket.Server({ server, path: "/ws" });

// Broadcast helper
function broadcast(jsonObj) {
  const msg = JSON.stringify(jsonObj);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}
wss.on("connection", (ws, req) => {
  const ip = req.socket.remoteAddress;

  ws.send(JSON.stringify({ type: "welcome", message: "Connected!", ip }));

  broadcast({
    type: "presence",
    message: "A user connected",
    ip,
    at: Date.now(),
  });

  ws.on("message", (data) => {
    let payload;
    try {
      payload = JSON.parse(data.toString());
    } catch {
      payload = { text: data.toString() };
    }

    // Basic message event
    broadcast({
      type: "message",
      from: ip,
      text: payload.text ?? payload.message ?? String(payload),
      at: Date.now(),
    });
  });

  ws.on("close", () => {
    broadcast({
      type: "presence",
      message: "A user disconnected",
      ip,
      at: Date.now(),
    });
  });

  ws.on("error", (err) => {
    console.error("WS error:", err.message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP: http://localhost:${PORT}`);
  console.log(`WS:   ws://localhost:${PORT}/ws`);
});


// Test it

// Option A: with wscat (recommended)

// Install:

// npm i -g wscat
// Connect (in two terminals):

// wscat -c ws://localhost:3000/ws
// Type:

// Text
// {"text":"hello"}
// You’ll see broadcasts in all connected clients.

