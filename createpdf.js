const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://stackoverflow.com/questions/6737824/how-to-run-a-hello-js-file-in-node-js-on-windows', { waitUntil: 'networkidle' });
    await page.pdf({ path: 'pdf/hn.pdf', format: 'A4' });

    browser.close();
})();
