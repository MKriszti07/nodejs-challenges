const { mongoose } = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        authorName: { type: String, required: true, trim: true }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate: Book -> Reviews
bookSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'book'
});

const Book = mongoose.model('Book', bookSchema);

module.exports = { Book };