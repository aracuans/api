const ytmp3 = require('express').Router();
const puppeteer = require("puppeteer");

async function getYtmp3(URL) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.y2mate.com/');

    await page.type('#txt-url', `${URL}`);
	await page.click('#btn-submit', {delay: 300});

    await page.waitForSelector('#process-result > div > a');
    let getVideo = await page.$eval('#process-result > div > a', (element) => {
        return element.getAttribute('href');
    });
    let titleInfo = await page.$eval('#result > div > div.col-xs-12.col-sm-5.col-md-5 > div.thumbnail.cover > div > b', el => el.innerText);
	browser.close()
    return { getVideo, titleInfo }
}

ytmp3.get('/', async (req, res) => {
    var URL = req.query.URL;
    const gets = await getYtmp3(URL);
    res.json(gets)
});

module.exports = ytmp3;
