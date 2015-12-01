var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsDetailPage = (function () {
                function AlbumsDetailPage() {
                }
                AlbumsDetailPage.prototype.processed = function (element, options) {
                    var _this = this;
                    this.album = options.album;
                    WinJS.Binding.processAll(element, this.album);
                    Kodi.API.Music.albumSongs(this.album.albumid).then(function (songs) {
                        WinJS.Promise.timeout(300).then(function () {
                            _this.renderSongs(songs.songs);
                        });
                    });
                };
                AlbumsDetailPage.prototype.renderSongs = function (songs) {
                    var _this = this;
                    if (songs) {
                        var container = document.createDocumentFragment();
                        var p = [];
                        var elts = [];
                        songs.forEach(function (s) {
                            p.push(BtPo.Templates.song.render(s).then(function (rendered) {
                                rendered.style.opacity = "0";
                                elts.push(rendered);
                                container.appendChild(rendered);
                                var btnplay = rendered.querySelector(".btpo-play");
                                var btnadd = rendered.querySelector(".btpo-add");
                                WinJSContrib.UI.tap(btnplay, function () {
                                    return Kodi.API.Music.playSong(s.songid);
                                });
                                WinJSContrib.UI.tap(btnadd, function () {
                                    return Kodi.API.Music.queueSong(s.songid);
                                });
                            }));
                        });
                        WinJS.Promise.join(p).then(function () {
                            _this.albumSongs.appendChild(container);
                            WinJS.UI.Animation.enterPage(elts);
                        });
                    }
                };
                AlbumsDetailPage.prototype.addAlbum = function () {
                    return Kodi.API.Music.queueAlbum(this.album.albumid);
                };
                AlbumsDetailPage.prototype.playAlbum = function () {
                    return Kodi.API.Music.playAlbum(this.album.albumid);
                };
                AlbumsDetailPage.url = "/pages/albums/detail/albumsdetail.html";
                return AlbumsDetailPage;
            })();
            Pages.AlbumsDetailPage = AlbumsDetailPage;
            WinJS.UI.Pages.define(AlbumsDetailPage.url, AlbumsDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));

//# sourceMappingURL=albumsdetail.js.map
