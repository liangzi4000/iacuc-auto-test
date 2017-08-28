module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_i"]');
        
        await helper.clickOn('#btn_AddDetails');
        await helper.setSelectIndex('#sectioni_species', 1);
        await helper.setSelectIndex('#sectioni_type', 1);
        await helper.setSelectIndex('#sectioni_drugname', 1);
        await helper.type('#sectioni_dosage_other', 'agej aagja wgajw w');
        await helper.type('#sectioni_duration', 'jaeg aegp wage');
        await helper.type('#sectioni_note', 'Notes - test');
        await helper.clickOn('#btnSaveSI1');

        await helper.screenshot("SectionI.png");
    }
}