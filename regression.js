const puppeteer = require('puppeteer');
const fs = require('fs');
const common = require('./common');
const data = require('./regression.data');

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
console.time('total');
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
    await page.setViewport({ width: data.Environment.resolution.width, height: data.Environment.resolution.height });
    const helper = new common.helper(page);


    console.time('createform');
    // Open login page
    await ishare.openLandingPage(helper, data);
    // Login
    await ishare.login(helper, data.Delegate);
    // Create IACUC form
    await studySubmission.createApplicationForm(helper, data);
    // Close the warning popup window
    await studySubmission.closeSaveFormWarning(helper, data);
    // Fill up form
    await sectionDeclaration.execute(helper, data);
    await sectionStudyFund.execute(helper, data);
    await sectionA.execute(helper, data);
    await studySubmission.closeSaveFormWarning(helper, data);
    const re = /formfk=([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})&startat=SectionA/i;
    const formid = helper.page.url().match(re)[1];

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
    await studySubmission.finalize(helper, data);
    console.timeEnd('createform');
    console.time('submitforvetchecklist');
    await studySubmission.submitForVetChecklist(helper, data);
    await studySubmission.printForm(helper, data);
    //await studySubmission.exportToPdf(helper, browser);
    await ishare.logout(helper, data);

    // Vet Login
    await studySubmission.resetConnection(helper, formid);
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Vet);
    await studySubmission.openVetChecklistTask(helper, formid);
    //await helper.delay(130);
    await studySubmission.returnVetChecklist(helper, data);
    await ishare.logout(helper, data);
    console.timeEnd('submitforvetchecklist');

    // PI declaration and submission
    await studySubmission.resetConnection(helper, formid);
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    await studySubmission.openMyTaskIACUCList(helper, formid);
    await studySubmission.declareAndSubmitToIACUC(helper, data);
    console.timeEnd('total');
    console.log('Completed');
    //browser.close();
})();
