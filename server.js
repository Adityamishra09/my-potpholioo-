const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Verify environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Error: Email configuration is missing. Please check your .env file.');
    process.exit(1);
}

// Nodemailer configuration with better error handling
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Contact form endpoint with enhanced error handling
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Input validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            replyTo: email, // Allow direct reply to the sender
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Handle specific error cases
        if (error.code === 'EAUTH') {
            return res.status(500).json({ 
                success: false, 
                message: 'Email authentication failed. Please check your email configuration.' 
            });
        }
        
        if (error.code === 'ESOCKET') {
            return res.status(500).json({ 
                success: false, 
                message: 'Network error while sending email. Please try again later.' 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message. Please try again later.' 
        });
    }
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the website`);
}); 