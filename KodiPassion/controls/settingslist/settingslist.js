var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var SettingsListControl = (function () {
            function SettingsListControl() {
            }
            SettingsListControl.prototype.processed = function (element, options) {
                if (options)
                    this.autoconnect = options.autoconnect || false;
                return this.renderSettings();
            };
            SettingsListControl.prototype.clearIntervals = function () {
                if (this.intervals) {
                    this.intervals.forEach(function (i) {
                        clearInterval(i);
                    });
                }
                this.intervals = [];
            };
            SettingsListControl.prototype.renderSettings = function () {
                var _this = this;
                this.clearIntervals();
                var settings = Kodi.Settings.list();
                this.availablesettings.innerHTML = "";
                var container = document.createDocumentFragment();
                var defaultsetting = Kodi.Settings.defaultConnection();
                var servertemplate = new WinJS.Binding.Template(null, { href: "/templates/serveritem.html" });
                var p = [];
                settings.forEach(function (s) {
                    var setting = Kodi.Settings.getSetting(s);
                    var addInterval = function () {
                        if (_this.autoconnect) {
                            _this.intervals.push(setInterval(function () {
                                return Kodi.API.testServerSetting(setting).then(function (res) {
                                    _this.clearIntervals();
                                    Kodi.API.currentSettings = setting;
                                    return KodiPassion.UI.DataLoader.showLoader(true);
                                }, function (err) {
                                    console.error(err);
                                });
                            }, 4000));
                        }
                    };
                    p.push(servertemplate.render(setting).then(function (rendered) {
                        var elt = rendered.children[0];
                        var btnedit = elt.querySelector(".btnedit");
                        var btnconnect = elt.querySelector(".btnconnect");
                        var btnwakeup = elt.querySelector(".btnwakeup");
                        if (s == defaultsetting) {
                            var e = elt.querySelector(".name");
                            e.innerText = setting.name + ' (default)';
                            addInterval();
                        }
                        WinJSContrib.UI.tap(btnedit, function () {
                            WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { setting: s, navigateStacked: true });
                        });
                        WinJSContrib.UI.tap(btnconnect, function () {
                            return Kodi.API.testServerSetting(setting).then(function (res) {
                                _this.clearIntervals();
                                Kodi.API.currentSettings = setting;
                                return KodiPassion.UI.DataLoader.showLoader(true);
                            }, function (err) {
                                console.error(err);
                                return WinJS.Promise.wrapError(err);
                            });
                        });
                        if (_this.isValidMacAddress(setting)) {
                            WinJSContrib.UI.tap(btnwakeup, function () {
                                return Kodi.WOL.wakeUp(setting.macAddress).then(function () {
                                    var ctrl = _this;
                                    ctrl.dispatchEvent("settingslistmessage", { message: "Wake on lan sended to " + setting.name + ". Please wait for your media server to startup" });
                                    _this.clearIntervals();
                                    if (setting.host) {
                                        addInterval();
                                    }
                                    //WinJSContrib.Alerts.toast("Wake on lan sended to " + setting.name);
                                });
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
            SettingsListControl.prototype.isValidMacAddress = function (setting) {
                if (setting.macAddress && setting.macAddress.length) {
                    var res = true;
                    setting.macAddress.forEach(function (s) {
                        res = res && s;
                    });
                    return res;
                }
                else {
                    return false;
                }
            };
            SettingsListControl.prototype.addSetting = function () {
                WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { navigateStacked: true });
            };
            SettingsListControl.prototype.unload = function () {
                this.clearIntervals();
            };
            SettingsListControl.url = "/controls/settingslist/settingslist.html";
            return SettingsListControl;
        })();
        UI.SettingsListControl = SettingsListControl;
        UI.SettingsList = WinJS.UI.Pages.define(SettingsListControl.url, SettingsListControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=settingslist.js.map