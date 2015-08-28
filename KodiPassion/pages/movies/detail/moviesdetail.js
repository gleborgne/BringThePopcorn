var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var MovieDetailPage = (function () {
                function MovieDetailPage() {
                }
                MovieDetailPage.prototype.processed = function (element, options) {
                    this.movie = options.movie;
                    if (this.movie.file) {
                        var path = Kodi.Utils.getNetworkPath(this.movie.file);
                        if (path) {
                            this.btnDownloadMovie.style.display = "";
                            this.btnPlayMovieLocal.style.display = "";
                        }
                    }
                    return WinJS.Binding.processAll(element, options.movie);
                };
                MovieDetailPage.prototype.playMovie = function () {
                    return Kodi.API.Videos.Movies.playMovie(this.movie.movieid).then(function (res) {
                        console.log(res);
                    }, function (err) {
                        console.error(err);
                    });
                };
                MovieDetailPage.prototype.playMovieLocal = function () {
                    var _this = this;
                    return new WinJS.Promise(function (complete, error) {
                        var path = Kodi.Utils.getNetworkPath(_this.movie.file);
                        var uri = new Windows.Foundation.Uri(path);
                        var opt = new Windows.System.LauncherOptions();
                        opt.desiredRemainingView = (Windows.UI.ViewManagement).ViewSizePreference.useNone;
                        Windows.System.Launcher.launchUriAsync(uri, opt).done(function (a) {
                            if (a == true) {
                                complete();
                            }
                            else {
                                complete();
                                WinJSContrib.Alerts.message('unable to play media', 'cannot play this media. Check the network path you set in your Kodi/XBMC (due to Windows constraints, path with server IP will not work, use server name instead within your media server)');
                            }
                        }, error);
                    });
                };
                MovieDetailPage.prototype.downloadMovie = function () {
                };
                MovieDetailPage.url = "/pages/movies/detail/moviesdetail.html";
                return MovieDetailPage;
            })();
            Pages.MovieDetailPage = MovieDetailPage;
            WinJS.UI.Pages.define(MovieDetailPage.url, MovieDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=moviesdetail.js.map