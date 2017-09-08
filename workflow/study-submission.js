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

    replyIACUCQuery: async function (helper, query) {
        // Click on PI Mailbox icon
        await helper.clickOn('i.fa.IACUCPIOrSecMailboxIcon');
        // Wait for PI Mailbox page loading
        let contentSelector = 'li > a.Tabhandover-title-active';
        const ifrmSelector = '#pimailbox_iframe';
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        await helper.screenshot("MessageFromSecretariat.png");
        helper.setFrame(x => x.url().includes('/IACUC/Comment/PIMailBox?formFK='));
        // Click on secretariat message
        await helper.frame.evaluate((query) => {
            const list = document.querySelectorAll('td > a');
            list.forEach((elem) => {
                if (elem.text == query.subject) {
                    elem.click();
                }
            });
        }, query);
        // Wait for message detail page loading
        contentSelector = 'div.PIReplyMessage';
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        // Reply all queries
        await helper.frame.evaluate((query) => {
            const ReviewerCommentsSelector = 'div.ReviewerComments';
            const list = document.querySelectorAll(ReviewerCommentsSelector);
            list.forEach((div, index) => {
                if (document.querySelector(`${ReviewerCommentsSelector}:nth-child(${index}) i.fa.fa-chevron-right`)) {
                    document.querySelector(`${ReviewerCommentsSelector}:nth-child(${index}) div.ReviewerComments-title`).click();
                }
                const id = `Items_${index}__ReplyItem_Reply`;
                document.querySelector(`#${id}`).scrollIntoView();
                uectrl = UE.getEditor(id);
                uectrl.ready(() => {
                    uectrl.setContent(`${query.answer} ${index}`);
                });
            });
        }, query);
        // Click on save button
        helper.iframeClickOn('i.fa.IACUCSaveIcon');
        // Wait for page postback.
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        // Click on send message button
        helper.iframeClickOn('i.fa.IACUCReplayMsgToSecIcon');
        // Wait for send success message
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        await helper.screenshot("ReplyPreliminaryCheckMessage.png");
        // Close PI Mailbox
        await helper.clickOn('#modal_PIMailbox button.close');
        // Wait for postback
        await helper.waitForNavigation('networkidle');
    },

    unlockForm: async function (helper, data) {
        // Click on unlock icon
        await helper.clickOn('i.fa.IACUCUnlockIcon');
        await helper.clickOn('#modal_Unlock button[btn="confirm"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("UnlockForm.png");
    },

    editForm: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_b"]');
        await helper.setRichTextBox('#Form_SB1', data.formchange.sectionB);
        await helper.screenshot("EditSectionB.png");
        await helper.gotoSection('a.list-group-item[key="section_c"]');
        await helper.setRichTextBox('#Form_SC1', data.formchange.sectionC);
        await helper.screenshot("EditSectionC.png");
        await helper.gotoSection('a.list-group-item[key="section_d"]');
        await helper.clickOn('input[name="Form.SD2"][value="True"]');
        await helper.typeTextarea('#Form_SD2_Y_1', data.formchange.sectionD);
        await helper.screenshot("EditSectionD.png");
    },

    submitToIACUC: async function (helper, data) {
        // Click on submit to iacuc icon
        // await helper.clickOn('i.fa.IACUCPISubAppIcon'); why this code not working?
        await helper.page.waitForFunction(() => {
            if(document.querySelector('a[onclick="iacucws.submissionForm();"]')){
                window.iacucws.submissionForm();
                return true;
            }
        });
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SubmitToIACUC.png");
    },

    getisharerefno: async function(helper, data){
        await helper.page.evaluate(()=>{
            return document.querySelectorAll('#Study div.well-sm:nth-child(1) b')[1].textContent;
        })
    }
}