const puppeteer = require('puppeteer');
const fs = require('fs');
const common = require('./common');
const data = require('./regression.data');

const ishare = require('./workflow/ishare');
const studySubmission = require('./workflow/study-submission');
const studyReview = require('./workflow/study-review');
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
    const formid = '6435bd4b-59fe-4a28-9a6d-94b9f65bb5b0';
    // http://localhost:10000/IACUC/ReviewWorkSpace/Index?formId=ac915032-993d-4391-8f0b-9dd375e3f683
    // http://localhost:10000/IACUC/WorkSpace/Index?formfk=
    //const formurl = `http://localhost:10000/IACUC/ReviewWorkSpace/Index?formId=${formid}`;
    const formurl = 'http://localhost:10000/IACUC/ReviewWorkSpace/MeetingDetail?MeetingDetailId=7351e56f-d1cd-477d-ae78-71d91a198216&isPartial=false';
    const page = await browser.newPage();
    await page.setViewport({ width: data.Environment.resolution.width, height: data.Environment.resolution.height });
    const helper = new common.helper(page);

    // Secretariat login to approve the application
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Chairman);
    await studyReview.gotoChairmanSignaturePage(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.signDecisionLetter(helper, formid);
    await ishare.logout(helper, data);

    console.log('Done');
})()