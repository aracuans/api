const ytmp3 = require('express').Router();
const puppeteer = require("puppeteer");

async function getYtmp3(URL) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://ytmp3.cc/en13/');

    await page.type('#txt-url', `${URL}`);
	await page.click('#process_mp3', {delay: 300});

    await page.waitForSelector('#process-result > div > a');
    let getVideo = await page.$eval('#process-result > div > a', (element) => {
        return element.getAttribute('href');
    });
    let titleInfo = await page.$eval('#result > div > div.col-xs-12.col-sm-7.col-md-8 > div > b', el => el.innerText);
	browser.close()
    return { getVideo, titleInfo }
}

ytmp3.get('/', async (req, res) => {
    var URL = req.query.URL;
    const gets = await getYtmp3(URL);
    res.json(gets)
});

module.exports = ytmp3;
