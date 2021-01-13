const instagram = require('express').Router();
const puppeteer = require("puppeteer");

async function ig(URL) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.w3toys.com/');

    await page.type('#link', `${URL}`);
	await page.click('#submit', {delay: 300});

    await page.waitForSelector('#content > div > div > a:nth-child(4)', {delay: 300});
    let getData = await page.$eval('#content > div > div > a:nth-child(4)', (element) => {
        return element.getAttribute('href');
    });
	browser.close();
    return { getData }
}


instagram.get('/', async (req, res) => {
    var URL = req.query.URL;
    const gets = await ig(URL);
    res.json(gets)
});

module.exports = instagram;
