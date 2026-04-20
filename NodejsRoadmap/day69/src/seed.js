require('dotenv').config();

const mongoose = require('mongoose');
const { connectDB } = require('./db');
const { User } = require('./models/User');
const { Book } = require('./models/Book');
const { Review } = require('./models/Review');

async function seed() {
    await connectDB(process.env.MONGODB_URI);

    console.log('Clearing collections...');
    await Promise.all([
        User.deleteMany({}),
        Book.deleteMany({}),
        Review.deleteMany({})
    ]);

    console.log('Creating users...');
    const users = await User.create([
        { username: 'alice', email: 'alice@example.com' },
        { username: 'bob', email: 'bob@example.com' },
        { username: 'carol', email: 'carol@example.com' },
    ]);

    console.log('Creating books...');
    const books = await Book.create([
        { title: 'Node Patterns', authorName: 'N. Coder' },
        { title: 'Mongo Magic', authorName: 'M. Goose' },
        { title: 'API Design', authorName: 'E. Press' },
    ]);

    console.log('Creating reviews...');
    const [alice, bob, carol] = users;
    const [nodePatterns, mongoMagic, apiDesign] = books;

    await Review.create([
        { rating: 5, text: 'Loved the examples.', user: alice._id, book: nodePatterns._id },
        { rating: 4, text: 'Solid and practical.', user: bob._id, book: nodePatterns._id },

        { rating: 5, text: 'Population finally clicked.', user: carol._id, book: mongoMagic._id },
        { rating: 3, text: 'Good but dense.', user: alice._id, book: mongoMagic._id },

        { rating: 4, text: 'Great endpoint advice.', user: bob._id, book: apiDesign._id },
        { rating: 5, text: 'Must-read for backend devs.', user: carol._id, book: apiDesign._id },
    ]);

    console.log('Seed complete.');

    console.log('\nIDs to test quickly:');
    console.log('Users:');
    users.forEach((u) => console.log(`  ${u.username}: ${u._id}`));
    console.log('Books:');
    books.forEach((b) => console.log(`  ${b.title}: ${b._id}`));

    await mongoose.disconnect();
}

seed().catch(async (err) => {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
});