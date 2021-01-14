const ige = require('express').Router();
const puppeteer = require("puppeteer");

async function getIge(URL) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://ingramer.com/downloader/instagram/photo/');

    await page.type('#downloaderform-url', `${URL}`);
    await page.click('#search', { delay: 300 });

    await page.waitForSelector('#ajax-results > div > div:nth-child(1) > div > div > a', {delay: 300});
    let LinkDownload = await page.$eval("#ajax-results > div > div:nth-child(1) > div > div > a", (element) => {
        return element.getAttribute("href");
    });
  let creator = ('CUANS')
	let username = await page.$eval('#ajax-results > div > div:nth-child(2) > div > div > div.da-username.da-icon-text > span', el => el.innerText);
	browser.close();
    return { LinkDownload, username, creator }
}

ige.get('/', async (req, res) => {
    var URL = req.query.URL;
    const gets = await getIge(URL);
    res.json(gets)
});

module.exports = ige;
