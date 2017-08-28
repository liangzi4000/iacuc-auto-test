const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/GoogleChrome/puppeteer');
  await page.screenshot({ path: 'screenshot/example.png', fullPage: true });

  browser.close();
})();