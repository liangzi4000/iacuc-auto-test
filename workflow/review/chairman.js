module.exports = {
    chrSignatureTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_PendingChairmanSignature a');
        await helper.waitForNavigation();
        await helper.screenshot("PendingChairmanSignatureTaskList.png");
    },

    chrAssignPRSRTaskList: async function (helper, data) {
        await helper.clickOn('#IACUC_AssignReviewer a');
        await helper.waitForNavigation();
        await helper.screenshot("PendingChairmanAssignPRSRTaskList.png");
    },

    signDecisionLetter: async function (helper, data) {
        await helper.clickOn('i.fa.IACUCChairmanSignAppLetterIcon');
        await helper.clickOn('button.btn.btn-green[onclick*="SetSignApprovalLetter"]');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot('SignApproveLetter.png');
    },

    assignPRSR: async function (helper, data) {
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

}