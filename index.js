const puppeteer = require('puppeteer');
//import puppeteer from 'puppeteer';

(async () => {
  
  const browser = await puppeteer.launch({headless: true});
  //const browser = await puppeteer.launch({headless: false}); 

  const page = await browser.newPage();

  await page.goto('https://www.npmjs.com/package/puppeteer');
  await page.screenshot({path: 'sc.png'});

  
  await browser.close();
})();