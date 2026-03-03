const { verifyToken } = require('../utils/authUtils');

// Reads JWT from cookie and sets req.user if valid
function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.token; // cookie name: "token"
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
        }

        const decoded = verifyToken(token);
        // Attach user info to the request (id, email, etc.)
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
        };

        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
}

module.exports = { requireAuth };