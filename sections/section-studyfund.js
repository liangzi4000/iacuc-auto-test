module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_1"]');
        await helper.clickOn('#Form_S1_1_1');
        await helper.clickOn('#Form_S1_1_2');
        await helper.setSelectVal('#Form_S1_1_2_1', '24')
        await helper.type('#Form_S1_1_2_2', 'Ye Pingyang');
        await helper.type('#Form_S1_1_2_3', '85621023');
        await helper.type('#Form_S1_1_2_4', 'ye_ping_yang@medinno.com');
        await helper.type('#Form_S1_1_2_5', '88888888');
        await helper.type('#Form_S1_1_2_6', 'Test address');
        await helper.clickOn('#Form_S1_1_3');
        await helper.clickOn('#btnAddGrant');
        await helper.setSelectVal('#GrantAgency', '3cae3c59-25fb-4122-8a26-8191618813d6');
        await helper.waitForNavigation('networkidle');
        await helper.setSelectVal('#GrantName', '26');
        await helper.clickOn('input[name="IsGrantApproved"][value="1"]');
        await helper.type('#GrantRefNumber', 'Grant Ref No 878');
        await helper.clickOn('#calendar1');
        await helper.clickOn('div.bootstrap-datetimepicker-widget.dropdown-menu[style*="display: block"] > div.datepicker > div.datepicker-days > table.table-condensed > thead > tr:nth-child(1) > th.prev');
        await helper.clickOn('div.bootstrap-datetimepicker-widget.dropdown-menu[style*="display: block"] > div.datepicker > div.datepicker-days > table.table-condensed > tbody > tr:nth-child(2) > td:nth-child(3)');
        await helper.type('input.k-formatted-value.k-input', '1000000');
        await helper.clickOn('#calendar2');
        await helper.clickOn('div.bootstrap-datetimepicker-widget.dropdown-menu[style*="display: block"] > div.datepicker > div.datepicker-days > table.table-condensed > thead > tr:nth-child(1) > th.next');
        await helper.clickOn('div.bootstrap-datetimepicker-widget.dropdown-menu[style*="display: block"] > div.datepicker > div.datepicker-days > table.table-condensed > tbody > tr:nth-child(2) > td:nth-child(3)');
        await helper.screenshot("StudyFundingInformation_popup.png");
        await helper.clickOn('#btn-grant-add');
        await helper.screenshot("StudyFundingInformation.png");
    }
}