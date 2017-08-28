module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_d"]');
        await helper.clickOn('#btnAddSpeies');
        await helper.setSelectVal('#sectionD_SpeciesName', 'Frog');
        await helper.type('#sectionD_StrainStocks', 'Strains/Stocks - test');
        await helper.type('#sectionD_age_or_weight', '23');
        await helper.setSelectVal('#sectionD_SpeciesSource1', 'BRC');
        await helper.setSelectVal('#sectionD_SpeciesSex', 'Either');
        await helper.type('#species_form > div > div:nth-child(8) input.k-input.k-formatted-value', data.YearAndNumber.number[0].toString());
        if (data.YearAndNumber.year > 1) {
            await helper.type('#species_form > div > div:nth-child(9) input.k-input.k-formatted-value', data.YearAndNumber.number[1].toString());
        }
        if (data.YearAndNumber.year > 2) {
            await helper.type('#species_form > div > div:nth-child(10) input.k-input.k-formatted-value', data.YearAndNumber.number[2].toString());
        }
        await helper.type('#sectionD_SpeciesSource_other', 'Source (Others) - test');
        await helper.type('#sectionD_SpeciesHoldLocation_other', 'Holding Location (Others) - test');
        await helper.setSelectVal('#sectionD_SpeciesProcedureLocation', 'Others');
        await helper.type('#sectionD_SpeciesProcedureLocation_other', 'Animal Procedure Location Others - test');
        await helper.screenshot("SectionD_popup.png");
        await helper.clickOn('#AddSpeciesOrStrains');
        await helper.clickOn('input[name="Form.SD2"][value="False"]');
        await helper.screenshot("SectionD.png");
    }
}