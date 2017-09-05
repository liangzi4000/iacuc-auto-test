module.exports = {
    secAppTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_NewApplication a');
        await helper.waitForNavigation();
        await helper.screenshot("SecretariatApplicationTaskList.png");
    },

    openFormInReviewWorkspace: async function (helper, formid) {
        await helper.clickOn(`a[href="/IACUC/ReviewWorkSpace/Index?formId=${formid}"]`);
        await helper.waitForNavigation();
        await helper.screenshot("OpenFormInReviewWorkspace.png");
    },

    sendPreliminaryMsgToPI: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCPIOrSecMailboxIcon');
        let contentSelector = 'a[href*="/IACUC/Comment/SecPIRequetList?ReviewItemId="]';
        const ifrmSelector = '#commentIfr';
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        helper.setFrame(x => x.url().includes('/IACUC/Comment/CommentsFromReviewers?ReviewItemID='));
        await helper.iframeClickOn('a[href*="/IACUC/Comment/MessageToPI?ReviewItemID="]');
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        await helper.screenshot("MessageToPI.png");
        await helper.iframeClickOn('a > i.fa.fa-plus-square');
        contentSelector = '#optionalSubject';
        await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        await helper.iframeType(ifrmSelector, '#optionalSubject', data.PreliminaryCheck.subject);
        for (let i = 4; i < 7; i++) {
            await helper.setSelectIndex('#drpCategory', i, true);
            await helper.iframeClickOn('a > i.fa.fa-plus-square');
            await helper.waitForiFrameRendered(ifrmSelector, contentSelector);
        }
        await helper.iframeClickOn('#IsReleaseForm');
        await helper.frame.evaluate((data) => {
            const ReviewerCommentsSelector = 'div.ReviewerComments';
            const list = document.querySelectorAll(ReviewerCommentsSelector);
            list.forEach((div, index) => {
                if (document.querySelector(`${ReviewerCommentsSelector}:nth-child(${index}) i.fa.fa-chevron-right`)) {
                    document.querySelector(`${ReviewerCommentsSelector}:nth-child(${index}) div.ReviewerComments-title`).click();
                }
                document.querySelectorAll(`${ReviewerCommentsSelector}:nth-child(${index}) div.edui-default`)
                const id = `MessageCategoryGroupList_${index}__ReviewMessageItemList_0__Comment`;
                document.querySelector(`#${id}`).scrollIntoView();
                uectrl = UE.getEditor(id);
                uectrl.ready(() => {
                    uectrl.setContent(`${data.PreliminaryCheck.question} ${index}`);
                });
            });
        }, data);
        await helper.iframeClickOn('i.fa.IACUCReplayMsgToSecIcon');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot("SendPreliminaryMessageToPI.png");
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
}