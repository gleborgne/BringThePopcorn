module KodiPassion.UI.Pages{
    export class SettingsPage {
        public static url = "/pages/settings/settings.html";

        availablesettings: HTMLElement;
        serversettings: KodiPassion.UI.SettingsListControl;

        processed(element, options) {
        }

        pageNavActivate() {
            this.serversettings.renderSettings();
        }
    }

    WinJS.UI.Pages.define(SettingsPage.url, SettingsPage);
}
