module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_p"]');
        await helper.clickOn('input[name="Form.SP1"][value="False"]');
        await helper.clickOn('input[name="Form.SP2"][value="True"]');        
        await helper.type('#Form_SP2_Y_1', 'If the study has been conducted previously, explain why it is scientifically necessary to duplicate the experiment - test');
        await helper.screenshot("SectionP.png");
    }
}