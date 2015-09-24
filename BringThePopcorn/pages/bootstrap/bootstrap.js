var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var BootstrapPage = (function () {
                function BootstrapPage() {
                }
                BootstrapPage.prototype.init = function () {
                    document.body.classList.add("unconnected");
                };
                BootstrapPage.prototype.processed = function (element, options) {
                    var page = this;
                    page.defaultname = Kodi.Settings.defaultConnection();
                    page.settingsForm.setting = Kodi.Settings.getSetting(page.defaultname);
                };
                BootstrapPage.prototype.testConnection = function () {
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
                };
                BootstrapPage.url = "/pages/bootstrap/bootstrap.html";
                return BootstrapPage;
            })();
            Pages.BootstrapPage = BootstrapPage;
            WinJS.UI.Pages.define(BootstrapPage.url, BootstrapPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
