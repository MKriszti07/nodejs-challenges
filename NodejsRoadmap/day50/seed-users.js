const { withDb } = require('./mongo');

function makeUser(i) {
    const n = String(i).padStart(3, '0');
    return {
        email: `user${n}@example.com`,
        name: `User ${n}`,
        role: i % 10 === 0 ? "admin" : "user",
        createdAt: new Date(Date.now() - i * 60_000), // stagger timestamps (1 min apart)
    };
}

async function main() {
    const count = Number(process.argv[2] || 25);

    await withDb(async (db) => {
        const users = db.collection('users');

        // Ensure index exists (safe to call even if already created)
        await users.createIndex({ email: 1 }, { unique: true });

        const docs = Array.from({ length: count }, (_, idx) => makeUser(idx + 1));

        // ordered:false => continues inserts even if some emails already exist
        const result = await users.insertMany(docs, { ordered: false });

        console.log(`Inserted ${result.insertedCount} users into collection "users".`);
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});