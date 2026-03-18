require('dotenv').config();

const { MongoClient } = require('mongodb');

async function withDb(fn) {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!uri) throw new Error('Missing MONGODB_URI');
    if (!dbName) throw new Error('Missing MONGODB_DBNAME');

    const client = new MongoClient(uri);
    await client.connect();

    try {
        const db = client.db(dbName);
        return await fn(db);
    } finally {
        await client.close();
    }
}

module.exports = { withDb };