var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            WinJSContrib.Search.workerPath = "/scripts/winjscontrib/js/winjscontrib.search.worker.js";
            var SearchPage = (function () {
                function SearchPage() {
                }
                SearchPage.prototype.init = function (element, options) {
                    this.index = new WinJSContrib.Search.IndexGroup({
                        movies: { useworker: true },
                        tvshows: { useworker: true },
                        music: { useworker: true },
                        artists: { useworker: true },
                    });
                    this.indexReady = this.index.load();
                    this.data = Kodi.Data.loadRootData();
                };
                SearchPage.prototype.processed = function (element, options) {
                    var _this = this;
                    $(this.txtsearch).pressEnterDefaultTo("#btnSearch");
                    this.eventTracker.addEvent(this.txtsearch, "input", function () {
                        _this.search();
                    });
                };
                SearchPage.prototype.ready = function () {
                    var _this = this;
                    setTimeout(function () {
                        _this.txtsearch.focus();
                    }, 300);
                };
                SearchPage.prototype.search = function () {
                    var _this = this;
                    if (this.currentSearch) {
                        this.currentSearch.cancel();
                    }
                    var searchterm = this.txtsearch.value;
                    if (searchterm && searchterm.length > 2) {
                        this.currentSearch = this.indexReady.then(function () {
                            return _this.index.search(searchterm).then(function (searchresult) {
                                if (searchresult && searchresult.allResults) {
                                    return _this.renderSearchResult(searchresult.allResults.slice(0, 20));
                                }
                                else {
                                    _this.resultItems.innerHTML = "";
                                }
                            }, function (err) {
                                var e = err;
                            });
                        });
                    }
                    else {
                        this.resultItems.innerHTML = "";
                    }
                };
                SearchPage.prototype.renderSearchResult = function (searchResult) {
                    var _this = this;
                    this.resultItems.innerHTML = "";
                    return WinJSContrib.Promise.waterfall(searchResult, function (s) {
                        s.label = s.item.label;
                        s.thumbnail = s.item.thumbnail;
                        return KodiPassion.Templates.search.render(s).then(function (rendered) {
                            _this.resultItems.appendChild(rendered);
                            WinJSContrib.UI.tap(rendered, function () {
                                return _this.data.then(function (data) {
                                    return _this.resolveItem(s, data);
                                });
                            });
                        });
                    });
                };
                SearchPage.prototype.resolveItem = function (searchitem, lib) {
                    if (searchitem.searchItemType == "music") {
                        var item = searchitem.item;
                        WinJS.Navigation.navigate("/pages/albums/detail/albumsdetail.html", { album: item, navigateStacked: true });
                    }
                    else if (searchitem.searchItemType == "artists") {
                        WinJS.Navigation.navigate("/pages/albums/list/albumslist.html", { artist: searchitem.item.label });
                    }
                    else if (searchitem.searchItemType == "movies") {
                        var item = searchitem.item;
                        WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item, navigateStacked: true });
                    }
                    else if (searchitem.searchItemType == "tvshows") {
                        var item = searchitem.item;
                        WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item, navigateStacked: true });
                    }
                };
                SearchPage.prototype.unload = function () {
                    this.index.dispose();
                };
                SearchPage.url = "/pages/search/search.html";
                return SearchPage;
            })();
            Pages.SearchPage = SearchPage;
            WinJS.UI.Pages.define(SearchPage.url, SearchPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=search.js.map