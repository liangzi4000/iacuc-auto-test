module.exports ={
    rverPendingCommitteeReviewTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_Review a');
        await helper.waitForNavigation();
        await helper.screenshot("PendingCommitteeReviewTaskList.png");
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
}