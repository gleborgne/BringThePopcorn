var BtPo;
(function (BtPo) {
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
                                    return BtPo.UI.DataLoader.showLoader(true);
                                }, function (err) {
                                    console.info(err);
                                });
                            }, 4000));
                        }
                    };
                    p.push(servertemplate.render(setting).then(function (rendered) {
                        var elt = rendered.children[0];
                        var btnedit = elt.querySelector(".btnedit");
                        var btnconnect = elt.querySelector(".btnconnect");
                        var btnwakeup = elt.querySelector(".btnwakeup");
                        var btnremove = elt.querySelector(".btnremove");
                        if (s == defaultsetting) {
                            var e = elt.querySelector(".name");
                            e.innerText = setting.name + ' (default)';
                            addInterval();
                        }
                        WinJSContrib.UI.tap(btnremove, function () {
                            WinJSContrib.Alerts.confirm("remove server settings", "Do you really want to remove " + setting.name + " ?", "yes", "no").then(function (confirmed) {
                                var current = Kodi.API.currentSettings ? Kodi.API.currentSettings.name : null;
                                Kodi.Settings.remove(setting.name);
                                if (current == setting.name) {
                                    return WinJS.Navigation.navigate("/pages/startup/startup.html");
                                }
                                else {
                                    _this.renderSettings();
                                }
                            });
                        });
                        WinJSContrib.UI.tap(btnedit, function () {
                            WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { setting: s, navigateStacked: true });
                        });
                        WinJSContrib.UI.tap(btnconnect, function () {
                            return Kodi.API.testServerSetting(setting).then(function (res) {
                                _this.clearIntervals();
                                Kodi.API.currentSettings = setting;
                                return BtPo.UI.DataLoader.showLoader(true);
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
                                }, function (err) {
                                    console.error(err);
                                });
                            });
                        }
                        else {
                            btnwakeup.style.display = "none";
                        }
                        container.appendChild(elt);
                        if (Kodi.API.currentSettings && setting.name == Kodi.API.currentSettings.name) {
                            elt.classList.add("current");
                        }
                        WinJSContrib.UI.Pages.preload("/pages/settings/serverdetail/serverdetail.html");
                    }));
                });
                return WinJS.Promise.join(p).then(function () {
                    _this.availablesettings.appendChild(container);
                });
            };
            SettingsListControl.prototype.isValidMacAddress = function (setting) {
                if (setting.macAddress && setting.macAddress.length == 6) {
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
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));

//# sourceMappingURL=../../../BringThePopcorn/controls/settingslist/settingslist.js.map