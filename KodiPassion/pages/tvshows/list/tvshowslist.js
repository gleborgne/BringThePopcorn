var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var TvShowsListPage = (function () {
                function TvShowsListPage() {
                }
                TvShowsListPage.prototype.processed = function (element, options) {
                };
                TvShowsListPage.url = "/pages/tvshows/list/tvshowslist.html";
                return TvShowsListPage;
            })();
            Pages.TvShowsListPage = TvShowsListPage;
            WinJS.UI.Pages.define(TvShowsListPage.url, TvShowsListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=tvshowslist.js.map