require('dotenv').config({ path: 'config_grafana' })
const pptrFirefox = require('puppeteer');
var Jimp = require('jimp');
var request = require('request');
var cron = require("node-cron")
var browser, page;


const URL_GRAFANA = process.env.URL_GRAFANA
const USERNAME_GRAFANA = process.env.USERNAME_GRAFANA
const PASSWORD_GRAFANA = process.env.PASSWORD_GRAFANA

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function loginGrafana(page) {
    await page.setViewport({ width: 1466, height: 1100 });
    await page.goto(URL_GRAFANA + '/login', { timeout: 0 });
    await page.waitForSelector('[name="user"]', { timeout: 0 });
    await page.type("[name='user']", USERNAME_GRAFANA)
    await page.type("[name='password']", PASSWORD_GRAFANA)
    await page.evaluate(() => {
        document.querySelectorAll('button')[0].click()
        return "foi"
    })
    return "foi"
}
async function main() {
    browser = await pptrFirefox.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true, ignoreHTTPSErrors: true, waitUntil: ['load', 'domcontentloaded'] });
    page = await browser.newPage();

    await loginGrafana(page)

    await page.waitFor(1000)

    console.log('ge4Dashboard...')
    await ge4Dashboard(page)

    await browser.close();
    await sleep(30000)

    browser = await pptrFirefox.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], ignoreHTTPSErrors: true, waitUntil: ['load', 'domcontentloaded'] });
    page = await browser.newPage();
    await loginGrafana(page)
    await page.waitFor(1000)

    console.log('ge4MonthEnd...')
    await ge4MonthEnd(page)

    await browser.close();
    await sleep(30000)

    browser = await pptrFirefox.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], ignoreHTTPSErrors: true, waitUntil: ['load', 'domcontentloaded'] });
    page = await browser.newPage();
    await loginGrafana(page)
    await page.waitFor(1000)


    console.log('ge4DailyMajor...')
    await ge4DailyMajor(page)

    await browser.close();
    await sleep(30000)

    browser = await pptrFirefox.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], ignoreHTTPSErrors: true, waitUntil: ['load', 'domcontentloaded'] });
    page = await browser.newPage();
    await loginGrafana(page)
    await page.waitFor(1000)

    console.log('ge4UnixServerDetails...');
    await ge4UnixServerDetails(page)

    await browser.close();
    await sleep(30000)

    browser = await pptrFirefox.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], ignoreHTTPSErrors: true, waitUntil: ['load', 'domcontentloaded'] });
    page = await browser.newPage();
    await loginGrafana(page)
    await page.waitFor(1000)


    console.log('ge4NetworkStatus...');
    await ge4NetworkStatus(page)

    await browser.close();
}

async function ge4Dashboard(page) {
    await page.goto(URL_GRAFANA + '/d/uZbVeVBZz/ge4-dashboard');
    await page.waitFor(10000)
    await page.screenshot({ path: 'ge4Dashboard/ge4-dashboard.png' });
    return true;
}

async function ge4MonthEnd(page) {
    await page.goto(URL_GRAFANA + '/d/AbCPWY9ik/gerdau-month-end-dashboard-v1');
    await page.setViewport({ width: 1466, height: 4100 });
    await page.waitFor(2000)
    await page.evaluate(() => {
        while (document.querySelectorAll('[class="fa fa-chevron-right"]').length > 0) {
            document.querySelectorAll('[class="fa fa-chevron-right"]')[0].click()
        }
        return "foi"
    })
    await page.waitFor(30000)
    await page.screenshot({ path: 'ge4MonthEnd/ge4bruto.png' });

    Jimp.read('ge4MonthEnd/ge4bruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 70, 1400, 870)
            .quality(100)
            .write('ge4MonthEnd/ge4Month-Infra.png');
    });

    Jimp.read('ge4MonthEnd/ge4bruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 890, 1400, 1090)
            .quality(100)
            .write('ge4MonthEnd/ge4Month-Checklist.png');
    });

    Jimp.read('ge4MonthEnd/ge4bruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 1950, 1400, 600)
            .quality(100)
            .write('ge4MonthEnd/ge4Month-Oracle.png');
    });

    Jimp.read('ge4MonthEnd/ge4bruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 2500, 1400, 320)
            .quality(100)
            .write('ge4MonthEnd/ge4Month-HanaHa4.png');
    });

    Jimp.read('ge4MonthEnd/ge4bruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 2800, 1400, 460)
            .quality(100)
            .write('ge4MonthEnd/ge4MonthEnd-stoBrSoftlayerConnectivity.png');
    });

    Jimp.read('ge4MonthEnd/ge4bruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 3240, 1400, 250)
            .quality(100)
            .write('ge4MonthEnd/ge4Month-HortoCoreSwitch.png');
    });
    return true;
}

