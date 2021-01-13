const ytmp3 = require('express').Router();
const puppeteer = require("puppeteer");

async function getYtmp3(URL) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://keepv.id/');

    await page.type('#url', `${URL}`);
	await page.click('#send', {delay: 300});

    await page.waitForSelector('#audio > table > tbody > tr:nth-child(1) > td:nth-child(3) > a');
    let getVideo = await page.$eval('#audio > table > tbody > tr:nth-child(1) > td:nth-child(3) > a', (element) => {
        return element.getAttribute('href');
    });
    let titleInfo = await page.$eval('#links > div.col-12.mt-5.text-center > h5', el => el.innerText);
	browser.close()
    return { getVideo, titleInfo }
}

ytmp3.get('/', async (req, res) => {
    var URL = req.query.URL;
    const gets = await getYtmp3(URL);
    res.json(gets)
});

module.exports = ytmp3;
