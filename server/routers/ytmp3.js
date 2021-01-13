const ytmp3 = require('express').Router();
const puppeteer = require("puppeteer");

async function getYtmp3(URL) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www-ytmp3.com/');

    await page.type('#input', `${URL}`);
	await page.click('#submit', {delay: 300});

    await page.waitForSelector('#mylink');
    let getVideo = await page.$eval('#mylink', (element) => {
        return element.getAttribute('href');
    });
    let titleInfo = await page.$eval('#title', el => el.innerText);
	browser.close()
    return { getVideo, titleInfo }
}

ytmp3.get('/', async (req, res) => {
    var URL = req.query.URL;
    const gets = await getYtmp3(URL);
    res.json(gets)
});

module.exports = ytmp3;
