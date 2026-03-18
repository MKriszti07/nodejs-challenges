const { withDb } = require('../mongo');

exports.up = async function up() {
    await withDb(async (db) => {
        const users = db.collection('users');

        // 1) Create a unique index on email (safe to run multiple times)
        await users.createIndex({ email: 1 }, { unique: true });

        // 2) Backfill createdAt where missing
        const result = await users.updateMany(
            { createdAt: { $exists: false } },
            { $set: { createdAt: new Date() } }
        );

        console.log("Backfilled createdAt for:", result.modifiedCount, "users");
    });
};

exports.down = async function down() {
    await withDb(async (db) => {
        const users = db.collection('users');

        // Rollback: drop the index
        // Note: dropping by name is more precise, but for a learning example we can drop by key pattern:
        await users.dropIndex({ email: 1 });

        // We usually DO NOT delete backfilled data in down migrations (it’s lossy).
        // If you really want to, you could unset createdAt only when it equals "migration time",
        // but that requires storing a marker.
    });
};