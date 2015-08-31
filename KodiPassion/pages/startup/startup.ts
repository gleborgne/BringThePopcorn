module KodiPassion.UI.Pages {

    export class StartUpPage {
        public static url = "/pages/startup/startup.html";

        serversettings: KodiPassion.UI.SettingsListControl;
        eventTracker: WinJSContrib.UI.EventTracker;
        messages: HTMLElement;

        processed(element, options) {
            this.eventTracker.addEvent(this.serversettings, "settingslistmessage", (arg) => {
                if (arg.detail.message) {
                    this.messages.innerHTML = arg.detail.message;
                }
            });
        }

        pageNavActivate() {
            this.serversettings.renderSettings();
        }
    }

    WinJS.UI.Pages.define(StartUpPage.url, StartUpPage);
}
