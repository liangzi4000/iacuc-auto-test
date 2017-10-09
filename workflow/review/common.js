module.exports = {
    gotoMeeting: async function (helper, data) {
        await helper.page.goto(`${data.Environment.host}/IACUC/ReviewWorkspace/MeetingDetail?MeetingDetailId=${data.Meeting.id}&ispartial=false`);
    },
    
    openFormInReviewWorkspace: async function (helper, formid) {
        await helper.clickOn(`a[href*="${formid}"]`);
        await helper.waitForNavigation();
        await helper.screenshot("OpenFormInReviewWorkspace.png");
    },

    viewTrackChange: async function (helper, data, browser, common) {
        // Click on track change icon
        await helper.clickOn('i.fa.IACUCTrackChangeIcon');
        await helper.waitForNavigation('networkidle');

        // Wait for puppeteer new feature to handle multiple tabs. Currently use javascript workaround.
        // await helper.clickOn('button#compareBtn');
        const url = await helper.page.evaluate(() => {
            /* let chklist = document.querySelectorAll('#changes input[type="checkbox"]:checked:not([disabled])');
            chklist.forEach((elem) => {
                elem.click();
            })
            document.querySelector('#changes input[type="checkbox"]:not([disabled])').click(); */
            let checks = $("#changes input:checked");
            let url = `/IACUC/IACUCSummary/SummaryPrint?studyId=${$("#Form_StudyFK").val()}&formFK=${$("#Form_FormFK").val()}&snapShotOldId=${checks.eq(0).val()}&snapShotNewId=${checks.eq(1).val()}`;
            return url;
        });
        // Close the track change popup window
        await helper.clickOn('#TrackChanges button.close');
        const tcPage = await browser.newPage();
        await tcPage.setViewport({ width: data.Environment.resolution.width, height: data.Environment.resolution.height });
        await tcPage.goto(data.Environment.host + url);
        // How to use javascript to remove the scrollbar and do a full page screenshot?
        /* await tcPage.evaluate(()=>{
            document.querySelector('body').style.overflowY = "scroll";
            document.querySelector('div.summary-container').style.height = '100%';
            document.querySelector('div.summary-content').style.height = '100%';
        }); */
        const tcHelper = new common.helper(tcPage);
        tcHelper.indexCount = helper.indexCount;
        await tcHelper.screenshot('ViewTrackChange.png');
        helper.indexCount = tcHelper.indexCount;
        tcPage.close();
    },
}