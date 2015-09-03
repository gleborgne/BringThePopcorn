module KodiPassion.UI.Pages {

    export class SearchPage {
        public static url = "/pages/search/search.html";

        processed(element, options) {
        }
    }

    WinJS.UI.Pages.define(SearchPage.url, SearchPage);
}