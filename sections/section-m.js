module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_m"]');
        await helper.clickOn('input[name="Form.SM1"][value="False"]');
        await helper.screenshot("SectionM.png");
    }
}