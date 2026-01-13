/**
 * fileSystemExample.js
 * * Demonstrates the use of Node.js's built-in 'fs' module 
 * (File System) for file and directory manipulation.
 */

// Import the 'fs/promises' for modern asynchronous (non-blocking) operations
const fs = require('fs/promises');
const fsSync = require('fs');

//Define file and directory names
const FILENAME = 'example.txt';
const DIRNAME = 'temp_data_dir';
const SYNCHRONOUS_FILE = 'sync_test.txt';

// --- Main Asynchronous Function ---
async function runFileSystemDemo() {
    console.log('--- 📂 FS Module Demo Started ---');
    
    // ----------------------------------------------------------------------
    // 1. Asynchronous File Writing (Using Promises)
    // ----------------------------------------------------------------------
    console.log('\n## 1. Asynchronous Write/Read');
    try {
        const fileContent = 'Hello from the asynchronous world of Node.js!';

        // Writing a file (overwrites existing content)
        console.log(`Writing data asynchronously to ${FILENAME}...`);
        await fs.writeFile(FILENAME, fileContent);
        console.log(`${FILENAME} created/overwritten successfully.`);

        // Reading a file
        console.log(`Reading data asynchronously from ${FILENAME}...`);
        const data = await fs.readFile(FILENAME, { encoding: 'utf8' });
        console.log(`Read data: **${data.trim()}**`);

    } catch (error) {
        // Handling errors during async operations
        console.error('An error occurred during async file operation:', error.message);
    }

    // ----------------------------------------------------------------------
    // 2. Synchronous File Writing/Reading (Blocking)
    // ----------------------------------------------------------------------
    console.log('\n## 2. Synchronous Write/Read');
    try {
        const syncContent = 'This is content written synchronously.';

        // Writing a file (BLOCKS the execution thread)
        console.log(`Writing data synchronously to ${SYNCHRONOUS_FILE}...`);
        fsSync.writeFileSync(SYNCHRONOUS_FILE, syncContent);
        console.log(`${SYNCHRONOUS_FILE} written successfully.`);

        // Reading a file (BLOCKS the execution thread)
        const syncData = fsSync.readFileSync(SYNCHRONOUS_FILE, { encoding: 'utf8' });
        console.log(`Read data: **${syncData.trim()}**`);

    } catch (error) {
        console.error('An error occurred during sync file operation:', error.message);
    }

    // ----------------------------------------------------------------------
    // 3. Appending Data
    // ----------------------------------------------------------------------
    console.log('\n## 3. Appending Data');
    try {
        const appendText = '\n--- Appended additional line.';

        // Appending data (adds to the end of the file)
        console.log(`Appending data to ${FILENAME}...`);
        await fs.appendFile(FILENAME, appendText);
        console.log('Data appended successfully.');

        // Re-read to confirm the append
        const appendedData = await fs.readFile(FILENAME, { encoding: 'utf8' });
        console.log(`Full content after append: **${appendedData.trim()}**`);

    } catch (error) {
        console.error('An error occurred during append operation:', error.message);
    }

    // ----------------------------------------------------------------------
    // 4. Directory Management
    // ----------------------------------------------------------------------
    console.log('\n## 4. Directory Management');
    try {
        // Create a directory
        console.log(`Creating directory: ${DIRNAME}...`);
        // recursive: true ensures parent directories are also created if needed
        await fs.mkdir(DIRNAME, { recursive: true });
        console.log(`${DIRNAME} created successfully.`);

        // Write a temporary file inside the new directory
        await fs.writeFile(`${DIRNAME}/temp.info`, 'Directory structure test.');

        // Read the contents of the directory
        console.log(`Reading contents of directory ${DIRNAME}...`);
        const files = await fs.readdir(DIRNAME);
        console.log(`Files found in ${DIRNAME}:`, files);

    } catch (error) {
        console.error('An error occurred during directory operation:', error.message);
    }

    // ----------------------------------------------------------------------
    // 5. Cleanup and Common Error Handling (No Such File)
    // ----------------------------------------------------------------------
    console.log('\n## 5. Cleanup and Error Handling');
    try {
        // Attempt to remove a file that doesn't exist to demonstrate error handling
        await fs.unlink('non_existent_file.del');

    } catch (error) {
        // Node.js file system errors have a 'code' property
        if (error.code === 'ENOENT') {
            console.warn(`WARN: Cannot delete 'non_existent_file.del'. **Error Code: ${error.code}** (No Such File or Directory)`);
        } else {
            // Re-throw any other unexpected error
            throw error;
        }
    }

    // Clean up created files and directories
    await fs.unlink(FILENAME);
    await fs.unlink(SYNCHRONOUS_FILE);
    await fs.unlink(`${DIRNAME}/temp.info`);    // Delete file inside the directory first

    // Remove the directory (must be empty first)
    await fs.rmdir(DIRNAME);    // Node >= 14

    console.log('Cleanup complete. All test files/directories removed.');
    console.log('--- 🟢 FS Module Demo Finished ---');
}

runFileSystemDemo();