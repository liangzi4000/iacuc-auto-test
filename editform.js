const puppeteer = require('puppeteer');
const fs = require('fs');
const common = require('./common');
const data = require('./createform.data');

const sectionDeclaration = require('./sections/section-declaration');
const sectionStudyFund = require('./sections/section-studyfund');
const sectionA = require('./sections/section-a');
const sectionB = require('./sections/section-b');
const sectionC = require('./sections/section-c');
const sectionD = require('./sections/section-d');
const sectionE = require('./sections/section-e');
const sectionF = require('./sections/section-f');
const sectionG = require('./sections/section-g');
const sectionH = require('./sections/section-h');
const sectionI = require('./sections/section-i');
const sectionJ = require('./sections/section-j');
const sectionK = require('./sections/section-k');
const sectionL = require('./sections/section-l');
const sectionM = require('./sections/section-m');
const sectionN = require('./sections/section-n');
const sectionO = require('./sections/section-o');
const sectionP = require('./sections/section-p');

common.emptyFolder(fs);

(async () => {
    const browser = await puppeteer.launch({
        headless: false, args: [
            '--start-maximized',
            //'--kiosk',
            //'--start-fullscreen',
            '--no-default-browser-check',
            '--no-first-run',
            '--disable-infobars',
            //'--disable-session-crashed-bubble',
            //'--incognito'
        ],
        //slowMo:120
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 662 });
    const helper = new common.helper(page);

    // How to solve the pop up "restore pages?"

    // Open login page
    await page.goto('http://localhost:10000/loginpage/locallogin.aspx', { waitUntil: 'networkidle' });
    if (page.url().indexOf('Dashboard/DefaultDashboard.aspx')) {
        await page.evaluate(() => {
            page.global.LogOut();
        })
    }

    // Login
    await helper.type('#txtUserID', data.login.loginid);
    await helper.type('#txtPassword', data.login.password);
    await helper.clickOn('#btnLogin');
    await helper.waitForNavigation('networkidle');
    await helper.screenshot("Login.png");

    // Open existing form to edit
    await page.goto('http://localhost:10000/IACUC/WorkSpace/Index?formfk=a6cecf05-dbc0-4576-a23b-ec89c389606b', { waitUntil: 'networkidle' });
    // Close the warning popup window
    await helper.clickOn('#modal_warming > div > div > div.modal-footer > button.btn.btn-primary');
    
    sectionJ.execute(helper,data);

    /* 
    const chklist = await page.$$('input[type="checkbox"]');
    console.log(chklist.length);
    for (let i = 0; i < chklist.length; i++){
        chklist[i].click(); //
    }
 */
})()