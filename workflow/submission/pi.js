module.exports = {
    piMyTaskIACUCList: async function (helper, formid) {
        await helper.clickOn('#ContentPlaceHolder1_Div_MyStudy a');
        await helper.waitForNavigation();
        await helper.clickOn('#ContentPlaceHolder1_MyTask_IACUC a');
        await helper.waitForNavigation();
        await helper.screenshot("PIMyTaskList.png");
        await this.openFormInStudyWorkspace(helper, formid);
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

    submitToIACUC: async function (helper, data, js = true) {
        // Click on submit to iacuc icon
        if (!js) {
            await helper.clickOn('i.fa.IACUCPISubAppIcon'); // why this code not working?
        } else {
            await helper.page.waitForFunction(() => {
                if (document.querySelector('a[onclick="iacucws.submissionForm();"]')) {
                    window.iacucws.submissionForm();
                    return true;
                }
            });
        }
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SubmitToIACUC.png");
    },

    createAmendmendForm: async function (helper, data) {
        await helper.clickOn('a[href*="action=amendment"]');
        await helper.waitForNavigation();
        await helper.screenshot("CreateAmendmentForm.png");
    },

    createAnnualProjectUpdate: async function (helper, data) {
        await helper.clickOn('a[href*="AnnualProjectIndex?action=create"]');
        await helper.waitForNavigation();
        await helper.screenshot("CreateAnnualProjectUpdate.png");
    },

    createFinalProjectReport: async function (helper, data) {
        await helper.clickOn('a[href*="FinalProjectIndex?action=create"]');
        await helper.waitForNavigation();
        await helper.screenshot("CreateFinalProjectReport.png");
    },

    fillAmendmentForm: async function (helper, data) {
        // Edit Section A
        await helper.gotoSection('a.list-group-item[key="section_a"]');
        await helper.clickOn('input[name="Form.SA1_3_IsExt"][value="True"]');
        await helper.setSelectIndex('#Form_SA1_3_Ext1', 2);
        await helper.type('#Form_SA1_3_Comment', 'Please state reason for extension - test, request for one year extension.');
        await helper.screenshot("EditSectionA.png");

        // Edit Section D
        await helper.gotoSection('a.list-group-item[key="section_d"]');
        await helper.clickOn('i.fa.fa-pencil.fanomargin');
        await helper.type('#species_form > div > div:nth-child(8) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[0].toString(), true);
        if (data.YearAndNumber.year > 1) {
            await helper.type('#species_form > div > div:nth-child(9) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[1].toString(), true);
        }
        if (data.YearAndNumber.year > 2) {
            await helper.type('#species_form > div > div:nth-child(10) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[2].toString(), true);
        }
        await helper.clickOn('#SpeciesSave');
        await helper.screenshot("EditSectionD.png");

        // Edit Section K
        await helper.gotoSection('a.list-group-item[key="section_k"]');
        await helper.clickOn('i.fa.fa-pencil.fanomargin');
        await helper.type('#Year1', data.YearAndNumber.amdnumber[0].toString(), true);
        if (data.YearAndNumber.year > 1) {
            await helper.type('#Year2', data.YearAndNumber.amdnumber[1].toString(), true);
        }
        if (data.YearAndNumber.year > 2) {
            await helper.type('#Year3', data.YearAndNumber.amdnumber[2].toString(), true);
        }
        await helper.clickOn('input.btn.btn-green.noprint[value="Ok"]');
        await helper.screenshot("EditSectionK.png");

        // Edit PI Amendment Summary
        await helper.gotoSection('a.list-group-item[key="section_r"]');
        await helper.type('#Form_SR1', 'PI Input - test: Section A, D, E edited.');
        await helper.screenshot("EditPIAmendmentSummary.png");
    },

    fillAnnualProjectUpdate: async function (helper, data) {
        await helper.clickOn('input[name="AP1"][value="True"]');
        await helper.clickOn('input[name="AP1_1"][value="True"]');
        await helper.clickOn('#ReportSpeciesList_JsonTable i.fa.fa-pencil');
        await helper.page.focus('#btnAddOrEditAnimal'); // Default focus to Add button
        await helper.type('#modal_animalsModal div.modal-body.clearfix > div.form-group:nth-child(2) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[0].toString());
        if (data.YearAndNumber.year > 1) {
            await helper.type('#modal_animalsModal div.modal-body.clearfix > div.form-group:nth-child(3) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[1].toString());            
        }
        if (data.YearAndNumber.year > 2) {
            await helper.type('#modal_animalsModal div.modal-body.clearfix > div.form-group:nth-child(4) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[2].toString());
        }
        await helper.clickOn('#btnAddOrEditAnimal');
        await helper.clickOn('input[name="AP3"][value="False"]');
        await helper.type('#AP4', 'List all publications, scientific presentations, press releases and IPs arising from the project since last report - test');
        await helper.clickOn('input[name="AP6"][value="False"]');
        await helper.type('#AP7', 'Give a brief summary of the results and conclusions since the last update - test');
        await helper.screenshot("FillAnnualProjectUpdate.png");
    },

    fillFinalProjectReport: async function (helper, data) {
        await helper.clickOn('input[name="FinalProject.FP2"][value="True"]');
        await helper.clickOn('input[name="FinalProject.FP2_1"][value="False"]');
        await helper.clickOn('#FinalProjectReportSpecies_JsonTable i.fa.fa-pencil');
        await helper.page.focus('#btnAddOrEditAnimal'); // Default focus to Add button
        await helper.type('#modal_animalsModal div.modal-body.clearfix > div.form-group:nth-child(2) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[0].toString());
        if (data.YearAndNumber.year > 1) {
            await helper.type('#modal_animalsModal div.modal-body.clearfix > div.form-group:nth-child(3) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[1].toString());            
        }
        if (data.YearAndNumber.year > 2) {
            await helper.type('#modal_animalsModal div.modal-body.clearfix > div.form-group:nth-child(4) input.k-input.k-formatted-value', data.YearAndNumber.amdnumber[2].toString());
        }
        await helper.clickOn('#btnAddOrEditAnimal');
        await helper.type('#FinalProject_FP3', 'Please explain if total number of animals used exceeds the total approved animals - test');
        await helper.clickOn('input[name="FinalProject.FP4"][value="False"]');
        await helper.type('#FinalProject_FP5', 'List all publications, scientific presentations, press releases and IPs arising from the project since the last report - test');
        await helper.clickOn('input[name="FinalProject.FP6"][value="False"]');
        await helper.type('#FinalProject_FP7', 'Give a brief summary of the final results and conclusions since the last report - test');
        await helper.screenshot("FillFinalProjectReport.png");
    }
}