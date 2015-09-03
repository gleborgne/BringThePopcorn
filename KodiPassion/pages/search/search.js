var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var SearchPage = (function () {
                function SearchPage() {
                }
                SearchPage.prototype.processed = function (element, options) {
                };
                SearchPage.url = "/pages/search/search.html";
                return SearchPage;
            })();
            Pages.SearchPage = SearchPage;
            WinJS.UI.Pages.define(SearchPage.url, SearchPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=search.js.map