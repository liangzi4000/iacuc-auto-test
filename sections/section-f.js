module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_f"]');
        await helper.clickOn('#FormAnimalRequirements_JsonTable i.fa.fa-pencil.fanomargin');
        // await helper.waitForNavigation('networkidle'); // This code sometime not working, maybe it's the response too fast to capture.
        await helper.page.waitForFunction(()=>{
            return document.querySelectorAll('#divBodyIACUCF1_From option').length > 2;
        });
        await helper.setSelectVal('#divBodyIACUCF1_From', 'NCCSAnimalFacility');
        await helper.setSelectVal('#divBodyIACUCF1_To', 'DukeNUSVivarium');
        await helper.type('#divBodyIACUCF1_Describe', 'Describe the method of containment to be utilised - test');
        await helper.screenshot("SectionF_popup.png");
        await helper.clickOn('#modal_IACUCF1Ok');
        await helper.screenshot("SectionF.png");
    }
}