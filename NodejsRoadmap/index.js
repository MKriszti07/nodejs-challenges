console.log("Hello World!");

// --- 1. Define and Log Paths ---

console.log('--- 🗺️ Script and Directory Information ---');
console.log(`__dirname (Script Directory): ${__dirname}`);
console.log(`__filename (Script File Path): ${__filename}`);
console.log(`process.cwd() (Current Working Directory): ${process.cwd()}`);
console.log('');

// --- 2. Read and Prioritize Configuration ---

let limit = 10; // Default fallback value
let source = 'Default';

// 2a. Check Command Line Arguments (process.argv)
// process.argv is an array, we look for an element like '--limit=50'
const limitArg = process.argv.find(arg => arg.startsWith('--limit='));

if (limitArg) {
    // Extract the number after the '=' sign
    const value = limitArg.split('=')[1];
    const parsedValue = parseInt(value, 10);

    if (!isNaN(parsedValue)) {
        limit = parsedValue;
        source = 'Command Line Argument';
    }
} else {
    // 2b. Check Environment Variable (process.env)
    const envLimit = process.env.NODE_ENV_LIMIT;

    if (envLimit) {
        const parsedValue = parseInt(envLimit, 10);
        
        if (!isNaN(parsedValue)) {
            limit = parsedValue;
            source = 'Environment Variable (NODE_ENV_LIMIT)';
        }
    }
}

console.log('--- ⚙️ Configuration Priority Check ---');
console.log(`The final chosen limit is: **${limit}**`);
console.log(`Source of the limit: ${source}`);
console.log('');


// --- 3. Process Management and Exit ---

console.log('--- 🧠 Process Metrics ---');

// Get and display memory usage details
const memory = process.memoryUsage();
console.log('Memory Usage (bytes):');
console.log(`  RSS (Resident Set Size): ${memory.rss}`);
console.log(`  Heap Total: ${memory.heapTotal}`);
console.log(`  Heap Used: ${memory.heapUsed}`);
console.log('');

// Perform an operation (using the determined limit)
console.log(`Starting an operation with a limit of ${limit}...`);
// Simulate some work...
for (let i = 0; i < limit; i++) {
    // console.log(`Step ${i + 1}`);
}
console.log('Operation complete.');

// Exit the process with a successful code (0)
console.log('Exiting the Node.js process with code 0.');
// process.exit() terminates the script immediately.
process.exit(0);

// Any code after process.exit(0) will NOT be executed.
// console.log('This will not be printed.');

