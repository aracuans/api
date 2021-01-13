const ytmp3 = require('express').Router();
const puppeteer = require("puppeteer");

async function getYtmp3(URL) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.y2mate.com/youtube-mp3/');

    await page.type('#txt-url', `${URL}`);
	await page.click('#process_mp3', {delay: 300});

    await page.waitForSelector('#process-result > div > a');
    let urlAudio = await page.$eval('#process-result > div > a', (element) => {
        return element.getAttribute('href');
    });
    return { urlAudio }
}

ytmp3.get('/', async (req, res) => {
    var URL = req.query.URL;
    const gets = await getYtmp3(URL);
    res.json(gets)
});

module.exports = ytmp3;
