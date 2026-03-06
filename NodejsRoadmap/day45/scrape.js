const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeExample() {
    try {
        const url = 'https://example.com';
        const { data: html } = await axios.get(url);

        const $ = cheerio.load(html);

        // Simple: get the main heading
        const title = $('h1').first().text().trim();
        console.log('Page title:', title);

        // Example pattern for lists (adapt per site)
        const links = []
        $('a').each((i, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');
            if (text && href) {
                links.push({ text, href });
            }
        });

        console.log('Found links:', links.slice(0, 5)); // show first 5
    } catch (err) {
        console.error('Scrape error:', err.message);
    }
}

scrapeExample();