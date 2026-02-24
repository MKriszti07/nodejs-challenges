const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Directory where we keep files to download
const FILES_DIR = path.join(__dirname);

// GET /file/:name -> stream file
app.get('file/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = path.join(FILES_DIR, fileName);

    // Check if file exists first (optional but nicer)
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // Set headers (optional, but good practice for downloads)
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Create read stream and pipe to response
        const readStream = fs.createReadStream(filePath);

        readStream.on('error', (error) => {
            console.error('Error reading file:', error);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: 'Error reading file' });
            } else {
                res.destroy(error);
            }
        });

        // This connects the file stream to the HTTP response
        readStream.pipe(res);
    });
});

// Simple health check
app.get('/', (req, res) => {
    res.send('File streaming demo. Use /file/:name');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// curl -O http://localhost:3000/file/bigfile.txt