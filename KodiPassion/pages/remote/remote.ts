module KodiPassion.UI.Pages {

    export class RemoteControlPage {
        public static url = "/pages/remote/remote.html";

        processed(element, options) {
        }
    }

    WinJS.UI.Pages.define(RemoteControlPage.url, RemoteControlPage);
}
