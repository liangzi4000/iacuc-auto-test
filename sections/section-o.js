module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_o"]');
        await helper.clickOn('#Form_SO1');
        await helper.screenshot("SectionO.png");
    }
}