module.exports = {
    resetConnection: async function (helper, data, formid) {
        await helper.page.goto(`${data.Environment.helperhost}?formid=${formid}`, { waitUntil: 'networkidle' });
    },

    createApplicationForm: async function (helper, data) {
        await helper.clickOn('#ContentPlaceHolder1_aIACUCCreation');
        await helper.clickOn('#Scn_SelectIACUCForm div.tinybox.tinybox_iacuc');
        await helper.waitForNavigation();
        await helper.screenshot("CreateApplicationForm.png");
    },

    finalize: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCFinalizeIcon');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("Finalize.png");
    },

    closeSaveFormWarning: async function (helper, data) {
        await helper.clickOn('#modal_warming > div > div > div.modal-footer > button.btn.btn-primary');
    },

    submitForVetChecklist: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCSFVetChecklistIcon');
        await helper.clickOn(`input[value="${data.Vet.profile.vetid}"]`);
        await helper.screenshot("SubmitForVetChecklist_popup.png");
        await helper.clickOn('#stm_confirm');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SubmitForVetChecklist.png");
    },

    printForm: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCPrintIcon');
        await helper.waitForiFrameRendered('#printArea iframe', 'div.formTitle');
        await helper.screenshot("PrintForm.png");
    },

    exportToPdf: async function (helper, browser) {
        helper.setFrame(x => x.url().includes('/IACUC/PrintPage/ApplicationForm?id='));
        const elemhref = await helper.getAttr('div.show-pdf-button a.show-pdf-link.showPDF', 'href', helper.frame);
        const targeturl = helper.currentHost() + elemhref;
        const downloadpage = await browser.newPage();
        await downloadpage.goto(targeturl);
        downloadpage.close();
    },

    getisharerefno: async function (helper, data) {
        return await helper.page.evaluate(() => {
            return document.querySelectorAll('#Study div.well-sm:nth-child(1) b')[1].textContent;
        });
    },

    gotoStudyWorkspace: async function (helper, isharerefno) {
        await helper.clickOn('a[href="/MyStudy.aspx"]');
        await helper.waitForNavigation();
        await helper.clickOn('a[href="/IACUC/PIReview/PIStudies"]', true);
        await helper.waitForNavigation();
        await helper.type('#Filter_iSHaReRefNo', isharerefno);
        await helper.clickOn('#btnSearch');
        await helper.waitForNavigation();
        await helper.clickOn('a[href*="/IACUC/WorkSpace/Study?studyid="]');
        await helper.waitForNavigation();
        await helper.screenshot("OpenStudyWorkspace.png");
    },

    openFormInStudyWorkspace: async function (helper, formid) {
        await helper.clickOn(`a[href="/IACUC/WorkSpace/Index?formFk=${formid}"]`);
        await helper.waitForNavigation();
    }
}