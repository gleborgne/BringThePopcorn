module KodiPassion.UI.Pages {

    export class AlbumsDetailPage {
        public static url = "/pages/albums/detail/albumsdetail.html";

        element: HTMLElement;
         album: Kodi.API.Music.Album;
        albumSongs: HTMLElement;

        processed(element, options) {
            this.album = options.album;
            WinJS.Binding.processAll(element, this.album);
            Kodi.API.Music.albumSongs(this.album.albumid).then((songs) => {
                WinJS.Promise.timeout(300).then(() => {
                    this.renderSongs(songs.songs);
                });
            })
        }

        renderSongs(songs: Kodi.API.Music.Song[]) {
            if (songs) {
                var container = document.createDocumentFragment();
                var p = [];
                var elts = [];
                songs.forEach((s) => {
                    p.push(KodiPassion.Templates.song.render(s).then((rendered) => {
                        rendered.style.opacity = "0";
                        elts.push(rendered);
                        container.appendChild(rendered);

                        var btnplay = rendered.querySelector(".kdp-play");
                        var btnadd = rendered.querySelector(".kdp-add");

                        WinJSContrib.UI.tap(btnplay, () => {
                            return Kodi.API.Music.playSong(s.songid);
                        });

                        WinJSContrib.UI.tap(btnadd, () => {
                            return Kodi.API.Music.queueSong(s.songid);
                        });
                    }));
                });

                WinJS.Promise.join(p).then(() => {
                    this.albumSongs.appendChild(container);
                    WinJS.UI.Animation.enterPage(elts);
                });
            }
        }

        addAlbum() {
            return Kodi.API.Music.queueAlbum(this.album.albumid);
        }

        playAlbum() {
            return Kodi.API.Music.playAlbum(this.album.albumid);
        }
    }

    WinJS.UI.Pages.define(AlbumsDetailPage.url, AlbumsDetailPage);
}