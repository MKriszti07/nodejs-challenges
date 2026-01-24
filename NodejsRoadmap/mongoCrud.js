/**
 * mongoCrud.js
 * * Performs Create, Read, Update, and Delete operations using the native driver.
 */

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and Collection Names
const dbName = 'challengeDB';
const collectionName = 'students';

async function main() {
    try {
        // 1. Connect to the Server
        await client.connect();
        console.log('✅ Connected successfully to MongoDB server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // --- CREATE (Insert) ---
        console.log('\n--- 🆕 Creating Data ---');
        const newStudent = { name: "Krisztina", course: "Node.js", level: "Beginner" };
        const insertResult = await collection.insertOne(newStudent);
        console.log(`Inserted document with ID: ${insertResult.insertedId}`);

        // --- READ (Find) ---
        console.log('\n--- 🔍 Reading Data ---');
        // Find one specific document
        const student = await collection.findOne({ name: "Krisztina" });
        console.log('Found student:', student);

        // Find all documents in collection
        const allStudents = await collection.find({}).toArray();
        console.log(`Total students in DB: ${allStudents.length}`);

        // --- UPDATE ---
        console.log('\n--- 🆙 Updating Data ---');
        const updateResult = await collection.updateOne(
            { _id: insertResult.insertedId }, //Filter
            { $set: { level: "Intermediate" } } //Update operation
        );
        console.log(`Matched ${updateResult.matchedCount} and updated ${updateResult.modifiedCount} document(s).`);

        // --- DELETE ---
        console.log('\n--- 🗑️ Deleting Data ---');
        const deleteResult = await collection.deleteOne({ _id: insertResult.insertedId });
        console.log(`Deleted ${deleteResult.deletedCount} document(s).`);
        
    } catch (err) {
        console.error('❌ An error occurred:', err);
    } finally {
        // Close the connection when finished
        await client.close();
        console.log('\n🔌 Connection closed.');
    }
}

main();