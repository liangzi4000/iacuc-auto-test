module.exports = {
    createApplicationForm: async function (helper, data) {
        await helper.clickOn('#ContentPlaceHolder1_aIACUCCreation');
        await helper.clickOn('#Scn_SelectIACUCForm div.tinybox.tinybox_iacuc');
        await helper.waitForNavigation('networkidle');
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

    openVetChecklistTask: async function (helper, formid) {
        await helper.clickOn('#IACUC_VetChecklist a');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("PendingVetChecklistTask.png");
        await helper.clickOn(`a[href="/IACUC/WorkSpace/Index?formFk=${formid}"]`);
        await helper.waitForNavigation('networkidle');
    },

    openMyTaskIACUCList: async function (helper, formid) {
        await helper.clickOn('#ContentPlaceHolder1_Div_MyStudy a');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('#ContentPlaceHolder1_MyTask_IACUC a');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("PIMyTaskList.png");
        await helper.clickOn(`a[href="/IACUC/WorkSpace/Index?formFk=${formid}"]`);
        await helper.waitForNavigation('networkidle');
    },

    declareAndSubmitToIACUC: async function(helper, data){
        await helper.clickOn('i.fa.IACUCPIDeclaration');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('#modal_RemindDeclaration button.btn.btn-green');
        await helper.clickOn('#SectionDefault button.btn.btn-green[style="width:160px"]');
        await helper.type('#SetSignPIDeclaration_Password',data.PI.password);
        await helper.clickOn('#modal_SetSignPIDeclaration button.btn.btn-green[btn="confirm"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("PIDeclareAndSubmit.png");
    },

    submitForVetChecklist: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCSFVetChecklistIcon');
        await helper.clickOn(`input[value="${data.Vet.profile.id}"]`);
        await helper.screenshot("SubmitForVetChecklist_popup.png");
        await helper.clickOn('#stm_confirm');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SubmitForVetChecklist.png");
    },

    printForm: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCPrintIcon');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("PrintForm.png");
    },

    exportToPdf: async function (helper, data) {
        helper.setFrame(x => x.url().includes('/IACUC/PrintPage/ApplicationForm?id='));
        await helper.iframeClickOn('#print-toolbar span.print-toolbar-6.print-toolbar-img');
        await helper.iframeClickOn('div.show-pdf-button a.show-pdf-link.showPDF');
        try { await helper.waitForNavigation('networkidle') } catch (err) { }
        await helper.screenshot("ExportToPDF.png"); // How to let chrome to open the downloaded PDF?
    },

    ReturnVetChecklist: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCFillUpVetChecklistIcon');
        await helper.clickOn('a.btn.btn-green');
        await helper.type('textarea[name="VetChecklist.AdditionalComments"]', 'Additional Comments - test');
        await helper.screenshot("ReturnVetChecklist_popup.png");
        await helper.clickOn('button.btn.btn-green[action="SendChecklist"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("ReturnVetChecklist.png");
    }
}