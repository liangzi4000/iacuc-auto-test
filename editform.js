const puppeteer = require('puppeteer');
const fs = require('fs');
const common = require('./common');
const data = require('./createform.data');

const ishare = require('./workflow/ishare');
const studySubmission = require('./workflow/study-submission');
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
        //slowMo: 120
    });
    const formurl = 'http://localhost:10000/IACUC/WorkSpace/Index?formfk=ed50054a-7efe-4cf6-a2eb-8b3e94b5967d';
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 662 });
    const helper = new common.helper(page);

    // Open login page
    await ishare.openLandingPage(helper, data);
    // Login
    await ishare.login(helper, data.Delegate);

    // Open existing form to edit
    await page.goto(formurl, { waitUntil: 'networkidle', networkIdleTimeout: 3000 });
    // Close the warning popup window
    //await helper.clickOn('#modal_warming > div > div > div.modal-footer > button.btn.btn-primary');

    //sectionJ.execute(helper, data);
    //studySubmission.submitForVetChecklist(helper, data);
    await studySubmission.printForm(helper, data);
    await studySubmission.exportToPdf(helper, data);
    return;
    await ishare.logout(helper, data);

    await ishare.login(helper, data.Vet);
    await page.goto(formurl, { waitUntil: 'networkidle' });
    await helper.delay(130);

    //return new Promise.resolve(resolve => { setTimeout(() => { }, 130000) })

    await studySubmission.ReturnVetChecklist(helper, data);

    /* 
    const chklist = await page.$$('input[type="checkbox"]');
    console.log(chklist.length);
    for (let i = 0; i < chklist.length; i++){
        chklist[i].click(); //
    }
 */
})()