module BtPo.UI.Pages{
    export class SettingsPage {
        public static url = "/pages/settings/settings.html";

        availablesettings: HTMLElement;
        serversettings: BtPo.UI.SettingsListControl;

        processed(element, options) {
        }

        pageNavActivate() {
            this.serversettings.renderSettings();
        }
    }

    WinJS.UI.Pages.define(SettingsPage.url, SettingsPage);
}
