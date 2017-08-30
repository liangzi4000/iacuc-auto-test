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
    const formid = '03cc3c14-cced-4f37-8a18-17c95bbc79e9';
    const formurl = `http://localhost:10000/IACUC/WorkSpace/Index?formfk=${formid}`;
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
    await studySubmission.exportToPdf(helper, browser);
    
    await ishare.logout(helper, data);
    
    // Vet Login
    await studySubmission.resetConnection(helper, formid);
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Vet);
    await studySubmission.openVetChecklistTask(helper, formid);
    //await helper.delay(130);
    await studySubmission.returnVetChecklist(helper, data);
    await ishare.logout(helper, data);
    

    // PI declaration and submission
    await studySubmission.resetConnection(helper, formid);
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    await studySubmission.openMyTaskIACUCList(helper, formid);
    await studySubmission.declareAndSubmitToIACUC(helper, data);

})()