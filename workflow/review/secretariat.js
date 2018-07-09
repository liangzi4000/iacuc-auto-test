module.exports = {
    secAppTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_NewApplication a');
        await helper.waitForNavigation();
        await helper.screenshot("SecretariatApplicationTaskList.png");
    },

    secAmdTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_Amendment a');
        await helper.waitForNavigation();
        await helper.screenshot("SecretariatAmendmentTaskList.png");
    },

    secRptTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_Report a');
        await helper.waitForNavigation();
        await helper.screenshot("SecretariatReportTaskList.png");
    },

    sendPreliminaryMsgToPI: async function (helper, data) {
        // Click on Secretariat Mailbox icon
        await helper.clickOn('i.fa.IACUCPIOrSecMailboxIcon');
        // Wait for Secretairat Mailbox page loading
        let contentSelector = 'a[href*="/IACUC/Comment/SecPIRequetList?ReviewItemId="]';
        const ifrmSelector = '#commentIfr';
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        helper.setFrame(x => x.url().includes('/IACUC/Comment/CommentsFromReviewers?ReviewItemID='));
        // Click on Message to PI tab
        await helper.iframeClickOn('a[href*="/IACUC/Comment/MessageToPI?ReviewItemID="]');
        // Wait for Message to PI tab loading
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        await helper.screenshot("MessageToPI.png");
        // Click on the New message icon to create a new message
        await helper.iframeClickOn('a > i.fa.fa-plus-square');
        contentSelector = '#optionalSubject';
        // Wait for new message page loading
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        // Type the message subject
        await helper.iframeType(ifrmSelector, '#optionalSubject', data.PreliminaryCheck.subject);
        // Add three sections for query
        for (let i = 4; i < 7; i++) {
            await helper.setSelectIndex('#drpCategory', i, true);
            await helper.iframeClickOn('a > i.fa.fa-plus-square');
            await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        }
        // Tick the Release Form checkbox
        await helper.iframeClickOn('#IsReleaseForm');
        // Type the message detail for each section
        //div.form-group.col-sm-12 > div.col-sm-12:nth-child(1) div.ReviewerComments
        await helper.frame.evaluate((data) => {
            function getReviewerCommentsSelector(nth) {
                if (nth != "") {
                    nth = `:nth-child(${nth})`;
                }
                return `div.form-group.col-sm-12 > div.col-sm-12${nth} div.ReviewerComments`;
            }
            document.querySelectorAll(getReviewerCommentsSelector("")).forEach((elem, index) => {
                if (document.querySelector(`${getReviewerCommentsSelector(index + 1)} i.fa.fa-chevron-right`)) {
                    document.querySelector(`${getReviewerCommentsSelector(index + 1)} div.ReviewerComments-title`).click();
                }
                const id = `MessageCategoryGroupList_${index}__ReviewMessageItemList_0__Comment`;
                uectrl = UE.getEditor(id);
                uectrl.ready(() => {
                    document.querySelector(`#${id}`).scrollIntoView();
                    uectrl.setContent(`${data.question} ${index}`);
                });
            });
        }, { question: data.PreliminaryCheck.question });
        // Click on Send Message icon
        await helper.iframeClickOn('i.fa.IACUCReplayMsgToSecIcon');
        // Wait for send message result
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SendPreliminaryMessageToPI.png");
    },

    completePreliminaryCheck: async function (helper, data) {
        // Click on complete preliminary check icon
        await helper.clickOn('i.fa.IACUCPreliminaryCheckIcon');
        await helper.typeTextarea('#PreliminaryCheck_Notes', 'Notes for Secretariat use - test');
        await helper.typeTextarea('#PreliminaryCheck_SecretariatRemark', 'Secretariat Remarks to Chairman - test');
        await helper.clickOn('input[name="PreliminaryCheck.IsCompleted"]');
        await helper.screenshot("CompletePreliminaryCheck_popup.png");
        await helper.clickOn('button.btn.btn-green[onclick="uc.iacuc.reviewworkspace.SavePreliminaryCheck();"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("CompletePreliminaryCheck.png");
    },

    assignStudyToMeeting: async function (helper, data) {
        // Click on track change icon
        await helper.clickOn('i.fa.IACUCUpdateReviewStatusIcon');
        await helper.setSelectVal('#modal_AssignToMeeting select[name="meetingId"]', data.Meeting.id);
        await helper.screenshot('AssignToMeeting_popup.png');
        await helper.clickOn('#modal_AssignToMeeting i.fa.IACUCSaveIcon');
        await helper.clickOn('#modal_warming button.btn.btn-green[ms-visible="showOk"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot('AssignStudyToMeeting.png');
    },

    gotoMeetingSchedule: async function (helper, data) {
        // Click on meeting details icon
        await helper.clickOn('i.fa.IACUCMettingCalIcon');
        await helper.waitForNavigation();
        await helper.type('#Subject', 'Meeting subject - test');
        await helper.type('#Venue', 'Meeting venue - test');
        await helper.setSelectIndex('#ChairmanFk', 1);
        await helper.typeRichTextBox('#Note', 'Notes (For Secretariat Use Only) - test');
        await helper.clickOn('button.btn.btn-green[onclick="medisys.framework.ui.ShowModal(\'SelectAttendees\');"]');
        const chkattendees = await helper.page.$$('input[name="attendees"]');
        for (let att of chkattendees) {
            await att.click();
        };
        await helper.clickOn('button.btn.btn-green[onclick*="ConfirmSelectAttendees"]');
        await helper.clickOn('i.fa.IACUCBeforeMeetingFinaliseIcon');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot('MeetingSchedule.png');
    },

    gotoMeetingApplicationList: async function (helper, data) {
        await helper.clickOn('a[onclick*="/IACUC/ReviewWorkspace/PreliminaryCheck"]');
        await helper.waitForNavigation('networkidle');
        // Click on Notify Chairman icon
        await helper.clickOn('i.fa.IACUCReplayMsgToSecIcon');
        await helper.clickOn('button.btn.btn-green[onclick*="SendToChairman"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot('MeetingApplicationList.png');
    },

    gotoMeetingMaterials: async function (helper, data) {
        this.gotoMeeting(helper, data);
        // Click on "Meeting Material" tab
        await helper.clickOn('a[onclick*="/IACUC/ReviewWorkspace/Materials"]');
        await helper.waitForNavigation('networkidle');
        // Type Any Other Matters
        await helper.typeRichTextBox('#OtherMatters', 'Any other matters - test');
        await helper.screenshot("EditMeetingMaterial.png");
        await helper.clickOn('i.fa.IACUCSaveIcon');
        await helper.waitForNavigation('networkidle');
        // Click on print agenda icon
        await helper.clickOn('i.fa.IACUCPrintIcon');
        await helper.waitForiFrameRendered('#printAgendaIfr', 'div.form-group');
        await helper.screenshot("PrintAgenda.png");
        // Close print agenda window
        await helper.clickOn('#modal_warming button[ms-click="cancel"]');
        // Click on Send Materials icon
        await helper.clickOn('i.fa.IACUCReplayMsgToSecIcon');
        await helper.waitForNavigation('networkidle');
        // Confirm to send
        await helper.clickOn('button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SendMeetingMaterial.png");
        // Remove all messages
        await helper.page.evaluate(() => {
            document.querySelectorAll('div.notifications.top-center a.close.pull-right').forEach((elem) => {
                elem.click();
            });
        });
    },

    openSecMailbox: async function (helper, data) {
        await helper.clickOn('#NewAppReviewed i.fa.fa-envelope');
        const ifrmSelector = '#commentIfr';
        await helper.waitForiFrameRendered(ifrmSelector, 'li > a[href*="/IACUC/Comment/SecPIRequetList"]');
        helper.setFrame(x => x.url().includes('/IACUC/Comment/CommentsFromReviewers?ReviewItemID='));
    },

    ackReviewerComment: async function (helper, data) {
        const ifrmSelector = '#commentIfr';
        const reviewercommentlist = await helper.frame.$$('#CommentsFromReviewersGrid i.fa.fa-envelope.font-style-green');
        // Update reviewer comment message status to To be sent to Applicant
        for (i = 0; i < reviewercommentlist.length; i++) {
            await helper.iframeClickOn(`#CommentsFromReviewersGrid tbody tr:nth-child(${i + 1}) i.fa.fa-envelope.font-style-green`);
            await helper.waitForiFrameRendered(ifrmSelector, 'i.fa.IACUCSaveIcon');
            await helper.setSelectIndex('#Status', 1, true);
            await helper.iframeClickOn(`i.fa.IACUCSaveIcon`);
            await helper.waitForiFrameRendered(ifrmSelector, 'i.fa.IACUCSaveIcon');
            await helper.iframeClickOn('a.add-underline');
            await helper.waitForiFrameRendered(ifrmSelector, 'li > a[href*="/IACUC/Comment/SecPIRequetList"]');
        }
        await helper.screenshot("CommentFromReviewer.png");
        // Remove all messages
        await helper.page.evaluate(() => {
            document.querySelectorAll('div.notifications.top-center a.close.pull-right').forEach((elem) => {
                elem.click();
            });
        });
    },

    sendReviewerCommentToPI: async function (helper, data) {
        const ifrmSelector = '#commentIfr';
        await helper.iframeClickOn('a[href*="/IACUC/Comment/MessageToPI?ReviewItemID="]');
        await helper.waitForiFrameRendered(ifrmSelector, 'a[href*="/IACUC/Comment/SecPIRequetList?ReviewItemId="]');
        await helper.screenshot("MessageToPI.png");
        // Click on the New message icon to create a new message
        await helper.iframeClickOn('a > i.fa.fa-plus-square');
        // Wait for new message page loading
        await helper.waitForiFrameRendered(ifrmSelector, '#optionalSubject');
        // Selelct all reviewers' comment
        await helper.frame.evaluate(() => {
            document.querySelectorAll('input[name="reviewcomment"]').forEach((elem) => {
                elem.checked = true;
            });
        });
        await helper.iframeClickOn('i.fa.fa-refresh');
        //await helper.waitForiFrameRendered(ifrmSelector, 'i.fa.fa-chevron-right');
        await helper.page.waitForNavigation({waitUntil:'networkidle',networkIdleTimeout:5000});

        // Type the message subject
        await helper.iframeType(ifrmSelector, '#optionalSubject', data.ReviewerComment.subject);

        // Tick release form
        await helper.iframeClickOn('#IsReleaseForm');
        // Copy reviewer message 
        await helper.frame.evaluate(() => {
            function getReviewerCommentsSelector(nth) {
                if (nth != "") {
                    nth = `:nth-child(${nth})`;
                }
                return `div.form-group.col-sm-12 > div.col-sm-12${nth} div.ReviewerComments`;
            }
            document.querySelectorAll(getReviewerCommentsSelector("")).forEach((elem, index) => {
                if (document.querySelector(`${getReviewerCommentsSelector(index + 1)} i.fa.fa-chevron-right`)) {
                    document.querySelector(`${getReviewerCommentsSelector(index + 1)} div.ReviewerComments-title`).click();
                }
            });
            document.querySelectorAll('i.fa.fa-pencil-square-o.set-green-color').forEach((elem) => {
                elem.click();
            });
        });
        // Special handling for General comment
        await helper.setRichTextBox('#MessageCategoryGroupList_0__ReviewMessageItemList_0__Comment', 'Reviewer general comment', true);
        // Click on Send Message icon
        await helper.iframeClickOn('i.fa.IACUCReplayMsgToSecIcon');
        // Wait for send message result
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SendReviewerMessageToPI.png");
    },

    gotoMeetingDecision: async function (helper, data) {
        await helper.clickOn('a[onclick*="/IACUC/ReviewWorkspace/Decision"]');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('a.meeting-complete-btn.btn-green');
        await helper.clickOn('#modal_warming button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("DecisionClickedCompleted.png");
    },

    updateReviewStatus: async function (helper, status) {
        // Click on Update Review Status icon
        await helper.clickOn('i.fa.IACUCUpdateReviewStatusIcon');
        await helper.clickOn(`input[name="UpdateReviewStatusModel.StatusCode"][value="${status.code}"]`);

        // Handle extra information tied to status
        switch (status.name) {
            case "Approve":
                await helper.clickOn('#UpdateReviewStatusModel_ExtendStudyValidityDate');
                await helper.setSelectIndex('#SelectStudyExtMonths', 2);
                break;
        }

        await helper.clickOn('#modal_AmendmentUpdateStatus i.fa.IACUCSaveIcon');
        await helper.clickOn('#modal_warming button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`UpdateReviewStatusTo${status.name}.png`);
    },

    gotoNewAppPendingCommitteeReviewList: async function (helper, data) {
        // Click on the IACUC Studies menu
        await helper.clickOn('a[href="/IACUC/ReviewWorkspace/Index"]');
        await helper.waitForNavigation('networkidle');
        // Click on Pending Committee Review menu
        await helper.clickOn('a[onclick*="/IACUC/ReviewWorkspace/SctNewPendingCom"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`PendingCommitteeReview.png`);
    },

    updateReviewStatusToApprove: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCUpdateReviewStatusIcon');
        await helper.clickOn('input[name="UpdateReviewStatusModel.StatusCode"][value="006"]');
        await helper.setValue('#UpdateReviewStatusModel_StudyApprovalDuration', '24');
        await helper.setSelectVal('#updateStatus_studyapprovaldate', 'Month');
        await helper.type('#UpdateReviewStatusModel_PendingItems', 'Pending Items - test');
        await helper.clickOn('#modal_UpdateStatus i.fa.IACUCSaveIcon');
        //await helper.clickOn('#modal_UpdateStatus i.fa.IACUCSaveIcon');
        await helper.clickOn('button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`ApproveApplication.png`);
    },

    prepareDecisionLetter: async function (helper, data) {
        await helper.clickOn('i.fa.fa-pencil-square-o.set-green-color.set-font-size30');
        await helper.clickOn('button[onclick="uc.iacuc.reviewworkspace.SendDecisionLetter(\'002\');"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`PrepareDecisionLetter.png`);
    },

    setAmendmentCategory: async function (helper, type) {
        await helper.clickOn('i.fa.IACUCSetAmendmentCategoryIcon');
        await helper.type('#ReviewAmendmentCategroy_IACUCSecretariatInput', 'Secretariat Input - test');
        await helper.clickOn(`input[name="ReviewAmendmentCategroy.IACUCAmendmentCategory"][value="${type}"]`);
        await helper.clickOn('#modal_SetAmendmentCategory i.fa.IACUCSaveIcon');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`SetAmendmentCategoryTo${type}.png`);
    },

    ackAnnualProjectUpdate: async function (helper, status) {
        await helper.clickOn('i.fa.IACUCUpdateReviewStatusIcon');
        await helper.clickOn(`input[name="UpdateReviewStatusModel.StatusCode"][value="${status.code}"]`);
        await helper.clickOn('#modal_UpdateStatus i.fa.IACUCSaveIcon');
        await helper.clickOn('button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`UpdateAPUStatusTo${status.name}.png`);
    },

    ackFinalProjectReport: async function (helper, status) {
        await helper.clickOn('i.fa.IACUCUpdateReviewStatusIcon');
        await helper.clickOn(`input[name="UpdateReviewStatusModel.StatusCode"][value="${status.code}"]`);
        await helper.clickOn('#modal_UpdateStatus i.fa.IACUCSaveIcon');
        await helper.clickOn('button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`UpdateFPRStatusTo${status.name}.png`);
    },

    gotoAllStudies: async function (helper, data) {
        await helper.clickOn('a[href="/IACUC/ReviewWorkspace/Index"]');
        await helper.waitForNavigation();
        await helper.clickOn('i.fa.IACUCAllStudiesICon-big');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`AllStudies.png`);
    },

    openReviewFolderFromAllStudies: async function (helper, isharerefno) {
        await helper.type('#Filter_iSHaReRefNo', isharerefno);
        await helper.clickOn('#btnSearch');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('a[href*="/IACUC/StudyFolder/StudyFolderForm"]');
        await helper.waitForNavigation();
        await helper.screenshot(`ReviewFolder_${isharerefno}.png`);
    },

    setStudyStatus: async function (helper, status) {
        await helper.clickOn('i.fa.fa-cog');
        await helper.clickOn(`input[name="StudyProcess.StatusCode"][value="${status.code}"]`);
        await helper.clickOn('#modal_UpdateStudyStatus i.fa.IACUCSaveIcon');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`UpdateStudyStatusTo${status.name}.png`);
    }
}