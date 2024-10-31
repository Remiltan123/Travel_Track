const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            role: role || 'user'  // Default role is 'user'
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role  // Include role in payload
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('Registration Error:', error); // Log the error
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// POST /api/auth/login - Log in a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role  // Include role in payload
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/auth/user - Get user details (requires authentication)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/auth/user - Update user details (requires authentication)
router.patch('/user', authMiddleware, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// DELETE /api/auth/user - Delete a user (requires authentication)
router.delete('/user', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndRemove(req.user.id);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({ count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'Failed to fetch user count' });
    }
});

module.exports = router;