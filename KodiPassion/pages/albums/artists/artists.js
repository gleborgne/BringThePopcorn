var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsArtistsPage = (function () {
                function AlbumsArtistsPage() {
                }
                AlbumsArtistsPage.prototype.processed = function (element, options) {
                };
                AlbumsArtistsPage.url = "/pages/albums/artists/artists.html";
                return AlbumsArtistsPage;
            })();
            Pages.AlbumsArtistsPage = AlbumsArtistsPage;
            WinJS.UI.Pages.define(AlbumsArtistsPage.url, AlbumsArtistsPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
