var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsListPage = (function () {
                function AlbumsListPage() {
                }
                AlbumsListPage.prototype.processed = function (element, options) {
                };
                AlbumsListPage.url = "/pages/albums/list/albumslist.html";
                return AlbumsListPage;
            })();
            Pages.AlbumsListPage = AlbumsListPage;
            WinJS.UI.Pages.define(AlbumsListPage.url, AlbumsListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=albumslist.js.map