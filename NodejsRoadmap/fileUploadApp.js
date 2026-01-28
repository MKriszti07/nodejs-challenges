const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Generate unique filenames
    }
});

//Multer config
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter: (req, file, cb) => {
        // Only accept specific file types
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'))
        }
    },
});

// Middleware to handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle single file upload
app.post("/upload", upload.single('userfile'), (req, res) => {
    try {
        res.status(200).json({
            message: 'File uploaded successfully!',
            file: req.file,
        });
    } catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
});

// Serve HTML upload form
app.get("/", (req, res) => {
    res.send(`
    <h1>File Upload</h1>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <div>
        <label>Select a file:</label>
        <input type="file" name="userfile" />
      </div>
      <div>
        <button type="submit">Upload</button>
      </div>
    </form>
  `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});