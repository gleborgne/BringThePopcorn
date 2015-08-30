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
                    var _this = this;
                    this.movie = options.movie;
                    this.eventTracker.addEvent(this.scrollContainer, "scroll", function () {
                        cancelAnimationFrame(_this.scrollDelay);
                        _this.scrollDelay = requestAnimationFrame(function () {
                            _this.checkScroll();
                        });
                    });
                    if (this.movie.file) {
                        var path = Kodi.Utils.getNetworkPath(this.movie.file);
                        if (path) {
                            //this.btnDownloadMovie.style.display = "";
                            this.btnPlayMovieLocal.style.display = "";
                        }
                    }
                    Kodi.API.Videos.Movies.getMovieDetails(this.movie.movieid).then(function (detail) {
                        if (detail.moviedetails.resume && detail.moviedetails.resume.position) {
                            _this.btnResumeMovie.style.display = "";
                        }
                    }, function (err) {
                        var e = err;
                    });
                    return WinJS.Binding.processAll(element, options.movie);
                };
                MovieDetailPage.prototype.checkScroll = function () {
                    var h = this.headerbanner.clientHeight;
                    var posterinbanner = this.visualstate.states.medium.active;
                    if (!posterinbanner && this.headerposter.style.opacity) {
                        this.headerposter.style.opacity = '';
                    }
                    var dif = (h - this.scrollContainer.scrollTop);
                    if (dif < 0) {
                        if (this.headerbanner.style.opacity != '0') {
                            this.headerbanner.style.opacity = '0';
                        }
                        if (posterinbanner && this.headerposter.style.opacity != '0') {
                            this.headerposter.style.opacity = '0';
                        }
                    }
                    else {
                        var val = (dif / h) + '';
                        this.headerbanner.style.opacity = val;
                        if (posterinbanner) {
                            this.headerposter.style.opacity = val;
                        }
                    }
                };
                MovieDetailPage.prototype.resumeMovie = function () {
                    return Kodi.API.Videos.Movies.playMovie(this.movie.movieid, true).then(function (res) {
                        console.log(res);
                    }, function (err) {
                        console.error(err);
                    });
                };
                MovieDetailPage.prototype.playMovie = function () {
                    return Kodi.API.Videos.Movies.playMovie(this.movie.movieid).then(function (res) {
                        console.log(res);
                    }, function (err) {
                        console.error(err);
                    });
                };
                MovieDetailPage.prototype.playMovieLocal = function () {
                    return Kodi.App.playLocalMedia(this.movie.file);
                };
                MovieDetailPage.prototype.downloadMovie = function () {
                };
                MovieDetailPage.prototype.updateLayout = function () {
                    this.checkScroll();
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