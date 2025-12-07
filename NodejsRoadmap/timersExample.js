/**
 * timersExample.js
 * * Demonstrates the use of Node.js Timer functions: 
 * setTimeout(), setInterval(), clearTimeout(), and clearInterval().
 */

console.log('--- ⏰ Node.js Timers Demo Started ---');
console.log(`Current time: ${new Date().toLocaleTimeString()}`);
console.log('');


// --- 1. setTimeout() and clearTimeout() ---

// 1a. Set a timeout to execute a function after 3 seconds (3000 milliseconds)
console.log('1a. Setting a delay execution (setTimeout)...');
const delayedFunction = () => {
    console.log(`[TIMEOUT 1] Executed 3 seconds later at: ${new Date().toLocaleTimeString()}`); 
};

const timeoutId = setTimeout(delayedFunction, 3000);

// 1b. Set a second timeout, but cancel it immediately using clearTimeout()
console.log('1b. Setting and immediatly clearing a second timeout...');
const cancelledTimeoutFunction = () => {
    console.log('[TIMEOUT 2] This message will never appaer.');
};

const timeoutIdToCancel = setTimeout(cancelledTimeoutFunction, 1000);

// Use clearTimeout() to stop the second timeout before it can execute
clearTimeout(timeoutIdToCancel);
console.log('   (Timeout 2 was cleared and will not run.)');
console.log('');

// --- 2. setInterval() and clearInterval() ---

// 2a. Set an interval to execute a function repeatedly every 1 second (1000 milliseconds)
console.log('2a. Setting a repeated execution (setInterval)...');
let intervalCounter = 0;

const repeatedFunction = () => {
    intervalCounter++;
    console.log(`[INTERVAL] Executed ${intervalCounter} time(s) at: ${new Date().toLocaleTimeString()}`);

    // Stop the interval after 5 executions
    if (intervalCounter >= 5) {
        // Use clearInterval() to stop the repeated execution
        console.log('   (Limit reached. Clearing the interval now.)');
        clearInterval(intervalId);

        // Since the interval is stopped, we can optionally exit the process 
        // if this was the last pending operation.
        // process.exit(0); // Uncomment this line to stop the script automatically
    }
};

const intervalId = setInterval(repeatedFunction, 1000);