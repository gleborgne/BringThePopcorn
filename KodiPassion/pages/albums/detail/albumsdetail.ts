module KodiPassion.UI.Pages {

    export class AlbumsDetailPage {
        public static url = "/pages/albums/detail/albumsdetail.html";

        processed(element, options) {
        }
    }

    WinJS.UI.Pages.define(AlbumsDetailPage.url, AlbumsDetailPage);
}