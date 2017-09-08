module.exports = {
    login: async function (helper, data) {
        await helper.type('#txtUserID', data.loginid);
        await helper.type('#txtPassword', data.password);
        await helper.clickOn('#btnLogin');
        await helper.waitForNavigation('networkidle');
        await helper.screenshot(`${data.loginid}_Login.png`);
    },

    openLandingPage: async function (helper, data) {
        await helper.page.goto(`${data.Environment.host}/loginpage/locallogin.aspx`);
        if (helper.page.url().indexOf('/loginpage/locallogin.aspx') == -1) {
            await this.logout(helper, data);
            await helper.page.goto(`${data.Environment.host}/loginpage/locallogin.aspx`);
        }
    },

    logout: async function (helper, data) {
        await helper.page.evaluate(() => {
            page.global.LogOut();
        })
        await helper.waitForNavigation();
        //await helper.page.goto(`${data.Environment.host}/LogOut.aspx`);
    }
}