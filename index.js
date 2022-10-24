const puppeteer = require('puppeteer');

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    console.log('Hello world received a request.');

    const data = await crawlePage()

    const target = process.env.TARGET || 'World';
    res.send(data);
});


app.get('/', async (req, res) => {
    console.log('Hello world received a request.');

    const data = await crawlePage()

    const target = process.env.TARGET || 'World';
    res.send(data);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Hello world listening on port', port);
});

const extractDataFromPerformanceTiming = (timing, ...dataNames) => {
    const navigationStart = timing.navigationStart;

    const extractedData = {};
    dataNames.forEach(name => {
        extractedData[name] = timing[name] - navigationStart;
    });

    return extractedData;
};

async function testPage(page) {
    await page.goto('https://nicastro.io/');

    const performanceTiming = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.timing)));

    return extractDataFromPerformanceTiming(performanceTiming, 'domContentLoadedEventEnd', 'loadEventEnd');
}

async function crawlePage() {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: true,
        args: ['--window-size=1920,1080', '--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: 1040, height: 1080, deviceScaleFactor: 1,
    });
    // console.log(await testPage(page));
    // console.log(await testPage(page))
    const times = await testPage(page);
    console.log(times)

    console.log(await page.title())
    const image = await page.screenshot({path: '/usr/src/app/example2.png'});
    const returnedB64 = Buffer.from(image).toString('base64');

    await browser.close();
    return {'image': returnedB64, 'times': times};
}


// // {
// //     ignoreHTTPSErrors: true,
// //         acceptInsecureCerts: true,
// //     args: [
// //     '--proxy-bypass-list=*',
// //     '--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process', '--ignore-certificate-errors', '--ignore-certificate-errors-spki-list', '--enable-features=NetworkService']
// // }
// const browser = await puppeteer.launch();
// const page = await browser.newPage();
// await page.goto('https://dev.to/sonyarianto/practical-puppeteer-how-to-use-waitforxpath-and-evaluate-xpath-expression-15cp',
// //     {
// //     waitUntil: "domcontentloaded",
// // }
// );
// await page.screenshot({path: 'example2.png'});
// //
// // const perf = await page.evaluate(_ => {
// //     const {loadEventEnd, navigationStart} = performance.timing;
// //     return ({loadTime: loadEventEnd - navigationStart})
// // })
// //
// // console.log(perf)
//
// await browser.close();
// })();