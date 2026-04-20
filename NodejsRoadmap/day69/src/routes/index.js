const express = require('express');
const { User } = require('../models/User');
const { Book } = require('../models/Book');
const { Review } = require('../models/Review');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({ ok: true, date: new Date().toISOString() });
});

/**
 * A) Get all reviews with populated user + book (basic populate + select)
 * GET /reviews
 */
router.get('/reviews', async (req, res) => {
    const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .populate({ path: 'user', select: 'username email' })
        .populate({ path: 'book', select: 'title author' });

    res.json(reviews);
});

/**
 * B) Get one book with its reviews, and each review’s user (nested populate)
 * GET /books/:id
 */
router.get('/books/:id', async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id).populate({
        path: 'reviews', // virtual populate
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'user',
            select: 'username'
        }
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });

    res.json(book);
});

/**
 * C) Get one user with their reviews (virtual populate), and each review’s book
 * GET /users/:id
 */
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'book',
            select: 'title authorName'
        }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
});

/**
 * D) Book summary: only title + most recent 2 reviews + user.username
 * GET /books/:id/summary
 */
router.get('/books/:id/summary', async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id).select('title');

    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Populate reviews with limit + nested populate + select
    await book.populate({
        path: 'reviews',
        select: 'rating text createdAt user',
        options: { sort: { createdAt: -1 }, limit: 2 },
        populate: { path: 'user', select: 'username' }
    });

    res.json({
        _id: book._id,
        title: book.title,
        recentReviews: book.reviews
    });
});

/**
 * Extra: create a review quickly (so you can test population dynamically)
 * POST /reviews
 * body: { rating, text, userId, bookId }
 */
router.post('/reviews', async (req, res) => {
    const { rating, text, userId, bookId } = req.body;

    const [user, book] = await Promise.all([
        User.findById(userId),
        Book.findById(bookId)
    ]);

    if (!user) return res.status(400).json({ error: 'Invalid userId' });
    if (!book) return res.status(400).json({ error: 'Invalid bookId' });

    const review = await Review.create({
        rating,
        text,
        user: user._id,
        book: book._id
    });

    // return populated version
    const populated = await Review.findById(review._id)
        .populate({ path: 'user', select: 'username email' })
        .populate({ path: 'book', select: 'title authorName' });

    res.status(201).json(populated);
});

module.exports = { router };