declare module BtPo.UI {
    var DataLoader: any;
}

module BtPo.UI.Pages{
    export class BootstrapPage {
        public static url = "/pages/bootstrap/bootstrap.html";
        defaultname: string;
        messages: HTMLElement;
        settingsForm: any;

        init() {
            document.body.classList.add("unconnected");
        }

        processed(element, options) {
            var page = this;
            page.defaultname = Kodi.Settings.defaultConnection();

            page.settingsForm.setting = Kodi.Settings.getSetting(page.defaultname);
        }

        testConnection() {
            var page = this;
            page.messages.innerHTML = "";
            if (page.settingsForm.validate()) {
                var setting = page.settingsForm.setting;
                return Kodi.API.testServerSetting(setting).then(function () {
                    Kodi.Settings.save(page.defaultname, setting, true);
                    Kodi.API.currentSettings = setting;
                    return BtPo.UI.DataLoader.showLoader(true);
                }, function () {
                    page.messages.innerText = "Server cannot be reached. Please verify that your Kodi or XBMC is running and check it's configuration. Also check your network settings like firewall configuration";
                });
            }
        }
    }

    WinJS.UI.Pages.define(BootstrapPage.url, BootstrapPage);
}
