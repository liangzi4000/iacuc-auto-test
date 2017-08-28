console.time('createform');
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

    // Create IACUC form
    await helper.clickOn('#ContentPlaceHolder1_aIACUCCreation');
    await helper.clickOn('#Scn_SelectIACUCForm div.tinybox.tinybox_iacuc');
    await helper.waitForNavigation('networkidle');
    await helper.screenshot("CreateApplicationForm.png");

    // Close the warning popup window
    await helper.clickOn('#modal_warming > div > div > div.modal-footer > button.btn.btn-primary');

    await sectionDeclaration.execute(helper, data);
    await sectionStudyFund.execute(helper, data);
    await sectionA.execute(helper, data);
    await helper.clickOn('#modal_warming > div > div > div.modal-footer > button.btn.btn-primary');
    await sectionB.execute(helper, data);
    await sectionC.execute(helper, data);
    await sectionD.execute(helper, data);
    await sectionE.execute(helper, data);
    await sectionF.execute(helper, data);
    await sectionG.execute(helper, data);
    await sectionH.execute(helper, data);
    await sectionI.execute(helper, data);
    await sectionJ.execute(helper, data);
    await sectionK.execute(helper, data);
    await sectionL.execute(helper, data);
    await sectionM.execute(helper, data);
    await sectionN.execute(helper, data);
    await sectionO.execute(helper, data);
    await sectionP.execute(helper, data);
    console.timeEnd('createform');
    //browser.close();
})();
