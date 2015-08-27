module KodiPassion.UI.Pages{
    export class SettingsPage {
        public static url = "/pages/settings/settings.html";

        availablesettings: HTMLElement;

        processed(element, options) {
        }
    }

    WinJS.UI.Pages.define(SettingsPage.url, SettingsPage);
}
