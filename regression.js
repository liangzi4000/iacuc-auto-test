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
            '--aggressive-cache-discard',
            '--disable-cache',
            '--disable-application-cache',
            '--disable-offline-load-stale-cache',
            '--disk-cache-size=0',
        ],
        //slowMo:120
    });
    const page = await browser.newPage();
    await page.setViewport({ width: data.Environment.resolution.width, height: data.Environment.resolution.height });
    const helper = new common.helper(page);
    const re = /formfk=([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i; // Regex to get application/amendment form id
    let formid = '50133cde-323c-4879-9746-905ae9c3f2c0';
    let isharerefno = '201803-00001';
    let amdformid = '431e544b-9953-4246-a0c5-0bd716d38010';
    
    console.log('Open login page');
    await ishare.openLandingPage(helper, data);
    console.log('Login as Delegate');
    await ishare.login(helper, data.Delegate);
    console.log('Create IACUC form');
    await studySubmission.createApplicationForm(helper, data);
    console.log('Close the warning popup window');
    await studySubmission.closeSaveFormWarning(helper, data);
    console.log('Begin to fill up form');
    await sectionDeclaration.execute(helper, data);
    await sectionStudyFund.execute(helper, data);
    await sectionA.execute(helper, data);
    await studySubmission.closeSaveFormWarning(helper, data);

    formid = helper.page.url().match(re)[1];
    console.log('Application form id: ' + formid);
    isharerefno = await studySubmission.getisharerefno(helper, data);
    console.log('ishare ref no: ' + isharerefno);

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
    console.log('Finalize form');
    await studySubmission.finalize(helper, data);
    console.log('Submit form to Vet');
    await studySubmission.submitForVetChecklist(helper, data);
    console.log('Print form');
    await studySubmission.printForm(helper, data);
    //await studySubmission.exportToPdf(helper, browser);

    console.log('Logout');
    await ishare.logout(helper, data);

    console.log('Login as Vet');
    await studySubmission.resetConnection(helper, data, formid);
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Vet);
    console.log('Open vet checklist task');
    await studySubmission.vetChecklistTaskList(helper, formid);
    //await helper.delay(130);
    console.log('Fill up vet checklist and return to PI');
    await studySubmission.returnVetChecklist(helper, data);
    console.log('Logout');
    await ishare.logout(helper, data);

    console.log('Login as PI');
    await studySubmission.resetConnection(helper, data, formid);
    // PI declaration and submission
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    console.log('Open PI My task list');
    await studySubmission.piMyTaskIACUCList(helper, formid);
    console.log('PI declare and submit form to IACUC');
    await studySubmission.declareAndSubmitToIACUC(helper, data);
    console.log('Logout');
    await ishare.logout(helper, data);

    console.log('Secretariat login to send preliminary check message');
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    console.log('Open IACUC new application list');
    await studyReview.secAppTaskList(helper, data);
    console.log('Open IACUC form in review workspace');
    await studyReview.openFormInReviewWorkspace(helper, formid);
    console.log('Send preliminary message to PI');
    await studyReview.sendPreliminaryMsgToPI(helper, data);
    console.log('Logout');
    await ishare.logout(helper, data);

    console.log('PI Login to reply preliminary check message');
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    console.log('Open PI My task list');
    await studySubmission.piMyTaskIACUCList(helper, formid);
    console.log('Reply IACUC query');
    await studySubmission.replyIACUCQuery(helper, data.PreliminaryCheck);
    console.log('Unlock form');
    await studySubmission.unlockForm(helper, data);
    console.log('Edit form');
    await studySubmission.editForm(helper, data.PreliminaryCheck);
    console.log('Finallize form');
    await studySubmission.finalize(helper, data);
    console.log('Submit form to IACUC');
    await studySubmission.submitToIACUC(helper, data);
    console.log('Logout');
    await ishare.logout(helper, data);

    console.log('Secretariat login to complete preliminary check');
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    console.log('Open IACUC new application list');
    await studyReview.secAppTaskList(helper, data);
    console.log('Open IACUC form in review workspace');
    await studyReview.openFormInReviewWorkspace(helper, formid);
    console.log('Complete preliminary check');
    await studyReview.completePreliminaryCheck(helper, formid);
    console.log('Open track change');
    await studyReview.viewTrackChange(helper, data, browser, common);
    console.log('Assign application to meeting');
    await studyReview.assignStudyToMeeting(helper, data);
    console.log('Open meeting and setup meeting schedule');
    await studyReview.gotoMeetingSchedule(helper, data);
    console.log('Notify chairman to assign PR/SR');
    await studyReview.gotoMeetingApplicationList(helper, data);
    console.log('Logout');
    await ishare.logout(helper, data);

    console.log('Chairman login to assign PR/SR');
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Chairman);
    console.log('Click on Chairman assign PR/SR tile');
    await studyReview.chrAssignPRSRTaskList(helper, data);
    console.log('Assign PR/SR');
    await studyReview.assignPRSR(helper, data);
    console.log('Logout');
    await ishare.logout(helper, data);

    console.log('PR login to comment');
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PR);
    
    await studyReview.rverPendingCommitteeReviewTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.comment(helper, data.PR.comment);
    await ishare.logout(helper, data);

    // SR login to comment
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.SR);
    await studyReview.rverPendingCommitteeReviewTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.comment(helper, data.SR.comment);
    await ishare.logout(helper, data);

    // Other review login to comment
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.OtherReviewer);
    await studyReview.rverPendingCommitteeReviewTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.comment(helper, data.OtherReviewer.comment);
    await ishare.logout(helper, data);

    // Secretariat login to send out agenda and send comment to PI
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.gotoMeetingMaterials(helper, data);
    await studyReview.gotoMeetingDecision(helper, data);
    await helper.page.goto(`${data.Environment.host}/IACUC/ReviewWorkspace/MeetingDetail?MeetingDetailId=${data.Meeting.id}&ispartial=false`);
    await helper.clickOn('a[onclick*="/IACUC/ReviewWorkspace/Decision"]');
    await helper.waitForNavigation('networkidle');

    await studyReview.openSecMailbox(helper, data);
    //await studyReview.ackReviewerComment(helper, data);
    await studyReview.sendReviewerCommentToPI(helper, data);
    await ishare.logout(helper, data);

    // PI login to answer all queries
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    await studySubmission.piMyTaskIACUCList(helper, formid);
    await studySubmission.replyIACUCQuery(helper, data.ReviewerComment);
    await studySubmission.unlockForm(helper, data);
    await studySubmission.editForm(helper, data.ReviewerComment);
    await studySubmission.finalize(helper, data);
    await studySubmission.submitToIACUC(helper, data);
    await ishare.logout(helper, data);

    // Secretariat login to approve the application
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.gotoNewAppPendingCommitteeReviewList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.viewTrackChange(helper, data, browser, common);
    await studyReview.updateReviewStatusToApprove(helper, data);
    await studyReview.prepareDecisionLetter(helper, data);
    await ishare.logout(helper, data);

    // Chairman login to send decision letter
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Chairman);
    await studyReview.chrSignatureTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.signDecisionLetter(helper, formid);
    await ishare.logout(helper, data);

    // PI login to create a amendment form
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    await studySubmission.gotoStudyWorkspace(helper, isharerefno);
    await studySubmission.createAmendmendForm(helper, isharerefno);
    amdformid = helper.page.url().match(re)[1];
    console.log(`Amendment form id: ${amdformid}`);
    await studySubmission.closeSaveFormWarning(helper, data);
    await studySubmission.fillAmendmentForm(helper, data);
    await studySubmission.finalize(helper, data);
    await studySubmission.submitToIACUC(helper, data);
    await ishare.logout(helper, data);

    // Secretariat login to approve the amendment
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.secAmdTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, amdformid);
    await studyReview.viewTrackChange(helper, data, browser, common);
    await studyReview.setAmendmentCategory(helper, 'Minor');
    await studyReview.updateReviewStatus(helper, data.ReviewStatus.Amd.PendingSecretariatReview);
    await studyReview.updateReviewStatus(helper, data.ReviewStatus.Amd.Approve);
    await ishare.logout(helper, data);

    // PI login to create an annual project update form
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    await studySubmission.gotoStudyWorkspace(helper, isharerefno);
    await studySubmission.createAnnualProjectUpdate(helper, data);
    await studySubmission.fillAnnualProjectUpdate(helper, data);
    await studySubmission.finalize(helper, data);
    const apuformid = helper.page.url().match(re)[1];
    console.log(`Annual Project Update form id: ${apuformid}`);
    await studySubmission.submitToIACUC(helper, data, false);
    await ishare.logout(helper, data);

    // Secretariat login to acknowledge the annual project update
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.secRptTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, apuformid);
    await studyReview.ackAnnualProjectUpdate(helper, data.ReviewStatus.Apu.Acknowledge);
    await ishare.logout(helper, data);

    // PI login to create a final project report form
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    await studySubmission.gotoStudyWorkspace(helper, isharerefno);
    await studySubmission.createFinalProjectReport(helper, data);
    await studySubmission.fillFinalProjectReport(helper, data);
    await studySubmission.finalize(helper, data);
    const fprformid = helper.page.url().match(re)[1];
    console.log(`Final Project Report form id: ${fprformid}`);
    await studySubmission.submitToIACUC(helper, data, false);
    await ishare.logout(helper, data);

    // Secretariat login to acknowledge the final project report
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.secRptTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, fprformid);
    await studyReview.ackFinalProjectReport(helper, data.ReviewStatus.Fpr.Acknowledge);
    await ishare.logout(helper, data);

    // Secretariat set study status to complete
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.gotoAllStudies(helper, data);
    await studyReview.openReviewFolderFromAllStudies(helper, isharerefno);
    await studyReview.setStudyStatus(helper, data.ReviewStatus.Stu.Complete);
    await ishare.logout(helper, data);

    console.timeEnd('total');
    //browser.close();
})();
