module.exports = {
    vetChecklistTaskList: async function (helper, formid) {
        await helper.clickOn('#IACUC_VetChecklist a');
        await helper.waitForNavigation();
        await helper.screenshot("PendingVetChecklistTaskList.png");
        await this.openFormInStudyWorkspace(helper, formid);
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
}