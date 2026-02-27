require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
}

async function seed() {
    try {
        // 1) Connect to cloud MongoDB (Atlas)
        await mongoose.connect(uri);
        console.log('Connected to MongoDB:', uri);

        // 2) Optionally clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        console.log('Cleared existing users and posts');

        // 3) Insert users
        const usersData = [
            { name: 'Alice', email: 'alice@example.com' },
            { name: 'Bob', email: 'bob@example.com' },
            { name: 'Kriszti', email: 'kriszti@example.com' },
        ];

        const users = await User.insertMany(usersData);
        console.log(`Inserted ${users.length} users`);

        // 4) Insert posts referencing those users
        const postsData = [
            {
                title: 'Welcome to the blog',
                body: 'This is the first post!',
                author: users[0]._id,
            },
            {
                title: 'Node.js is great',
                body: 'Streaming, events, and more...',
                author: users[1]._id,
            },
            {
                title: '100 Days of Node.js',
                body: 'Learning something new every day.',
                author: users[2]._id,
            },
        ];

        const posts = await Post.insertMany(postsData);
        console.log(`Inserted ${posts.length} posts`);

        console.log(`Inserted ${posts.length} posts`);
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        // 5) Disconnect
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seed();

