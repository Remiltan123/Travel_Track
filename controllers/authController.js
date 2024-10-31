const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Default role to 'user' if not provided
        user = new User({
            username,
            email,
            password,
            role: 'user'  // Use provided role or default to 'user'
        });

        // Save user to the database
        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role  // Use role in the payload
            }
        };

        // Sign the JWT token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role }); // Return token and role
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// User login
exports.login = async (req, res) => {
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
                role: user.role  // Use role in the payload
            }
        };
  
        // Sign the JWT token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role }); // Return token and role
            }
        );
        ;
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get user details
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update user details
exports.updateUser = async (req, res) => {
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
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.user.id);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Promote a user to admin
exports.promoteToAdmin = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.role = 'admin';  // Update role to 'admin'
        await user.save();

        res.json({ msg: 'User promoted to admin', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
