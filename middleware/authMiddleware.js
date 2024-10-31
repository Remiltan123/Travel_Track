
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/driver');
require('dotenv').config();

// Main Authentication & Role-Based Middleware
module.exports = async function (req, res, next) {
    // Extract token from the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Destructure the decoded token
        const { user } = decoded;

        // Role-based user retrieval
        let userDoc;
        if (user.role === 'user' || user.role === 'admin') {
            userDoc = await User.findById(user.id).select('-password');
        } else if (user.role === 'driver') {
            userDoc = await Driver.findById(user.id);
        }

        // Check if user/driver exists
        if (!userDoc) {
            return res.status(404).json({ msg: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} not found` });
        }

        // Admin-specific role check
        if (user.role === 'admin' && userDoc.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin access denied' });
        }

        // Attach the user and role to the request object
        req.user = userDoc;
        req.role = user.role;

        next();
    } catch (err) {
        console.error('Token Verification Error:', err);

        // Handle token-related errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ msg: 'Token is invalid' });
        } else {
            return res.status(500).json({ msg: 'Token verification failed' });
        }
    }
};


