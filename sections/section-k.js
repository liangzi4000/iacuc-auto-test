module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_k"]');
        
        await helper.clickOn('i.fa.fa-pencil.fanomargin');
        await helper.type('#Year1', data.YearAndNumber.number[0].toString());
        if (data.YearAndNumber.year > 1) {
            await helper.type('#Year2', data.YearAndNumber.number[1].toString());
        }
        if (data.YearAndNumber.year > 2) {
            await helper.type('#Year3', data.YearAndNumber.number[2].toString());
        }
        await helper.clickOn('input.btn.btn-green.noprint[value="Ok"]');
        await helper.typeTextarea('#SK2_3_1_0', 'Please justify unrelieved pain - test');

        await helper.screenshot("SectionK.png");
    }
}