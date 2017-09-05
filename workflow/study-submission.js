module.exports = {
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

    openVetChecklistTask: async function (helper, formid) {
        await helper.clickOn('#IACUC_VetChecklist a');
        await helper.waitForNavigation();
        await helper.screenshot("PendingVetChecklistTask.png");
        await helper.clickOn(`a[href="/IACUC/WorkSpace/Index?formFk=${formid}"]`);
        await helper.waitForNavigation();
    },

    openMyTaskIACUCList: async function (helper, formid) {
        await helper.clickOn('#ContentPlaceHolder1_Div_MyStudy a');
        await helper.waitForNavigation();
        await helper.clickOn('#ContentPlaceHolder1_MyTask_IACUC a');
        await helper.waitForNavigation();
        await helper.screenshot("PIMyTaskList.png");
        await helper.clickOn(`a[href="/IACUC/WorkSpace/Index?formFk=${formid}"]`);
        await helper.waitForNavigation();
    },

    declareAndSubmitToIACUC: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCPIDeclaration');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('#modal_RemindDeclaration button.btn.btn-green');
        await helper.clickOn('#SectionDefault button.btn.btn-green[style="width:160px"]');
        await helper.type('#SetSignPIDeclaration_Password', data.PI.password);
        await helper.screenshot("PIDeclareAndSubmit_popup.png");
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

        // How to use promise to wait for page response? Like watchdog
        /*         downloadpage.on('response', response => {
                    console.log(response);
                }); */


        /* await downloadpage.screenshot({ path: './screenshot/' + helper.shotIndex(helper.indexCount++) + 'ExportToPDF.png', fullPage: true });
    
        return;
    
        await helper.iframeClickOn('#print-toolbar span.print-toolbar-6.print-toolbar-img');
        helper.page.on('response', console.log);
        await helper.iframeClickOn('div.show-pdf-button a.show-pdf-link.showPDF');
        try { await helper.waitForNavigation('networkidle') } catch (err) { }
        return;
        await helper.screenshot("ExportToPDF.png"); // How to let chrome to open the downloaded PDF? */
    },

    returnVetChecklist: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCFillUpVetChecklistIcon');
        await helper.clickOn('a.btn.btn-green');
        await helper.type('textarea[name="VetChecklist.AdditionalComments"]', 'Additional Comments - test');
        await helper.screenshot("ReturnVetChecklist_popup.png");
        await helper.clickOn('button.btn.btn-green[action="SendChecklist"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("ReturnVetChecklist.png");
    },

    resetConnection: async function (helper, formid) {
        await helper.page.goto(`${helper.currentHost()}/AutoTest/executesql.aspx?formid=${formid}`, { waitUntil: 'networkidle' });
    },

    replyIACUCQuery: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCPIOrSecMailboxIcon');

        let contentSelector = 'li > a.Tabhandover-title-active';
        const ifrmSelector = '#pimailbox_iframe';
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        await helper.screenshot("MessageFromSecretariat.png");
        helper.setFrame(x => x.url().includes('/IACUC/Comment/PIMailBox?formFK='));
        await helper.frame.evaluate((data) => {
            const list = document.querySelectorAll('td > a');
            list.forEach((elem) => {
                if (elem.text == data.PreliminaryCheck.subject) {
                    elem.click();
                }
            });
        }, data);




        /*         await helper.clickOn('i.fa.IACUCPIOrSecMailboxIcon');
                let contentSelector = 'a[href*="/IACUC/Comment/SecPIRequetList?ReviewItemId="]';
                const ifrmSelector = '#commentIfr';
                await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
                helper.setFrame(x => x.url().includes('/IACUC/Comment/CommentsFromReviewers?ReviewItemID='));
                await helper.iframeClickOn('a[href*="/IACUC/Comment/MessageToPI?ReviewItemID="]');
                await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
                await helper.screenshot("MessageToPI.png");
                await helper.iframeClickOn('a > i.fa.fa-plus-square');
                contentSelector = '#optionalSubject'; */

    }
}