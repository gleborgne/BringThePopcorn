module KodiPassion.UI.Pages {

    export class TvShowsListPage {
        public static url = "/pages/tvshows/list/tvshowslist.html";

        processed(element, options) {
        }
    }

    WinJS.UI.Pages.define(TvShowsListPage.url, TvShowsListPage);
}
