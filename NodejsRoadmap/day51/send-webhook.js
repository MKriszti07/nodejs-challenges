const crypto = require('crypto');

// Node 18+ has fetch built in
const WEBHOOK_SECRET = 'dev-webhook-secret-change-me';
const SIGNATURE_HEADER = 'x-webhook-signature';

function signPayload(payloadString) {
    return crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payloadString)
        .digest('hex');
}

async function main() {
    const event = {
        id: crypto.randomUUID(),
        type: 'order.created',
        createdAt: new Date().toISOString(),
        data: {
            orderId: 'ORD-' + Math.floor(Math.random() * 10000),
            amount: 1999,
            currency: 'USD',
            customerEmail: 'user001@example.com'
        },
    };

    const payload = JSON.stringify(event);
    const signature = signPayload(payload);

    const res = await fetch('http://localhost:3000/webhooks/orders', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            [SIGNATURE_HEADER]: signature,
        },
        body: payload,
    });

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
})