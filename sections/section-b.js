module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_b"]');
        await helper.typeRichTextBox('#Form_SB1', 'Objectives of the Study - test');
        await helper.screenshot("SectionB.png");
    }
}