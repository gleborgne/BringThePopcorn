var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var SettingsServerDetailPage = (function () {
                function SettingsServerDetailPage() {
                }
                SettingsServerDetailPage.prototype.processed = function (element, options) {
                    this.settingName = options.setting;
                    this.setting = Kodi.Settings.getSetting(options.setting) || { name: "new server", host: null, port: 80, user: "", password: "", macAddress: [], };
                    this.settingsForm.setting = this.setting;
                };
                SettingsServerDetailPage.prototype.saveSetting = function () {
                    if (this.settingsForm.validate()) {
                        Kodi.Settings.save(this.settingName || this.settingsForm.setting.name, this.settingsForm.setting, false);
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
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=serverdetail.js.map