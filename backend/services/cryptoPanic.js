const axios = require("axios");
const needle = require("needle");
const cheerio = require("cheerio");

const getHeadlines = async () => {
    const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTOPANIC_API_KEY}&public=true`
    const response = await axios.get(url);
    return response.data.results;
}
const puppeteer = require('puppeteer');

async function loadHTML(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    const html = await page.content();
    await browser.close();
    return html;
}

// Use the function
const scrapeSummaries = async (headlines, topN = 10) => {
    const summaries = [];
    for (let headline of headlines.slice(0, topN)) {
        const summary = {
            title: headline.title,
            url: headline.url,
            source: headline.source.title,
            published_at: headline.published_at,
        }
        summaries.push(summary);
    }
    for (let summary of summaries) {
        console.log(summary);
        const html = await loadHTML(summary.url);
        const $ = cheerio.load(html);
        const text = $('div.description-body').text();
        console.log(text);
        summary.description = text;
    }
    return summaries;
}


async function getHeadlinesWithSummaries(mode) {
    if (mode === 'jsonFile') {
        const fs = require('fs');
        const dirOfThisFile = __dirname;
        const currentDir = process.cwd();
        const data = fs.readFileSync(`${currentDir}/services/json/cryptoNews.json`, 'utf8');
        return JSON.parse(data)
    }
    const rawHeadlines = await getHeadlines();
    return await scrapeSummaries(rawHeadlines);
}

const main = async () => {
    require('dotenv').config();
    const summaries = await getHeadlinesWithSummaries();
    console.log(summaries);
}

if (require.main === module) {
    main().then(() => console.log('Done')).catch((e) => console.error(e));
}

module.exports = {
    getHeadlines,
    getHeadlinesWithSummaries
}