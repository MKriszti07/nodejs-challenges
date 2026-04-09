const crypto = require('node:crypto');
const { eventBus } = require('./eventBus');

// Fake DB
const users = new Map();

async function createUser({ email, name }) {
    if (!email) throw new Error('email is required');

    const id = crypto.randomUUID();
    const user = { id, email, name: name || null, createdAt: new Date().toISOString() };

    users.set(id, user);

    // Emit a custom event
    eventBus.emit('user.created', { user });

    return user;
}

function getUser(id) {
    return users.get(id) || null;
}

module.exports = { createUser, getUser };