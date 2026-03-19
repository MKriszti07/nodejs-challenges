const express = require('express');
const crypto = require('crypto');

const webhookRouter = express.Router();

// In real apps, use process.env.WEBHOOK_SECRET
const WEBHOOK_SECRET = 'dev-webhook-secret-change-me';

// Signature header name (you choose it; providers often use their own)
const SIGNATURE_HEADER = 'x-webhook-signature"';

// Verify HMAC SHA-256 of the RAW body
function verifySignature(rawBodyBuffer, signatureHex) {
    if (!signatureHex) return false;

    const expected = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(rawBodyBuffer)
        .digest('hex');

    // timing-safe compare
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(signatureHex, 'hex');
    if (a.length !== b.length) return false;

    return crypto.timingSafeEqual(a, b);
}

webhookRouter.post('/orders', async (req, res) => {
    const signature = req.header(SIGNATURE_HEADER);

    // req.body is a Buffer because we used express.raw()
    const raw = req.body;

    if (!verifySignature(raw, signature)) {
        return res.status(400).json({ error: "Invalid webhook signature" });
    }

    // Now it's safe to parse
    let event;
    try {
        event = JSON.parse(raw.toString('utf8'));
    } catch (err) {
        return res.status(400).json({ error: "Invalid JSON payload" });
    }

    // Minimal event handling
    // Typical shape: { id, type, createdAt, data: {...} }
    console.log("Webhook received:", event.type, "id:", event.id);

    switch (event.type) {
        case 'order.created':
            console.log("Order created:", event.data);
            break;
        case 'order.paid':
            console.log("Order paid:", event.data);
            break;
        default:
            console.log("Unhandled event type:", event.type);
    }

    // Important: respond quickly. Queue work if it's heavy.
    return res.status(200).json({ received: true });
});

module.exports = { webhookRouter };