module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_e"]');
        
        await helper.typeRichTextBox('#Form_SE1', 'Explain the rationale and basis for choosing the number of animals to be used - test');
        await helper.typeRichTextBox('#Form_SE2_1', 'Replacement of animals with other methods. (Up to 300 words) - test');
        await helper.typeRichTextBox('#Form_SE2_2', 'Reduction in the number of animals used. (Up to 300 words) - test');
        await helper.typeRichTextBox('#Form_SE2_3', 'Refinement of project and the techniques used to minimise impact on animals. (Up to 300 words) - test');
        await helper.typeRichTextBox('#Form_SE3', 'Justify the appropriateness of the species selected as the animal model. (Up to 300 words) - test');
        await helper.clickOn('input[name="Form.SE4_2"][value="False"]');
        await helper.clickOn('input[name="Form.SE6"][value="False"]');

        await helper.screenshot("SectionE.png");
    }
}