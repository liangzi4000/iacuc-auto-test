module.exports = {
    login: async function (helper, data) {
        await helper.type('#txtUserID', data.loginid);
        await helper.type('#txtPassword', data.password);
        await helper.clickOn('#btnLogin');
        await helper.waitForNavigation('networkidle');
        let currentLoginId = await this.getCurrentLoginId(helper);
        if (currentLoginId != data.loginid) {
            await helper.intervene(`Dashboard cache issue encountered, expected login id is ${data.loginid}`);
        }
        await helper.screenshot(`${data.loginid}_Login.png`);
    },
    /* 
    getDisplayUsername: async function (helper) {
        await helper.page.waitForSelector('a[title="Manage User Profile"]', { visible: true });
        return await helper.page.evaluate(() => {
            return document.querySelector('a[title="Manage User Profile"]').textContent.trim();
        });
    },
     */
    getCurrentLoginId: async function (helper) {
        return await helper.page.evaluate(() => {
            return document.querySelector('#txtLoginID').value;
        });
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
    },

    lastLoginUserName: '' // Variable to store current login user name so as to resovle the dashboard cache issue
}