var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsDetailPage = (function () {
                function AlbumsDetailPage() {
                }
                AlbumsDetailPage.prototype.processed = function (element, options) {
                };
                AlbumsDetailPage.url = "/pages/albums/detail/albumsdetail.html";
                return AlbumsDetailPage;
            })();
            Pages.AlbumsDetailPage = AlbumsDetailPage;
            WinJS.UI.Pages.define(AlbumsDetailPage.url, AlbumsDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=albumsdetail.js.map