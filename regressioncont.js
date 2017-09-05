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
    const formid = 'ac915032-993d-4391-8f0b-9dd375e3f683';
    const formurl = `http://localhost:10000/IACUC/WorkSpace/Index?formfk=${formid}`;
    const page = await browser.newPage();
    await page.setViewport({ width: data.Environment.resolution.width, height: data.Environment.resolution.height });
    const helper = new common.helper(page);

    // Open login page
    await ishare.openLandingPage(helper, data);
    // Login
    await ishare.login(helper, data.Secretariat);

    await studyReview.secAppTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.sendPreliminaryMsgToPI(helper, data);

    await ishare.logout(helper, data);
    await ishare.openLandingPage(helper, data);


    await ishare.login(helper, data.PI);
    await studySubmission.openMyTaskIACUCList(helper, formid);
    await studySubmission.replyIACUCQuery(helper, data);


})()