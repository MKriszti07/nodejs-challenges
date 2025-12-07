// --- 1. Basic Logging Methods ---
console.log('--- 1. Basic Logging ---');

// console.log(): The most common method. Outputs general information or variable values.
const user = { id: 101, status: 'active' };
console.log('User object details:', user);
console.log('Script execution started at:', new Date().toLocaleDateString());
console.log('');

// console.error(): Outputs a message to stderr (Standard Error Stream).
// Useful for distinguishing critical errors from regular log output.
try {
    throw new Error('This is a simulated critical application error.');
} catch (e) {
    console.error('ERROR:', e.message);
}
console.log('');

// console.warn(): Outputs a message to stderr, typically highlighting non-critical issues.
const config = { port: 8080 };
if (config.port === 8080) {
    console.warn('WARNING: Using default port 8080. Change this in production.');
}
console.log('');

// --- 2. Timing and Performance Methods ---
console.log('--- 2. Timing and Performance ---');

// console.time(label): Starts a timer you can use to track how long an operation takes.
// The label must be a string and is used to identify the timer.
const timerLabel = 'dataProcessingTime';
console.time(timerLabel);

// Simulate a time-consuming operation (e.g., a loop or database query)
for (let i = 0; i < 1e6; i++) {
    // This loop does nothing but takes time
}

// console.timeEnd(label): Stops the timer started with the matching label and outputs the elapsed time.
console.timeEnd(timerLabel);
console.log('');

// --- 3. Stack Tracing Method ---
console.log('--- 3. Stack Tracing ---');

// console.trace(): Prints a stack trace to stderr showing the execution path 
// that led to the current point in the code. Very useful for debugging nested calls.
function functionC() {
    console.log('Inside functionC.');
    console.trace('Trace from functionC:');
}

function functionB() {
    console.log('Inside functionB.');
    functionC();
}

function functionA() {
    console.log('Inside functionA.');
    functionB();
}

functionA();
