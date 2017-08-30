module.exports = {
    login: async function (helper, data) {
        await helper.type('#txtUserID', data.loginid);
        await helper.type('#txtPassword', data.password);
        await helper.clickOn('#btnLogin');
        await helper.waitForNavigation();
        await helper.screenshot(`${data.loginid}_Login.png`);
    },

    openLandingPage: async function (helper, data) {
        await helper.page.goto('http://localhost:10000/loginpage/locallogin.aspx');
        if (helper.page.url().indexOf('Dashboard/DefaultDashboard.aspx')) {
            await this.logout(helper, data);
        }
    },

    logout: async function (helper, data) {
        await helper.page.evaluate(() => {
            page.global.LogOut();
        })
        await helper.waitForNavigation();
    }
}