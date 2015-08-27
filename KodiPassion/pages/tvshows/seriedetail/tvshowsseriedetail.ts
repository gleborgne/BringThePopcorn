module KodiPassion.UI.Pages {

    export class TvShowsDetailPage {
        public static url = "/pages/tvshows/seriedetail/tvshowsseriedetail.html";

        processed(element, options) {
        }
    }

    WinJS.UI.Pages.define(TvShowsDetailPage.url, TvShowsDetailPage);
}