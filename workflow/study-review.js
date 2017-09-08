module.exports = {
    secAppTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_NewApplication a');
        await helper.waitForNavigation();
        await helper.screenshot("SecretariatApplicationTaskList.png");
    },

    openFormInReviewWorkspace: async function (helper, formid) {
        await helper.clickOn(`a[href*="formId=${formid}"]`);
        await helper.waitForNavigation();
        await helper.screenshot("OpenFormInReviewWorkspace.png");
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

    secAmdTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_NewApplication a');
        await helper.waitForNavigation();
        await helper.screenshot("SecretariatAmendmentTaskList.png");
    },

    secRptTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_NewApplication a');
        await helper.waitForNavigation();
        await helper.screenshot("SecretariatReportTaskList.png");
    },

    chrAssignPRSRTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_NewApplication a');
        await helper.waitForNavigation();
        await helper.screenshot("ChairmanAssignPRSRTaskList.png");
    },

    viewTrackChange: async function (helper, data, browser, common) {
        // Click on track change icon
        await helper.clickOn('i.fa.IACUCTrackChangeIcon');
        await helper.waitForNavigation('networkidle');

        // Wait for puppeteer new feature to handle multiple tabs. Currently use javascript workaround.
        // await helper.clickOn('button#compareBtn');
        const url = await helper.page.evaluate(() => {
            /* let chklist = document.querySelectorAll('#changes input[type="checkbox"]:checked:not([disabled])');
            chklist.forEach((elem) => {
                elem.click();
            })
            document.querySelector('#changes input[type="checkbox"]:not([disabled])').click(); */
            let checks = $("#changes input:checked");
            let url = `/IACUC/IACUCSummary/SummaryPrint?studyId=${$("#Form_StudyFK").val()}&formFK=${$("#Form_FormFK").val()}&snapShotOldId=${checks.eq(0).val()}&snapShotNewId=${checks.eq(1).val()}`;
            return url;
        });
        // Close the track change popup window
        await helper.clickOn('#TrackChanges button.close');
        const tcPage = await browser.newPage();
        await tcPage.setViewport({ width: data.Environment.resolution.width, height: data.Environment.resolution.height });
        await tcPage.goto(data.Environment.host + url);
        // How to use javascript to remove the scrollbar and do a full page screenshot?
        /* await tcPage.evaluate(()=>{
            document.querySelector('body').style.overflowY = "scroll";
            document.querySelector('div.summary-container').style.height = '100%';
            document.querySelector('div.summary-content').style.height = '100%';
        }); */
        const tcHelper = new common.helper(tcPage);
        tcHelper.indexCount = helper.indexCount;
        await tcHelper.screenshot('ViewTrackChange.png');
        helper.indexCount = tcHelper.indexCount;
        tcPage.close();
    },

    assignToMeeting: async function (helper, data) {
        // Click on track change icon
        await helper.clickOn('i.fa.IACUCUpdateReviewStatusIcon');
        await helper.setSelectVal('#modal_AssignToMeeting select[name="meetingId"]', data.Meeting.id);
        await helper.screenshot('AssignToMeeting_popup.png');
        await helper.clickOn('#modal_AssignToMeeting i.fa.IACUCSaveIcon');
        await helper.clickOn('#modal_warming button.btn.btn-green[ms-visible="showOk"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot('AssignToMeeting.png');
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

    gotoChairmanAssignPRSRPage: async function (helper, data) {
        await helper.clickOn('#IACUC_AssignReviewer a');
        await helper.waitForNavigation();
        await helper.screenshot("PendingChairmanAssignPRSR.png");
    },

    gotoChairmanSignaturePage: async function (helper, data) {
        await helper.clickOn('#IACUC_PendingChairmanSignature a');
        await helper.waitForNavigation();
        await helper.screenshot("PendingChairmanAssignPRSR.png");
    },

    signDecisionLetter: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCChairmanSignAppLetterIcon');
        await helper.clickOn('button.btn.btn-green[onclick*="SetSignApprovalLetter"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot('SignApproveLetter.png');
    },

    chairmanAssignPRSR: async function (helper, data) {
        const pendinglist = await helper.page.$$('#PendingCommGrid i.fa.IACUCAssignReviewerIcon-small');
        for (let i = 0; i < pendinglist.length; i++) {
            await pendinglist[i].click();
            await helper.waitForNavigation('networkidle');
            await helper.setSelectVal('#select_pr', data.PR.profile.memid);
            await helper.setSelectVal('#select_sr', data.SR.profile.memid);
            await helper.screenshot(`AssignPRSR_${i}_popup.png`);
            await helper.clickOn('button.btn.btn-green[onclick*="AssignReviewer"]');
            await helper.waitForNavigation('networkidle');
            await helper.screenshot(`AssignPRSR_${i}.png`);
        }
        // Click on Complete Assign Reviewer icon
        await helper.clickOn('i.fa.IACUCConfirmReviewerAssIcon');
        await helper.clickOn('button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot('CompleteAssignPRSR.png');
    },

    gotoMeetingMaterials: async function (helper, data) {
        this.gotoMeeting(helper, data);
        await helper.clickOn('a[onclick*="/IACUC/ReviewWorkspace/Materials"]');
        await helper.waitForNavigation('networkidle');
        await helper.typeRichTextBox('#OtherMatters', 'Any other matters - test');
        await helper.screenshot("EditMeetingMaterial.png");
        await helper.clickOn('i.fa.IACUCSaveIcon');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('i.fa.IACUCPrintIcon');
        await helper.waitForiFrameRendered('#printAgendaIfr', 'div.form-group');
        await helper.screenshot("PrintAgenda.png");
        await helper.clickOn('#modal_warming button.close');
        await helper.clickOn('i.fa.IACUCReplayMsgToSecIcon');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SendMeetingMaterial.png");
    },

    gotoMeetingDecision: async function (helper, data) {
        await helper.clickOn('a[onclick*="/IACUC/ReviewWorkspace/Decision"]');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('a.meeting-complete-btn.btn-green');
        await helper.clickOn('#modal_warming button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("DecisionClickedCompleted.png");
        await helper.clickOn('#NewAppReviewed i.fa.fa-envelope');
        const ifrmSelector = '#commentIfr';
        await helper.waitForiFrameRendered(ifrmSelector, 'li > a[href*="/IACUC/Comment/SecPIRequetList"]');
        helper.setFrame(x => x.url().includes('/IACUC/Comment/CommentsFromReviewers?ReviewItemID='));
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
        await helper.waitForiFrameRendered(ifrmSelector, '#optionalSubject');
        // Here is an extra page postback, need to do double checking
        await helper.waitForiFrameRendered(ifrmSelector, '#optionalSubject');
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

    gotoMeeting: async function (helper, data) {
        await helper.page.goto(`${data.Environment.host}/IACUC/ReviewWorkspace/MeetingDetail?MeetingDetailId=${data.Meeting.id}&ispartial=false`);
    },

    gotoPendingCommitteeReviewPage: async function (helper, data) {
        await helper.clickOn('#IACUC_Review a');
        await helper.waitForNavigation();
        await helper.screenshot("PendingCommitteeReview.png");
    },

    openForm: async function (helper, role, formid) {
        if (role == 'PR' || role == 'SR') {
            await helper.clickOn(`#PendingCommGrid a[href*="/IACUC/ReviewWorkSpace/Index?formId=${formid}"]`);
        } else {
            await helper.clickOn(`#ReviewerCommGrid a[href*="/IACUC/ReviewWorkSpace/Index?formId=${formid}"]`);
        }
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`OpenFormBy${role}.png`);
    },

    comment: async function (helper, comment) {
        await helper.clickOn('i.fa.IACUCRevComListtingIcon');
        await helper.waitForiFrameRendered('#reviewerCommentIfr', 'i.fa.fa-plus-square');
        helper.setFrame(x => x.url().includes('/IACUC/Comment/ReviewerPendingComments?ReviewItemId='));
        for (let i = 5; i < 8; i++) {
            await helper.iframeClickOn('i.fa.fa-plus-square.set-green-color.set-font-size30');
            await helper.waitForiFrameRendered('#reviewerCommentIfr', 'i.fa.IACUCSaveIcon');
            await helper.setSelectIndex('select[name="SectionCategory.CategoryCode"]', i, true);
            await helper.setRichTextBox('#Comment', `${comment} ${i}`, true);
            await helper.iframeClickOn('i.fa.IACUCSaveIcon');
            await helper.waitForiFrameRendered('#reviewerCommentIfr', 'i.fa.fa-plus-square');
        }
        await helper.screenshot(`ReviewerComment.png`);
        await helper.iframeClickOn('h5 i.fa.fa-pencil');
        await helper.waitForiFrameRendered('#reviewerCommentIfr', 'i.fa.IACUCSaveIcon');
        await helper.iframeClickOn('#PDCnSCSpecies_0__Category1');
        await helper.iframeClickOn('#PDCnSCSpecies_0__FFR');
        await helper.iframeClickOn('i.fa.IACUCSaveIcon');
        await helper.waitForiFrameRendered('#reviewerCommentIfr', 'i.fa.IACUCSaveIcon');
        await helper.screenshot(`ReviewerPainDistressCategory.png`);
        await helper.iframeClickOn('a.add-underline');
        await helper.waitForiFrameRendered('#reviewerCommentIfr', 'i.fa.fa-plus-square');
        await helper.iframeClickOn('i.fa.IACUCReplayMsgToSecIcon');
        await helper.waitForiFrameRendered('#reviewerCommentIfr', 'i.fa.IACUCPrintIcon');
        await helper.screenshot(`SendCommentToSecretariat.png`);
    },

    gotoPendingCommitteeReviewList: async function (helper, data) {
        // Click on the IACUC Studies menu
        await helper.clickOn('a[href="/IACUC/ReviewWorkspace/Index"]');
        await helper.waitForNavigation('networkidle');
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
        await helper.clickOn('#modal_UpdateStatus i.fa.IACUCSaveIcon');
        await helper.clickOn('button.btn.btn-green[ms-click="ok"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`ApproveApplication.png`);
    },

    prepareDecisionLetter: async function (helper, data) {
        await helper.clickOn('i.fa.fa-pencil-square-o.set-green-color.set-font-size30');
        await helper.clickOn('button[onclick="uc.iacuc.reviewworkspace.SendDecisionLetter(\'002\');"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`PrepareDecisionLetter.png`);
    }
}