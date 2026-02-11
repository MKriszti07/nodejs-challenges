const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// GET /profile - Protected route (requires authentication)
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'This is your profile',
        user: req.user
    });
});

// GET /admin - Admin-only route (requires authentication + admin role)
router.get('/admin', authenticateToken, authorizeAdmin, (req, res) => {
    res.json({
        message: 'Welcome to the admin panel',
        user: req.user
    });
});

module.exports = router;