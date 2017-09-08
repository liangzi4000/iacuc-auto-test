const screenshotpath = './screenshot/';
const waitUntilEnum = { load: 'load', networkidle: 'networkidle' };

module.exports = {
    emptyFolder: function (fs, path = screenshotpath, del = false) {
        if (fs.existsSync(path)) {
            let files = fs.readdirSync(path);
            if (files.length > 0) {
                files.forEach(function (element) {
                    let subpath = path + '/' + element;
                    if (fs.statSync(subpath).isFile()) {
                        fs.unlinkSync(subpath);
                    } else {
                        this.emptyFolder(fs, subpath, true);
                    }
                }, this);
            }
            if (del) {
                fs.rmdirSync(path);
            }
        } else {
            fs.mkdirSync(path);
        }
    },

    helper: function (page, path = screenshotpath) {
        this.page = page;
        this.frame = null;
        this.indexCount = 1;

        this.type = async function (selector, value) {
            await this.page.waitForSelector(selector, { visible: true });
            await this.page.focus(selector);
            await this.page.type(value);
        }

        this.setValue = async function (selector, value) {
            await this.page.evaluate((sel) => {
                document.querySelector(sel.selector).value = sel.value;
            }, { selector, value })
        }

        this.typeTextarea = async function (selector, value) {
            await this.typeRichTextBox(selector, value, true);
        }

        this.setSelectVal = async function (selector, value, isframe = false) {
            let context = this.page;
            if (isframe) context = this.frame;
            context.evaluate((data) => {
                let el = document.querySelector(data.selector);
                el.value = data.value;
                return el.dispatchEvent(new Event('change'));
            }, { selector, value })
        }

        this.setSelectIndex = async function (selector, index, isframe = false) {
            let context = this.page;
            if (isframe) context = this.frame;
            context.evaluate((data) => {
                let el = document.querySelector(data.selector);
                const value = document.querySelector(`${data.selector} option:nth-child(${data.index + 1})`).value;
                el.value = value;
                return el.dispatchEvent(new Event('change'));
            }, { selector, index })
        }

        this.clickOn = async function (selector) {
            await this.page.waitForSelector(selector, { visible: true });
            await this.page.click(selector);
        }

        this.gotoSection = async function (selector) {
            await this.clickOn(selector);
            await this.waitForNavigation(waitUntilEnum.networkidle);
        }

        this.waitForNavigation = async function (type = waitUntilEnum.load) {
            await this.page.waitForNavigation({ waitUntil: type });
        }

        this.typeRichTextBox = async function (selector, value, istextarea = false) {
            await this.scrollIntoElem(selector);
            if (!istextarea) selector = `${selector} div.edui-editor-iframeholder.edui-default`;
            await this.page.waitForFunction((selector) => {
                return !!document.querySelector(selector);
            }, { polling: 300 }, selector);
            let coordinator = await this.offset(selector);
            await this.page.mouse.click(coordinator.left + coordinator.width / 2, coordinator.top + coordinator.height / 2, { clickCount: 2 });
            await this.page.type(value);
            await this.page.mouse.click(coordinator.left - 3, coordinator.top); //trigger lose focus
        }

        this.setRichTextBox = async function (selector, message, isframe = false) {
            let context = this.page;
            if (isframe) context = this.frame;
            await context.evaluate((obj) => {
                uectrl = UE.getEditor(obj.selector.replace('#', ''));
                uectrl.ready(() => {
                    document.querySelector(obj.selector).scrollIntoView();
                    uectrl.setContent(obj.message);
                });
            }, { selector, message });
        }

        this.scrollIntoElem = async function (selector) {
            await this.page.waitForSelector(selector, { visible: true });
            await this.page.evaluate((sel) => {
                document.querySelector(sel).scrollIntoView();
            }, selector);
        }

        this.screenshot = async function (filename) {
            await this.page.screenshot({ path: path + this.shotIndex(this.indexCount++) + filename, fullPage: true });
        }

        this.shotIndex = function (count) {
            return (count > 9 ? count : '0' + count) + '. ';
        }

        this.getAttr = async function (selector, attr, context) {
            const result = await context.evaluate((data) => {
                return document.querySelector(data.selector).getAttribute(data.attr);
            }, { selector, attr });
            return result;
        }

        /*         
        this.scrollToBottom = async function (selector = 'body') {
            this.page.evaluate((sel) => {
                let elem = document.querySelector(sel);
                elem.scrollTop = elem.scrollHeight;
            }, selector)
        } 
        */

        this.offset = async function (selector) {
            let result = await this.page.evaluate((sel) => {
                let box = document.querySelector(sel).getBoundingClientRect()
                return Promise.resolve({
                    bottom: box.bottom,
                    height: box.height,
                    left: box.left,
                    right: box.right,
                    top: box.top,
                    width: box.width
                });
            }, selector);
            return result;
        }

        this.iframeType = async function (iframeselector, elemselector, value) {
            await this.page.waitForSelector(iframeselector, { visible: true });
            await this.iframeFocus(iframeselector, elemselector);
            await this.page.type(value);
        }

        this.iframeFocus = async function (iframeselector, elemselector) {
            await this.page.evaluate((data) => {
                const ifrm = document.querySelector(data.iframeselector);
                ifrmdoc = ifrm.contentDocument || ifrm.contentWindow.document;
                if (ifrmdoc.document) ifrmdoc = ifrmdoc.document;
                console.log(ifrmdoc)
                ifrmdoc.querySelector(data.elemselector).focus();
            }, { iframeselector, elemselector });
        }

        this.iframeUploadFile = async function (fileinputselector, filepath) {
            const inputFile = await this.frame.$(fileinputselector);
            await inputFile.uploadFile(filepath);
        }

        this.iframeClickOn = async function (elemselector) {
            await this.frame.evaluate((sel) => {
                document.querySelector(sel).click();
            }, elemselector);
        }

        this.setFrame = function (fnFrameSelector) {
            this.frame = this.page.frames().find(fnFrameSelector);
        }

        this.delay = async function (second) {
            return new Promise(resolve => {
                setTimeout(resolve, second * 1000);
            });
        }

        this.currentHost = function () {
            // Example url: https://stackoverflow.com/questions/6941533/get-protocol-domain-and-port-from-url
            const result = this.page.url().split('/');
            return `${result[0]}//${result[2]}`;
        }

        this.waitForiFrameRendered = async function (ifrmSelector, contentSelector) {
            await this.waitForNavigation('networkidle');
            await this.page.waitForFunction((sel) => {
                let myIframe = document.querySelector(sel.ifrmSelector);
                if (myIframe) {
                    let doc = myIframe.contentWindow || myIframe.contentDocument;
                    if (doc.document) doc = doc.document;
                    if (doc.readyState == "complete" && doc.querySelector(sel.contentSelector)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }, { polling: 300 }, { ifrmSelector, contentSelector })
        }
    }
} 
