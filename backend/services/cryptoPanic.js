const axios = require("axios");
const needle = require("needle");
const cheerio = require("cheerio");

const getHeadlines = async () => {
    const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTOPANIC_API_KEY}&public=true`
    const data = (await axios.get(url)).data;
    const {results} = data;
    return results;
}
const puppeteer = require('puppeteer');
const {logger, logError} = require("#src/middlewares/logger");

async function loadHTML(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    const html = await page.content();
    await browser.close();
    return html;
}

// Use the function
const scrapeSummaries = async (headlines, topN = 3) => {
    const summaries = [];
    for (let headline of headlines.slice(0, topN)) {
        const summary = {
            id: headline.id,
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

        // check existing json file for the description using id
        // if found, use that description
        // else, scrape the description
        // save the description to the json file

        const fs = require('fs');
        const dirOfThisFile = __dirname;
        const currentDir = process.cwd();
        const data = fs.readFileSync(`${currentDir}/services/json/cryptoNews.json`, 'utf8');
        const json = JSON.parse(data);
        const found = json.find(item => item.id === summary.id);
        if (found) {
            summary.description = found.description;
            continue;
        }

        const $ = cheerio.load(html);
        const htmlContent = $('div.description-body').html();
        if (!htmlContent) {
            logger.error(`Could not find description for ${summary.url}`);
            logger.info(html);
            continue;
        }
        const splitContent = htmlContent.split('<br>');
        let textBeforeFirstBr;

        if (splitContent.length > 1) {
            textBeforeFirstBr = splitContent[0];
        } else {
            textBeforeFirstBr = htmlContent;
        }

        const $textBeforeFirstBr = cheerio.load(textBeforeFirstBr);
        const text = $textBeforeFirstBr.text();
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

async function saveHeadlinesWithSummaries() {
    const fs = require('fs');
    const summaries = await getHeadlinesWithSummaries();
    const currentDir = process.cwd();
    fs.writeFileSync(`${currentDir}/services/json/cryptoNews.json`, JSON.stringify(summaries, null, 4));
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
    getHeadlinesWithSummaries,
    saveHeadlinesWithSummaries,
}