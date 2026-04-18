const { mongoose } = require('mongoose');

async function connectDB(uri) {
    mongoose.set('strictQuery', true);

    await mongoose.connect(uri);

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB error:', err);
    });
}

module.exports = { connectDB };