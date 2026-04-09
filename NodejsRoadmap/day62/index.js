const { eventBus, onAsync } = require('./eventBus');
const { createUser } = require('./userService');

// 1) Always handle "error" events (otherwise Node may crash on unhandled 'error')
eventBus.on('error', (err, meta) => {
    console.error('EventBus error:', err.message, meta || '');
});

// 2) Regular listener: audit log
eventBus.on('user.created', ({ user }) => {
    console.log('[audit] user.created', { id: user.id, email: user.email });
});

// 3) Async listener: simulate sending a welcome email
onAsync('user.created', async ({ user }) => {
    await new Promise((r) => setTimeout(r, 100)); // simulate I/O
    console.log('[email] sent welcome email to', user.email);
});

// 4) once(): runs only for the first created user
eventBus.once('user.created', ({ user }) => {
    console.log('[once] first user created:', user.email);
});

// Demo run
async function main() {
    const u1 = await createUser({ email: 'alice@example.com', name: 'Alice' });
    const u2 = await createUser({ email: 'bob@example.com', name: 'Bob' });

    console.log('Created users:', u1.id, u2.id);

    // Example: emit a custom event directly
    eventBus.emit('order.paid', { orderId: 'o-1', amount: 25 });

    // Add a listener after emitting (won't receive earlier events)
    eventBus.on('order.paid', (data) => {
        console.log('[audit] order.paid', data);
    });

    // Emit again so the listener sees it
    eventBus.emit('order.paid', { orderId: 'o-2', amount: 99 });
}

main().catch((e) => console.error(e));