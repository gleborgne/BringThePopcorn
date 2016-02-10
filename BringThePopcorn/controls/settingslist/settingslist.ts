module BtPo.UI {

    export class SettingsListControl {
        public static url = "/controls/settingslist/settingslist.html";

        availablesettings: HTMLElement;
        intervals: number[];
        autoconnect: boolean;

        processed(element, options) {
            if (options)
                this.autoconnect = options.autoconnect || false;

            return this.renderSettings();
        }

        clearIntervals() {
            if (this.intervals) {
                this.intervals.forEach(function (i) {
                    clearInterval(i);
                });
            }
            this.intervals = [];
        }

        public renderSettings() {
            this.clearIntervals();
            var settings = Kodi.Settings.list();
            this.availablesettings.innerHTML = "";
            var container = document.createDocumentFragment();
            var defaultsetting = Kodi.Settings.defaultConnection();
            var servertemplate = new WinJS.Binding.Template(null, { href: "/templates/serveritem.html" });
            var p = [];
            settings.forEach((s) => {
                var setting = Kodi.Settings.getSetting(s);   
                
                var addInterval = () => {
                    if (this.autoconnect) {
                        this.intervals.push(setInterval(() => {
                            return Kodi.API.testServerSetting(setting).then((res) => {
                                this.clearIntervals();
                                Kodi.API.currentSettings = setting;
                                return BtPo.UI.DataLoader.showLoader(true);
                            }, function (err) {
                                console.info(err);
                            });
                        }, 4000));
                    }
                }             

                p.push(servertemplate.render(setting).then((rendered) => {
                    var elt = <HTMLElement>rendered.children[0];
                    var btnedit = <HTMLElement>elt.querySelector(".btnedit");
                    var btnconnect = <HTMLElement>elt.querySelector(".btnconnect");
                    var btnwakeup = <HTMLElement>elt.querySelector(".btnwakeup");
                    var btnremove = <HTMLElement>elt.querySelector(".btnremove");

                    if (s == defaultsetting) {
                        var e = <HTMLElement>elt.querySelector(".name")
                        e.innerText = setting.name + ' (default)';
                        addInterval();
                    }

                    WinJSContrib.UI.tap(btnremove, () => {
                        WinJSContrib.Alerts.confirm("remove server settings", "Do you really want to remove " + setting.name + " ?", "yes", "no").then((confirmed) => {
                            var current = Kodi.API.currentSettings ? Kodi.API.currentSettings.name : null;
                            Kodi.Settings.remove(setting.name);
                            
                            if (current == setting.name) {
                                return WinJS.Navigation.navigate("/pages/startup/startup.html");
                            } else {
                                this.renderSettings();
                            }
                        });
                    });

                    WinJSContrib.UI.tap(btnedit, () => {
                        WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { setting: s, navigateStacked: true });
                    });

                    WinJSContrib.UI.tap(btnconnect, () => {
                        return Kodi.API.testServerSetting(setting).then((res) => {
                            this.clearIntervals();
                            Kodi.API.currentSettings = setting;
                            return BtPo.UI.DataLoader.showLoader(true);
                        }, function (err) {
                            console.error(err);
                            return WinJS.Promise.wrapError(err);
                        });
                    });

                    if (this.isValidMacAddress(setting)) {
                        WinJSContrib.UI.tap(btnwakeup, () => {
                            return Kodi.WOL.wakeUp(setting.macAddress).then(() => {
                                var ctrl = <any>this;
                                ctrl.dispatchEvent("settingslistmessage", { message: "Wake on lan sended to " + setting.name + ". Please wait for your media server to startup" });
                                this.clearIntervals();
                                if (setting.host) {
                                    addInterval();
                                }
                                //WinJSContrib.Alerts.toast("Wake on lan sended to " + setting.name);
                            }, (err) => {
                                console.error(err);
                            });
                        });
                    } else {
                        btnwakeup.style.display = "none";
                    }

                    container.appendChild(elt);

                    if (Kodi.API.currentSettings && setting.name == Kodi.API.currentSettings.name) {
                        elt.classList.add("current");
                    }

                    WinJSContrib.UI.Pages.preload("/pages/settings/serverdetail/serverdetail.html");
                }));
            });

            return WinJS.Promise.join(p).then(() => {
                this.availablesettings.appendChild(container);
            });
        }

        isValidMacAddress(setting: Kodi.Settings.KodiServerSetting) {
            if (setting.macAddress && setting.macAddress.length == 6) {
                var res = true;
                setting.macAddress.forEach((s) => {
                    res = res && <any>s;
                });
                return res;
            } else {
                return false;
            }
        }

        addSetting() {
            WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { navigateStacked: true });
        }

        unload() {
            this.clearIntervals();
        }
    }

    export var SettingsList = WinJS.UI.Pages.define(SettingsListControl.url, SettingsListControl);
}