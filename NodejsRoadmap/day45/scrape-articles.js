const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeArticles(url) {
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        // You’ll need to inspect the target page’s HTML in dev tools
        // and adjust these selectors appropriately.
        const articles = [];

        // very generic; replace with real class
        $('.article, .post, .story').each((i, el) => {
            const element = $(el);

            const title = element.find('h2 a, h3 a, h2, h3').first().text().trim();
            const link = element.find('a').first().attr('href');
            const summary = element.find('p').first().text().trim();

            if (title && link) {
                articles.push({ title, link, summary });
            }
        });

        return articles;
    } catch (err) {
        console.error('Error while scraping:', err.message);
        return [];
    }
}

// Example usage:
(async () => {
    const url = 'https://example.com/';
    const articles = await scrapeArticles(url);
    console.log(`Found ${articles.length} articles:`);
    console.dir(articles.slice(0, 5), { depth: null });
})();