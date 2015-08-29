module KodiPassion.UI {

    class SettingsListControl {
        public static url = "/controls/settingslist/settingslist.html";

        availablesettings: HTMLElement;

        processed(element, options) {
            return this.renderSettings();
        }

        renderSettings() {
            var settings = Kodi.Settings.list();
            this.availablesettings.innerHTML = "";
            var container = document.createDocumentFragment();
            var defaultsetting = Kodi.Settings.defaultConnection();
            var servertemplate = new WinJS.Binding.Template(null, { href: "/templates/serveritem.html" });
            var p = [];
            settings.forEach((s) => {
                var setting = Kodi.Settings.getSetting(s);

                p.push(servertemplate.render(setting).then((rendered) => {
                    var elt = <HTMLElement>rendered.children[0];
                    var btnedit = <HTMLElement>elt.querySelector(".btnedit");
                    var btnconnect = <HTMLElement>elt.querySelector(".btnconnect");
                    var btnwakeup = <HTMLElement>elt.querySelector(".btnwakeup");

                    if (s == defaultsetting) {
                        var e = <HTMLElement>elt.querySelector(".name")
                        e.innerText = setting.name + ' (default)';
                    }

                    WinJSContrib.UI.tap(btnedit, () => {
                        WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { setting: s, navigateStacked: true });
                    });

                    WinJSContrib.UI.tap(btnconnect, () => {
                        return Kodi.API.testServerSetting(setting).then((res) => {
                            Kodi.API.currentSettings = setting;

                            return KodiPassion.UI.DataLoader.showLoader(true);
                        }, function (err) {
                            console.error(err);
                        });
                    });

                    if (setting.macAddress && setting.macAddress.length) {
                        WinJSContrib.UI.tap(btnwakeup, () => {
                        });
                    } else {
                        btnwakeup.style.display = "none";
                    }

                    container.appendChild(elt);

                    if (Kodi.API.currentSettings && setting.host == Kodi.API.currentSettings.host) {
                        elt.classList.add("current");
                    }
                }));
            });

            return WinJS.Promise.join(p).then(() => {
                this.availablesettings.appendChild(container);
            });
        }

        addSetting() {
            WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { navigateStacked: true });
        }
    }

    export var SettingsList = WinJS.UI.Pages.define(SettingsListControl.url, SettingsListControl);
}