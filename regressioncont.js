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
    const formid = 'a5383a3e-ae4a-47fd-92cd-ec44c4f4f884';
    const isharerefno = '201710-00001';
    // http://localhost:10000/IACUC/ReviewWorkSpace/Index?formId=ac915032-993d-4391-8f0b-9dd375e3f683
    // http://localhost:10000/IACUC/WorkSpace/Index?formfk=
    //const formurl = `http://localhost:10000/IACUC/ReviewWorkSpace/Index?formId=${formid}`;
    const formurl = 'http://localhost:10000/IACUC/WorkSpace/Index?formfk=b8bc7029-dbd2-46c5-8432-fd332c5d4b2a&action=view';
    const page = await browser.newPage();
    await page.setViewport({ width: data.Environment.resolution.width, height: data.Environment.resolution.height });
    const helper = new common.helper(page);
    const re = /formfk=([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i; // Regex to get application/amendment form id

    // Secretariat set study status to complete
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.gotoAllStudies(helper, data);
    await studyReview.openReviewFolderFromAllStudies(helper, isharerefno);
    await studyReview.setStudyStatus(helper, data.ReviewStatus.Stu.Complete);
    
    console.log('Done');
})()