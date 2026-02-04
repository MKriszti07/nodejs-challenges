require('dotenv').config();

const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Task: Send daily email at 8:00 AM
cron.schedule('0 8 * * *', async () => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'krisztina.makovinyi07@gmail.com',
        subject: 'Daily Reminder',
        text: 'This is your daily reminder email!'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: Daily Reminder');
    } catch (error) {
        console.error('Failed to send email:', error.message);
    }
});

console.log('Reminder email scheduler initialized.');