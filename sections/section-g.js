module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_g"]');
        
        await helper.typeRichTextBox('#Form_SG1', 'Explain the experimental design and specify all animal procedures. Your description should allow the IACUC to understand the experimental course of an animal from its entry into the experiment to the endpoint of the study - test');
        await helper.clickOn('#Form_SG2');
        await helper.clickOn('#Form_SG3');
        await helper.clickOn('#Form_SG4');
        await helper.clickOn('#Form_SG5');
        await helper.clickOn('#Form_SG6');
        await helper.clickOn('#Form_SG7');
        await helper.clickOn('#Form_SG8');
        await helper.clickOn('#Form_SG9');
        await helper.clickOn('#Form_SG10');
        
        await helper.screenshot("SectionG.png");
    }
}