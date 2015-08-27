module KodiPassion.UI.Pages {

    export class StartUpPage {
        public static url = "/pages/startup/startup.html";

        processed(element, options) {
        }
    }

    WinJS.UI.Pages.define(StartUpPage.url, StartUpPage);
}
