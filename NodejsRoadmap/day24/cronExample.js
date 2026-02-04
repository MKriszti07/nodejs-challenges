const cron = require('node-cron');
const fs = require('fs');

// Task 1: Log message to the console every minute
cron.schedule('* * * * *', () => {
    console.log('Hello, CRON! Task 1 executed.');
});

// Task 2: Write current date and time to a file every 5 minutes
cron.schedule('*/5 * * * *', () => {
    const now = new Date().toISOString();
    console.log(`Task 2 executed at: ${now}`);
    fs.appendFileSync('day24/timeLog.txt', `Task executed at: ${now}\n`);
});

// Task 3: Log message daily at 9:00 AM
cron.schedule('0 9 * * *', () => {
    console.log('Daily Task Executed at 9:00 AM');
});

console.log('CRON Jobs initialized. Server is running...');
