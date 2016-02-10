module BtPo.UI.Pages {

    export class StartUpPage {
        public static url = "/pages/startup/startup.html";

        serversettings: BtPo.UI.SettingsListControl;
        eventTracker: WinJSContrib.UI.EventTracker;
        messages: HTMLElement;

        init(element, options) {
            document.body.classList.add("unconnected");
        }

        processed(element, options) {
            this.eventTracker.addEvent(this.serversettings, "settingslistmessage", (arg) => {
                if (arg.detail.message) {
                    this.messages.innerHTML = arg.detail.message;
                }
            });
        }

        ready(element, options) {
        }

        pageNavActivate() {
            this.serversettings.renderSettings();
        }
    }

    WinJS.UI.Pages.define(StartUpPage.url, StartUpPage);
}
