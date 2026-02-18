require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON body
app.use(express.json());

// 1. Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',   // or your provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

// Optional: verify transporter configuration at startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Error configuring transporter:', error);
    } else {
        console.log('Nodemailer is ready to send emails');
    }
});

// 2. Route to handle contact form submission
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Please provide name, email, and message',
        });
    }

    // 3. Build email options
    const mailOptions = {
        from: `"Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
        subject: `New contact form submission from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}

            Message:
            ${message}
        `,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
    };

    try {
        // 4. Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent:', info.messageId);

        return res.status(200).json({
            success: true,
            message: 'Contact message sent successfully',
            id: info.messageId,
        });
    } catch (error) {
        console.error('Error sending email:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to send email',
        });
    }
});

// Health check route
app.get('/', (req, res) => {
    res.send('Nodemailer Contact API is running');
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});