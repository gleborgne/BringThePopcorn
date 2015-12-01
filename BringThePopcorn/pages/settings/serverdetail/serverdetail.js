var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var SettingsServerDetailPage = (function () {
                function SettingsServerDetailPage() {
                }
                Object.defineProperty(SettingsServerDetailPage.prototype, "isDefault", {
                    get: function () {
                        return this.makedefault.checked;
                    },
                    enumerable: true,
                    configurable: true
                });
                SettingsServerDetailPage.prototype.processed = function (element, options) {
                    this.settingName = options.setting;
                    this.setting = Kodi.Settings.getSetting(options.setting) || { name: "new server", host: null, port: 80, user: "", password: "", macAddress: [], };
                    this.settingsForm.setting = this.setting;
                };
                SettingsServerDetailPage.prototype.saveSetting = function () {
                    if (this.settingsForm.validate()) {
                        if (Kodi.API.currentSettings && this.settingName == Kodi.API.currentSettings.name) {
                            Kodi.API.currentSettings = this.settingsForm.setting;
                        }
                        Kodi.Settings.save(this.settingName || this.settingsForm.setting.name, this.settingsForm.setting, this.isDefault);
                        WinJS.Navigation.back();
                    }
                };
                SettingsServerDetailPage.prototype.closeDetail = function () {
                    WinJS.Navigation.back();
                };
                SettingsServerDetailPage.url = "/pages/settings/serverdetail/serverdetail.html";
                return SettingsServerDetailPage;
            })();
            Pages.SettingsServerDetailPage = SettingsServerDetailPage;
            WinJS.UI.Pages.define(SettingsServerDetailPage.url, SettingsServerDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));

//# sourceMappingURL=serverdetail.js.map
