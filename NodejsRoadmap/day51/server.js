const express = require('express');
const { webhookRouter } = require('./webhook');

const app = express();

// IMPORTANT: for signature verification, the webhook route must use raw body.
// We'll mount the webhook router with express.raw(), and use express.json() for everything else.
app.use('/webhooks', express.raw({ type: "application/json" }), webhookRouter);

// Normal JSON parsing for other routes
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ ok: true, message: "Webhook demo running" });
});

app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
    console.log("Webhook endpoint: POST http://localhost:3000/webhooks/orders");
});
