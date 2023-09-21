const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');
const { scrollPageToTop } = require('puppeteer-autoscroll-down')
//const https = require('https');
const fs = require('fs');
const imgs = "./imgs";
let i = 0;
let totalHeight = 1240;
// const buildTemplate = (tupe) => {
    //     return `
    //         <div style = "font-size: 10px; color: black">
    //             <span>${tupe === 'header'?'HEADER': 'FOOTER'} </span>
    //             <span class="date"> </span>
    //             <span class="title"> </span>
    //             <span class="url"> </span>
    //             <span class="pageNumber"> </span>
    //    
            //  <span class="totalPages"> </span>
    //         </div>
    //     `
    // }
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


// await page.pdf({
//     path: 'doc.pdf',
//     timeout: 30000,
//     displayHeaderFooter: true,
//    // headerTemplate: buildTemplate('header'),
//    // footerTemplate: buildTemplate('footer'),
//     printBackground: true,
//     landscape: false,
//     format: 'A4',
//     margin: {
//         top: 100,
//         right: 40,
//         bottom: 100,
//         left: 40,
//     },
    
// })


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
//?
async function convertPNGtoPDF(imagePaths, outputPath) {
    const page2 = await browser.newPage();
    await page2.goto('about:blank');
    
    for (const imagePath of imagePaths) {
        await page2.goto(`file://${imagePath}`, { waitUntil: 'networkidle0' });
        
    }
    await page2.pdf({ 
        path: outputPath, 
        format: 'A4', 
        printBackground: true 
    });
}



