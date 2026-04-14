require('dotenv').config();

const express = require('express');
const { router: weatherRouter } = require('./routes/weather');

const app = express();
app.use('/api', weatherRouter);

const port = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

module.exports = { app };