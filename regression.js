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

    const formid = helper.page.url().match(re)[1];
    console.log('Application form id: ' + formid);
    const isharerefno = await studySubmission.getisharerefno(helper, data);
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
    await studySubmission.finalize(helper, data);
    await studySubmission.submitForVetChecklist(helper, data);
    await studySubmission.printForm(helper, data);
    //await studySubmission.exportToPdf(helper, browser);
    await ishare.logout(helper, data);

    // Vet Login
    await studySubmission.resetConnection(helper, data, formid);
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Vet);
    await studySubmission.vetChecklistTaskList(helper, formid);
    //await helper.delay(130);
    await studySubmission.returnVetChecklist(helper, data);
    await ishare.logout(helper, data);

    await studySubmission.resetConnection(helper, data, formid);
    // PI declaration and submission
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    await studySubmission.piMyTaskIACUCList(helper, formid);
    await studySubmission.declareAndSubmitToIACUC(helper, data);
    await ishare.logout(helper, data);

    // Secretariat login to send preliminary check message
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.secAppTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.sendPreliminaryMsgToPI(helper, data);
    await ishare.logout(helper, data);

    // PI Login to reply preliminary check message
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.PI);
    await studySubmission.piMyTaskIACUCList(helper, formid);
    await studySubmission.replyIACUCQuery(helper, data.PreliminaryCheck);
    await studySubmission.unlockForm(helper, data);
    await studySubmission.editForm(helper, data.PreliminaryCheck);
    await studySubmission.finalize(helper, data);
    await studySubmission.submitToIACUC(helper, data);
    await ishare.logout(helper, data);

    // Secretariat login to complete preliminary check
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.secAppTaskList(helper, data);
    await studyReview.openFormInReviewWorkspace(helper, formid);
    await studyReview.completePreliminaryCheck(helper, formid);
    await studyReview.viewTrackChange(helper, data, browser, common);
    await studyReview.assignStudyToMeeting(helper, data);
    await studyReview.gotoMeetingSchedule(helper, data);
    await studyReview.gotoMeetingApplicationList(helper, data);
    await ishare.logout(helper, data);

    // Chairman login to assign PR/SR
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Chairman);
    await studyReview.chrAssignPRSRTaskList(helper, data);
    await studyReview.assignPRSR(helper, data);
    await ishare.logout(helper, data);

    // PR login to comment
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

    // Secretariat login to send out agenda
    await ishare.openLandingPage(helper, data);
    await ishare.login(helper, data.Secretariat);
    await studyReview.gotoMeetingMaterials(helper, data);
    await studyReview.gotoMeetingDecision(helper, data);
    await studyReview.openSecMailbox(helper, data);
    await studyReview.ackReviewerComment(helper, data);
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
    const amdformid = helper.page.url().match(re)[1];
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
