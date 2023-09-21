const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');
const { scrollPageToTop } = require('puppeteer-autoscroll-down')
//const https = require('https');
const fs = require('fs');
const imgs = "./imgs";
let i = 0;
let totalHeight = 1240;

const URL = 'https://school.kotar.cet.ac.il/KotarApp/Viewer.aspx?nBookID=103947541#1.0.6.default';
//const URL = 'https://www.npmjs.com/package/puppeteer';

(async () => {
    if(!fs.existsSync(imgs)){
        fs.mkdirSync(imgs)
    }
    
    
    const browser = await puppeteer.launch({
        headless: true, 
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--hide-scrollbars',
            '--disable-web-security',
        ],});  
    const page = await browser.newPage();
        
    await page.goto(URL, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        //timeout: 30000,
    });
        
    await page.setViewport({
        width: 1000,
        height: 1240
    })
    
    const lastPosition = await scrollPageToBottom(page, {
        size: 1240,
        delay: 0
    })

    let pageHeight = lastPosition;
    const goBack = await scrollPageToTop(page, {
        size: 1240,
        delay: 0
    })

    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await page.screenshot({
        path: `imgs/${i++}.png`, 
    });
    await tor(page, pageHeight);
    await browser.close();
})();

async function tor(page, pageHeight){
    if(totalHeight <= pageHeight){
        scrollDown(page, totalHeight);
        await takeScreenshot(page);
        totalHeight += 1240;
        await tor(page, pageHeight);
    }
};

async function scrollDown(page , scrollHeight) {
    await page.evaluate((height) => {
        window.scrollTo(0, height);
        }, scrollHeight);
}

async function takeScreenshot(page) {
    await page.waitForTimeout(300);
    await page.screenshot({
    path: `imgs/${i++}.png`, 
    });
     
}





