var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var actortemplate = new WinJS.Binding.Template(null, { href: '/templates/actor.html', extractChild: true });
            var MovieDetailPage = (function () {
                function MovieDetailPage() {
                }
                MovieDetailPage.prototype.processed = function (element, options) {
                    var _this = this;
                    this.movie = options.movie;
                    this.element.id = "page-" + WinJSContrib.Utils.guid();
                    this.actorsAspectRatio.prefix = "#" + this.element.id + " .page-moviesdetail";
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
                    var p = [];
                    var bindables = this.element.querySelectorAll(".moviebinding");
                    for (var i = 0, l = bindables.length; i < l; i++) {
                        p.push(WinJS.Binding.processAll(bindables[i], options.movie));
                    }
                    return WinJS.Promise.join(p);
                };
                MovieDetailPage.prototype.ready = function (element, options) {
                    var _this = this;
                    setTimeout(function () {
                        _this.renderCast();
                    }, 400);
                };
                MovieDetailPage.prototype.renderCast = function () {
                    var _this = this;
                    var container = document.createDocumentFragment();
                    var p = [];
                    var items = [];
                    this.movie.cast.slice(0, 20).forEach(function (c) {
                        p.push(actortemplate.render(c).then(function (rendered) {
                            rendered.style.opacity = '0';
                            items.push(rendered);
                            container.appendChild(rendered);
                        }));
                    });
                    WinJS.Promise.join(p).then(function () {
                        _this.castItems.appendChild(container);
                        WinJS.UI.Animation.enterPage(items);
                    });
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
                        var val = (dif / h).toFixed(2) + '';
                        if (this.headerbanner.style.opacity != val) {
                            this.headerbanner.style.opacity = val;
                            if (posterinbanner) {
                                this.headerposter.style.opacity = val;
                            }
                        }
                    }
                };
                MovieDetailPage.prototype.resumeMovie = function () {
                    return Kodi.API.Videos.Movies.playMovie(this.movie.movieid, true);
                };
                MovieDetailPage.prototype.playMovie = function () {
                    return Kodi.API.Videos.Movies.playMovie(this.movie.movieid);
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
            Pages.MovieDetail = WinJS.UI.Pages.define(MovieDetailPage.url, MovieDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
//# sourceMappingURL=moviesdetail.js.map