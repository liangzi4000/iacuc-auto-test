module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_n"]');
        await helper.clickOn('input[name="Form.SN1"][value="False"]');
        await helper.screenshot("SectionN.png");
    }
}