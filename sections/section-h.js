module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_h"]');
        const chklist = await helper.page.$$('input[type="checkbox"]');
        for (let i = 0; i < chklist.length; i++){
            chklist[i].click(); // why place await in front will cause the ReferenceError: selector is not defined?
        }
        await helper.typeTextarea('textarea[id*="SH1_10_Others"]', 'Others (please specify) - test');
        await helper.typeTextarea('textarea[id*="SH1_11"]', 'Comments - test');
        await helper.typeTextarea('textarea[id*="SH1_12"]', 'How will observation be made? Who will observe and what action(s) will be taken - test');
        await helper.screenshot("SectionH.png");
    }
}