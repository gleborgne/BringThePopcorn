module KodiPassion.UI.Pages {

    export class SettingsServerDetailPage {
        public static url = "/pages/settings/serverdetail/serverdetail.html";

        setting: Kodi.Settings.KodiServerSetting;
        
        settingName: string;
        makedefault: HTMLInputElement;
        settingsForm: any;

        get isDefault(): boolean {
            return this.makedefault.checked;
        }

        processed(element, options) {
            this.settingName = options.setting;
            this.setting = Kodi.Settings.getSetting(options.setting) || { name: "new server", host: null, port: 80, user: "", password: "", macAddress: [],  };
            this.settingsForm.setting = this.setting;
        }

        saveSetting() {
            if (this.settingsForm.validate()) {
                Kodi.Settings.save(this.settingName || this.settingsForm.setting.name, this.settingsForm.setting, this.isDefault);
                WinJS.Navigation.back();
            }
        }

        closeDetail() {
            WinJS.Navigation.back();
        }
    }

    WinJS.UI.Pages.define(SettingsServerDetailPage.url, SettingsServerDetailPage);
}
