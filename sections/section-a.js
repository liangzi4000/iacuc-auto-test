module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_a"]');
        await helper.type('#Form_SA1_1', 'Auto Test Protocol ' + Date());
        await helper.clickOn('#Form_SA1_2 + span');
        await helper.clickOn('div.bootstrap-datetimepicker-widget.dropdown-menu[style*="display: block"] > div.datepicker > div.datepicker-days > table.table-condensed > thead > tr:nth-child(1) > th.next');
        await helper.clickOn('div.bootstrap-datetimepicker-widget.dropdown-menu[style*="display: block"] > div.datepicker > div.datepicker-days > table.table-condensed > tbody > tr:nth-child(2) > td:nth-child(3)');
        await helper.setSelectVal('#Form_SA1_3', data.YearAndNumber.year);
        await helper.clickOn('input[name="Form.SA1_4"][value="True"]');
        await helper.type('#Form_SA1_4_Y_1', 'Please elaborate on the advice required');
        await helper.clickOn('input[name="Form.SA1_5"][value="False"]');
        await helper.clickOn('input[name="Form.SA1_6"][value="False"]');
        await helper.clickOn('input[name="Form.SA1_7"][value="False"]');
        // Add PI
        await helper.clickOn('#btn_PI');
        await helper.type('#sectionA_searchEmail', data.PI.profile.name);
        await helper.clickOn('#btnSearchPI');
        await helper.waitForNavigation('networkidle');
        await helper.clickOn('#SectionA_SearchResult > table > tbody > tr:nth-child(1) input[name="SectionA_PI"]');
        await helper.setSelectVal('#Qualification', data.PI.profile.qualification);
        await helper.type('#CertNumberAndDate', data.PI.profile.cert);
        await helper.type('#ContactNumber', data.PI.profile.contact);
        await helper.clickOn('#stm_confirm');
        // Fill up Delegate info
        await helper.clickOn('div#FormTeamCollaborators_JsonTable tbody tr:nth-child(1) i.fa.fa-pencil.fanomargin');
        await helper.setSelectVal('#Edit_TC_Qualification', data.Delegate.profile.qualification);
        await helper.type('#Edit_TC_CertNumberAndDate', data.Delegate.profile.cert);
        await helper.type('#Edit_TC_ContactNumber', data.Delegate.profile.contact);
        await helper.clickOn('#Edit_TC_confirm');
        // Add team collaborator 
        // Here must use for loop, cannot use forEach as it will execute simultaneously
        for (let i = 0; i < data.TeamMember.length; i++) {
            await helper.clickOn('#btn_TC');
            await helper.type('#sectionA_searchEmailForTC', data.TeamMember[i].name);
            await helper.clickOn('#btnSearchTC');
            await helper.waitForNavigation('networkidle');
            await helper.clickOn('#SectionA_SearchResultFormTC > table > tbody > tr:nth-child(1) input[name="SectionA_PI"]');
            await helper.setSelectVal('#TC_Qualification', data.TeamMember[i].qualification);
            await helper.type('#TC_CertNumberAndDate', data.TeamMember[i].cert);
            await helper.type('#TC_ContactNumber', data.TeamMember[i].contact);
            await helper.clickOn('#TC_confirm');
        }
        await helper.typeRichTextBox('#Form_SA4_1', 'success!');
        await helper.screenshot("SectionA.png");
        await helper.clickOn('i.fa.IACUCSaveIcon');
        await helper.waitForNavigation();
        await helper.screenshot("FormSaved.png");
    }
}