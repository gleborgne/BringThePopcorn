module KodiPassion.UI.Pages {

    export class AlbumsListPage {
        public static url = "/pages/albums/list/albumslist.html";

        processed(element, options) {
        }
    }

    WinJS.UI.Pages.define(AlbumsListPage.url, AlbumsListPage);
}