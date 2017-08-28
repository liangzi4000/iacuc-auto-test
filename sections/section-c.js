module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_c"]');
        await helper.typeRichTextBox('#Form_SC1', 'Abstract of the Study - test');
        await helper.screenshot("SectionC.png");
    }
}