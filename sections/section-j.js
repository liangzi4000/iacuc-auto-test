module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_j"]');

        await helper.clickOn('input[name="Form.SJ1"][value="True"]');
        await helper.clickOn('input[id*="SJ2"]');
        await helper.waitForNavigation('networkidle');
        await helper.typeTextarea('textarea[id*="SJ2_1"]', 'Pre-Operative Aseptic Preparation - test');
        await helper.waitForNavigation('networkidle');
        await helper.typeTextarea('textarea[id*="SJ2_2"]', 'Operative Procedure - test');
        await helper.waitForNavigation('networkidle');
        await helper.typeTextarea('textarea[id*="SJ2_3"]', 'Post-Operative Procedures - test');
        await helper.waitForNavigation('networkidle');
        await helper.typeTextarea('textarea[id*="SJ2_4"]', 'Who will perform the surgery and what are their qualifications and/or experience - test');
        await helper.waitForNavigation('networkidle');
        await helper.setSelectIndex('select[id*="SJ2_5"]', 1);
        await helper.waitForNavigation('networkidle');

        const iframeselector = 'iframe[src*="/IACUC/Partial/UploadForm/SJ4_1File"]';
        await helper.scrollIntoElem(iframeselector);
        helper.setFrame(x => x.url().includes('/IACUC/Partial/UploadForm/SJ4_1File'));
        await helper.iframeUploadFile('input.fileupload.btn[id*="SJ4_1"]', './sections/section-a.js');
        await helper.iframeType(iframeselector, 'input.form-control[id*="SJ4_1"][id*="Version"]', '1');
        await helper.iframeType(iframeselector, 'input.form-control[id*="SJ4_1"][id*="FileName"]', 'checklist test');
        await helper.iframeClickOn('button.btn.btn-green[id*="SJ4_1"]');
        await helper.waitForNavigation('networkidle');
        // Wait for file rendered on the page
        await helper.frame.waitForSelector('i.fa.fa-file', { visible: true });

        await helper.clickOn('input[name="Form.SJ3"][value="True"]');
        await helper.typeTextarea('#Form_SJ3_Y_1', 'Has major surgery been performed on these animals prior to being placed in this study - test');
        await helper.clickOn('input[name="Form.SJ4"][value="True"]');
        await helper.typeTextarea('#Form_SJ4_Y_1', 'Will more than one survival surgery be performed on animal while in this study - test');

        await helper.screenshot("SectionJ.png");
    }
}