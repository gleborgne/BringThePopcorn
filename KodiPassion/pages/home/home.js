var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var HomePage = (function () {
                function HomePage() {
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
                    Kodi.Data.loadRootData().then(function (data) {
                        _this.loadMovies(data);
                        _this.loadTvshows(data);
                    });
                };
                HomePage.prototype.loadMovies = function (data) {
                    var _this = this;
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
                    data.recentMovies.movies.forEach(function (e) {
                        if (!e.lastplayed) {
                            movies[e.movieid] = true;
                        }
                    });
                    var movieslist = data.movies.movies.sort(this.getSortFunction(movies, "movieid"));
                    this.mainsplitview.itemDataSource = new WinJS.Binding.List(movieslist).dataSource;
                };
                HomePage.prototype.loadTvshows = function (data) {
                    var _this = this;
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
                    var tvshowslist = data.tvshows.tvshows.sort(this.getSortFunction(tvshows, "tvshowid"));
                    this.tvshowsflipview.itemDataSource = new WinJS.Binding.List(tvshowslist).dataSource;
                };
                HomePage.prototype.loadAlbums = function (data) {
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
                HomePage.url = "/pages/home/home.html";
                return HomePage;
            })();
            Pages.HomePage = HomePage;
            WinJS.UI.Pages.define(HomePage.url, HomePage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=home.js.map