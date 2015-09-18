var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var HomePage = (function () {
                function HomePage() {
                    this.allowAutoFlip = true;
                }
                HomePage.prototype.processed = function (element, options) {
                    var _this = this;
                    var page = this;
                    //Kodi.API.introspect().then(function (api) {
                    //    Windows.Storage.ApplicationData.current.localFolder.createFileAsync("kodiapi.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                    //        console.log("kodi api details at " + file.path);
                    //        return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(api));
                    //    });
                    //});        
                    var registerpointerdown = page.eventTracker.addEvent(page.element, "pointerdown", function () {
                        _this.allowAutoFlip = false;
                        registerpointerdown();
                    }, true);
                    Kodi.Data.loadRootData().then(function (data) {
                        page.data = data;
                        _this.loadMovies(data);
                        _this.loadTvshows(data);
                        _this.loadAlbums(data);
                    });
                };
                HomePage.prototype.flipMovies = function () {
                    var _this = this;
                    if (this.allowAutoFlip) {
                        this.mainsplitview.itemDataSource.getCount().then(function (nbitems) {
                            if (_this.mainsplitview.currentPage < nbitems - 1) {
                                _this.mainsplitview.currentPage = _this.mainsplitview.currentPage + 1;
                            }
                            else {
                                _this.mainsplitview.currentPage = 0;
                            }
                        });
                        setTimeout(function () {
                            _this.flipMovies();
                        }, 7000);
                    }
                };
                HomePage.prototype.flipTvshows = function () {
                    var _this = this;
                    if (this.allowAutoFlip) {
                        this.tvshowsflipview.itemDataSource.getCount().then(function (nbitems) {
                            if (_this.tvshowsflipview.currentPage < nbitems - 1) {
                                _this.tvshowsflipview.currentPage = _this.tvshowsflipview.currentPage + 1;
                            }
                            else {
                                _this.tvshowsflipview.currentPage = 0;
                            }
                        });
                        setTimeout(function () {
                            _this.flipTvshows();
                        }, 7000);
                    }
                };
                HomePage.prototype.loadMovies = function (data) {
                    var _this = this;
                    if (data.movies && data.movies.movies) {
                        this.flipviewtemplate = new WinJS.Binding.Template(null, { href: '/templates/moviesplitview.html', extractChild: true });
                        this.mainsplitview.itemTemplate = function (itemPromise) {
                            return itemPromise.then(function (item) {
                                return _this.flipviewtemplate.render(item.data).then(function (rendered) {
                                    WinJSContrib.UI.tap(rendered, function (elt) {
                                        if (!_this.element.classList.contains("inactive")) {
                                            WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                                        }
                                    }, { disableAnimation: true });
                                    return rendered;
                                });
                            });
                        };
                        var movies = {};
                        if (data.recentMovies && data.recentMovies.movies) {
                            data.recentMovies.movies.forEach(function (e) {
                                if (!e.lastplayed) {
                                    movies[e.movieid] = true;
                                }
                            });
                        }
                        var movieslist = data.movies.movies.slice(0, data.movies.movies.length);
                        movieslist = movieslist.sort(this.getSortFunction(movies, "movieid"));
                        this.mainsplitview.itemDataSource = new WinJS.Binding.List(movieslist).dataSource;
                        setTimeout(function () {
                            _this.flipMovies();
                        }, 4000);
                    }
                    else {
                        this.moviesbloc.style.display = "none";
                    }
                };
                HomePage.prototype.loadTvshows = function (data) {
                    var _this = this;
                    if (data.tvshows && data.tvshows.tvshows) {
                        this.tvshowsflipview.itemTemplate = function (itemPromise) {
                            return itemPromise.then(function (item) {
                                return _this.flipviewtemplate.render(item.data).then(function (rendered) {
                                    WinJSContrib.UI.tap(rendered, function (elt) {
                                        if (!_this.element.classList.contains("inactive")) {
                                            WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item.data, navigateStacked: true });
                                        }
                                    }, { disableAnimation: true });
                                    return rendered;
                                });
                            });
                        };
                        var tvshows = {};
                        data.tvshowRecentEpisodes.episodes.forEach(function (e) {
                            if (!e.lastplayed && !tvshows[e.tvshowid]) {
                                tvshows[e.tvshowid] = true;
                            }
                        });
                        var tvshowslist = data.tvshows.tvshows.slice(0, data.tvshows.tvshows.length);
                        tvshowslist = tvshowslist.sort(this.getSortFunction(tvshows, "tvshowid"));
                        this.tvshowsflipview.itemDataSource = new WinJS.Binding.List(tvshowslist).dataSource;
                        setTimeout(function () {
                            _this.flipTvshows();
                        }, 5000);
                    }
                    else {
                        this.tvshowsbloc.style.display = "none";
                    }
                };
                HomePage.prototype.loadAlbums = function (data) {
                    var _this = this;
                    if (data.music && data.music.albums) {
                        var container = document.createDocumentFragment();
                        var p = [];
                        data.recentMusic.albums.slice(0, 12).forEach(function (a) {
                            p.push(BtPo.Templates.album.render(a).then(function (rendered) {
                                container.appendChild(rendered);
                                WinJSContrib.UI.tap(rendered, function () {
                                    WinJS.Navigation.navigate("/pages/albums/detail/albumsdetail.html", { album: a, navigateStacked: true });
                                });
                            }));
                        });
                        WinJS.Promise.join(p).then(function () {
                            _this.albumscontainer.appendChild(container);
                        });
                    }
                    else {
                        this.musicbloc.style.display = "none";
                    }
                };
                HomePage.prototype.getSortFunction = function (catalog, fieldname) {
                    var calcpoints = function (item) {
                        var p = item.rating;
                        if (catalog[item[fieldname]])
                            p += 10000;
                        if (!item.lastplayed)
                            p += 5000;
                        return p;
                    };
                    return function (a, b) {
                        var aPoints = calcpoints(a);
                        var bPoints = calcpoints(b);
                        if (aPoints > bPoints)
                            return -1;
                        if (aPoints < bPoints)
                            return 1;
                        if (a.lastplayed < b.lastplayed) {
                            return -1;
                        }
                        else if (a.lastplayed > b.lastplayed) {
                            return 1;
                        }
                        if (a.playcount < b.playcount) {
                            return -1;
                        }
                        else if (a.playcount > b.playcount) {
                            return 1;
                        }
                    };
                };
                HomePage.prototype.scanVideos = function () {
                    Kodi.API.Videos.Movies.scan();
                };
                HomePage.prototype.cleanVideos = function () {
                    Kodi.API.Videos.Movies.clean();
                };
                HomePage.prototype.moviesGenres = function () {
                    if (this.data && this.data.movieGenres && this.data.movieGenres.genres) {
                        BtPo.UI.GenrePicker.pick(this.data.movieGenres.genres).then(function (genre) {
                            if (genre) {
                                if (genre === "all") {
                                    WinJS.Navigation.navigate("/pages/movies/list/movieslist.html");
                                }
                                else {
                                    WinJS.Navigation.navigate("/pages/movies/list/movieslist.html", { genre: genre.label });
                                }
                            }
                        });
                    }
                };
                HomePage.prototype.tvshowsGenres = function () {
                    if (this.data && this.data.tvshowGenres && this.data.tvshowGenres.genres) {
                        BtPo.UI.GenrePicker.pick(this.data.tvshowGenres.genres).then(function (genre) {
                            if (genre) {
                                if (genre === "all") {
                                    WinJS.Navigation.navigate("/pages/tvshows/list/tvshowslist.html");
                                }
                                else {
                                    WinJS.Navigation.navigate("/pages/tvshows/list/tvshowslist.html", { genre: genre.label });
                                }
                            }
                        });
                    }
                };
                HomePage.prototype.albumsGenres = function () {
                    if (this.data && this.data.tvshowGenres && this.data.tvshowGenres.genres) {
                        BtPo.UI.GenrePicker.pick(this.data.musicGenres.genres).then(function (genre) {
                            if (genre) {
                                if (genre === "all") {
                                    WinJS.Navigation.navigate("/pages/albums/list/albumslist.html");
                                }
                                else {
                                    WinJS.Navigation.navigate("/pages/albums/list/albumslist.html", { genre: genre.label });
                                }
                            }
                        });
                    }
                };
                HomePage.prototype.unload = function () {
                    this.allowAutoFlip = false;
                };
                HomePage.url = "/pages/home/home.html";
                return HomePage;
            })();
            Pages.HomePage = HomePage;
            WinJS.UI.Pages.define(HomePage.url, HomePage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
//# sourceMappingURL=home.js.map