var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var SettingsListControl = (function () {
            function SettingsListControl() {
            }
            SettingsListControl.prototype.processed = function (element, options) {
                return this.renderSettings();
            };
            SettingsListControl.prototype.renderSettings = function () {
                var _this = this;
                var settings = Kodi.Settings.list();
                this.availablesettings.innerHTML = "";
                var container = document.createDocumentFragment();
                var servertemplate = new WinJS.Binding.Template(null, { href: "/templates/serveritem.html" });
                var p = [];
                settings.forEach(function (s) {
                    var setting = Kodi.Settings.getSetting(s);
                    p.push(servertemplate.render(setting).then(function (rendered) {
                        var elt = rendered.children[0];
                        var btnedit = elt.querySelector(".btnedit");
                        var btnconnect = elt.querySelector(".btnconnect");
                        var btnwakeup = elt.querySelector(".btnwakeup");
                        WinJSContrib.UI.tap(btnedit, function () {
                            WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { setting: s, navigateStacked: true });
                        });
                        WinJSContrib.UI.tap(btnconnect, function () {
                            return Kodi.API.testServerSetting(setting).then(function (res) {
                                Kodi.API.currentSettings = setting;
                                return KodiPassion.UI.DataLoader.showLoader(true);
                            }, function (err) {
                                console.error(err);
                            });
                        });
                        if (setting.macAddress && setting.macAddress.length) {
                            WinJSContrib.UI.tap(btnwakeup, function () {
                            });
                        }
                        else {
                            btnwakeup.style.display = "none";
                        }
                        container.appendChild(elt);
                        if (Kodi.API.currentSettings && setting.host == Kodi.API.currentSettings.host) {
                            elt.classList.add("current");
                        }
                    }));
                });
                return WinJS.Promise.join(p).then(function () {
                    _this.availablesettings.appendChild(container);
                });
            };
            SettingsListControl.prototype.addSetting = function () {
                WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { navigateStacked: true });
            };
            SettingsListControl.url = "/controls/settingslist/settingslist.html";
            return SettingsListControl;
        })();
        UI.SettingsList = WinJS.UI.Pages.define(SettingsListControl.url, SettingsListControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=settingslist.js.map