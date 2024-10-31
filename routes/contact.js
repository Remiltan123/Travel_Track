// routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Route to handle contact form submission
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please fill in all fields' });
    }

    // Nodemailer transporter setup
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'marypowsteenaj@gmail.com', // your Gmail account
            pass: 'Teena@2001',  // your Gmail password (use app password if 2FA enabled)
        },
    });

    // Email options
    let mailOptions = {
        from: email,
        to: 'marypowsteenaj@gmail.com', // Your email where you want to receive messages
        subject: `Contact Form Submission from ${name}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    try {
        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ msg: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ msg: 'Error sending message. Please try again later.' });
    }
});

module.exports = router;
