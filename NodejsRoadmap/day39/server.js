const express = require('express');

const app = express();
const PORT = 3000;

// Fake "database" of posts
const posts = [];
for (let i = 1; i <= 50; i++) {
    posts.push({
        id: i,
        title: `Post ${i}`,
        body: `This is the content of post ${i}.`,
    });
}

// GET /posts?page=1&limit=10
app.get('/posts', (req, res) => {
    // 1) Parse query params
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    // 2) Calculate indexes
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // 3) Slice the posts array
    const paginatedPosts = posts.slice(startIndex, endIndex);

    // 4) Metadata
    const totalItems = posts.length;
    const totalPages = Math.ceil(totalItems / limit);

    // 5) Handle out-of-range page
    if (page > totalPages && totalItems !== 0) {
        return res.status(404).json({
            success: false,
            message: 'Page not found',
        });
    }

    res.json({
        success: true,
        page,
        limit,
        totalItems,
        totalPages,
        data: paginatedPosts,
    });
});

// Simple health route
app.get('/', (req, res) => {
    res.send('Pagination demo. Try /posts?page=1&limit=5');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// # First page, default limit 10
// curl "http://localhost:3000/posts"

// # Page 2, 5 items per page
// curl "http://localhost:3000/posts?page=2&limit=5"

// # Large page number (should 404 if beyond totalPages)
// curl "http://localhost:3000/posts?page=999&limit=10"