async function ge4DailyMajor(page) {
    await page.goto(URL_GRAFANA + '/d/_AS6gSfWz/daily-major-environments-overview');
    await page.setViewport({ width: 1466, height: 4100 });
    await page.waitFor(2000)
    await page.evaluate(() => {
        while (document.querySelectorAll('[class="fa fa-chevron-right"]').length > 0) {
            document.querySelectorAll('[class="fa fa-chevron-right"]')[0].click()
        }
        return "foi"
    })
    await page.waitFor(30000)
    await page.screenshot({ path: 'ge4DailyMajor/ge4DailyMajorbruto.png' });

    Jimp.read('ge4DailyMajor/ge4DailyMajorbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 70, 1400, 600)
            .quality(100)
            .write('ge4DailyMajor/ge4DailyMajor-b7p.png');
    });

    Jimp.read('ge4DailyMajor/ge4DailyMajorbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 680, 1400, 690)
            .quality(100)
            .write('ge4DailyMajor/ge4DailyMajor-pn4.png');
    });

    Jimp.read('ge4DailyMajor/ge4DailyMajorbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 1390, 1400, 670)
            .quality(100)
            .write('ge4DailyMajor/ge4DailyMajor-nf4.png');
    });

    Jimp.read('ge4DailyMajor/ge4DailyMajorbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 2060, 1400, 870)
            .quality(100)
            .write('ge4DailyMajor/ge4DailyMajor-ge4.png');
    });

    Jimp.read('ge4DailyMajor/ge4DailyMajorbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 2230, 1400, 320)
            .quality(100)
            .write('ge4DailyMajor/ge4DailyMajor-hana_ha4.png');
    });


    return true;
}

async function ge4UnixServerDetails(page) {
    await page.goto(URL_GRAFANA + '/d/kmQ8GRDZk/unix-server-details?orgId=1');
    await page.setViewport({ width: 1466, height: 4100 });
    await page.waitFor(2000)
    await page.evaluate(() => {
        while (document.querySelectorAll('[class="fa fa-chevron-right"]').length > 0) {
            document.querySelectorAll('[class="fa fa-chevron-right"]')[0].click()
        }
        return "foi"
    })
    await page.waitFor(30000)
    await page.screenshot({ path: 'ge4UnixServerDetails/ge4UnixServerDetailsbruto.png' });

    Jimp.read('ge4UnixServerDetails/ge4UnixServerDetailsbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 70, 1400, 570)
            .quality(100)
            .write('ge4UnixServerDetails/ge4UnixServerDetails-diskio.png');
    });

    Jimp.read('ge4UnixServerDetails/ge4UnixServerDetailsbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 650, 1400, 570)
            .quality(100)
            .write('ge4UnixServerDetails/ge4UnixServerDetails-filesystem.png');
    });

    Jimp.read('ge4UnixServerDetails/ge4UnixServerDetailsbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 1150, 1400, 1000)
            .quality(100)
            .write('ge4UnixServerDetails/ge4UnixServerDetails-utilization.png');
    });

    return true;
}

async function ge4NetworkStatus(page) {
    await page.goto(URL_GRAFANA + '/d/TpEpfrFZz/network-status?orgId=1');
    await page.setViewport({ width: 1466, height: 4100 });
    await page.waitFor(2000)
    await page.evaluate(() => {
        while (document.querySelectorAll('[class="fa fa-chevron-right"]').length > 0) {
            document.querySelectorAll('[class="fa fa-chevron-right"]')[0].click()
        }
        return "foi"
    })
    await page.waitFor(30000)
    await page.screenshot({ path: 'ge4NetworkStatus/ge4NetworkStatusbruto.png' });

    Jimp.read('ge4NetworkStatus/ge4NetworkStatusbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 70, 1400, 770)
            .quality(100)
            .write('ge4NetworkStatus/ge4NetworkStatus-tunnelstatus.png');
    });

    Jimp.read('ge4NetworkStatus/ge4NetworkStatusbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 830, 1400, 270)
            .quality(100)
            .write('ge4NetworkStatus/ge4NetworkStatus-fromIBMCloudSAO01.png');
    });

    Jimp.read('ge4NetworkStatus/ge4NetworkStatusbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 1080, 1400, 270)
            .quality(100)
            .write('ge4NetworkStatus/ge4NetworkStatus-fromIBMCloudWDC04.png');
    });

    Jimp.read('ge4NetworkStatus/ge4NetworkStatusbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 1320, 1400, 460)
            .quality(100)
            .write('ge4NetworkStatus/ge4NetworkStatus-hortorouters.png');
    });

    Jimp.read('ge4NetworkStatus/ge4NetworkStatusbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 1760, 1400, 380)
            .quality(100)
            .write('ge4NetworkStatus/ge4NetworkStatus-twslatency.png');
    });


    Jimp.read('ge4NetworkStatus/ge4NetworkStatusbruto.png', (err, lenna) => {
        if (err) throw err;
        lenna
            .crop(70, 2100, 1400, 270)
            .quality(100)
            .write('ge4NetworkStatus/ge4NetworkStatus-tsmlatency.png');
    });

    return true;
}


main();