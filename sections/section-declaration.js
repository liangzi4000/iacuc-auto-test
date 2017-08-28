module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_eb"]');
        await helper.clickOn('#Form_SEB1_2');
        await helper.clickOn('#Form_SEB1_2_1');
        await helper.clickOn('#Form_SEB1_3');
        await helper.clickOn('#Form_SEB1_4');
        await helper.clickOn('#Form_SEB1_4_1');
        await helper.clickOn('#Form_SEB1_4_1_1');
        await helper.clickOn('#Form_SEB1_4_1_2');
        await helper.clickOn('#Form_SEB1_4_1_3');
        await helper.clickOn('#Form_SEB1_4_1_4');
        await helper.clickOn('#Form_SEB1_4_1_5');
        await helper.clickOn('#Form_SEB1_4_2');
        await helper.clickOn('#Form_SEB1_4_3');
        await helper.clickOn('#Form_SEB1_4_4');
        await helper.clickOn('input[name="Form.SEB2"][value="0"]');
        await helper.clickOn('input[name="Form.SEB3"][value="0"]');
        await helper.screenshot("DeclarationofEthicsBiosafetyConsiderations.png");
    }
}
