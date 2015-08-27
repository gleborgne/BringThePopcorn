var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var TvShowsDetailPage = (function () {
                function TvShowsDetailPage() {
                }
                TvShowsDetailPage.prototype.processed = function (element, options) {
                };
                TvShowsDetailPage.url = "/pages/tvshows/seriedetail/tvshowsseriedetail.html";
                return TvShowsDetailPage;
            })();
            Pages.TvShowsDetailPage = TvShowsDetailPage;
            WinJS.UI.Pages.define(TvShowsDetailPage.url, TvShowsDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=tvshowsseriedetail.js.map