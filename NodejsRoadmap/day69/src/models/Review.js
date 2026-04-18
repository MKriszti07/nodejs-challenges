const { mongoose } = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, required: true, trim: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }
    },
    { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };