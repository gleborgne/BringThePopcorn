var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var TvShowsListPage = (function () {
                function TvShowsListPage() {
                }
                TvShowsListPage.prototype.init = function (element, options) {
                    this.filterByPlayed = false;
                    element.classList.add("listpage");
                    element.classList.add("page-tvshowslist");
                    this.itemsPromise = Kodi.Data.loadRootData();
                    this.viewSetting = {
                        group: "none",
                        view: "poster"
                    };
                    var s = localStorage["tvshowsListView"];
                    if (s) {
                        this.viewSetting = JSON.parse(s);
                    }
                };
                TvShowsListPage.prototype.saveViewSetting = function () {
                    localStorage["tvshowsListView"] = JSON.stringify(this.viewSetting);
                };
                TvShowsListPage.prototype.processed = function (element, options) {
                    var _this = this;
                    var page = this;
                    if (options && options.genre) {
                        page.selectedGenre = options.genre;
                        page.genretitle.innerText = page.selectedGenre;
                    }
                    page.itemsStyle = document.createElement("STYLE");
                    page.element.appendChild(page.itemsStyle);
                    page.itemsPromise = page.itemsPromise.then(function (data) {
                        page.tvshows = data.tvshows.tvshows;
                        page.genres = data.tvshowGenres.genres;
                        BtPo.ListHelpers.renderMenu({
                            views: TvShowsListPage.tvshowsViews,
                            groups: TvShowsListPage.tvshowsGroups,
                            root: page.element,
                            viewsContainer: page.menuViews,
                            groupsContainer: page.menuGroups,
                            dsManager: page.semanticzoom,
                            setting: page.viewSetting,
                            defaultView: "poster",
                            defaultGroup: "none",
                            saveSetting: function () {
                                _this.saveViewSetting();
                            }
                        });
                        page.semanticzoom.dataManager.filter = function (tvshow) {
                            if (page.filterByPlayed && tvshow.allplayed)
                                return false;
                            if (!page.selectedGenre)
                                return true;
                            var hasgenre = tvshow.allgenres.indexOf(page.selectedGenre) >= 0;
                            return hasgenre;
                        };
                        page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                        page.semanticzoom.listview.layout.orientation = "vertical";
                        page.semanticzoom.zoomedOutListview.layout = new WinJS.UI.GridLayout();
                        page.semanticzoom.zoomedOutListview.layout.orientation = "vertical";
                        page.semanticzoom.listview.oniteminvoked = function (arg) {
                            arg.detail.itemPromise.then(function (item) {
                                WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item.data, navigateStacked: true });
                            });
                        };
                    });
                    page.onlyUnplayed.onchange = function () {
                        page.filterByPlayed = page.onlyUnplayed.checked;
                        _this.semanticzoom.dataManager.refresh();
                    };
                };
                TvShowsListPage.prototype.ready = function () {
                    var page = this;
                    page.itemsPromise.then(function () {
                        page.calcItemsSizes();
                        page.semanticzoom.dataManager.items = page.tvshows;
                    });
                };
                TvShowsListPage.prototype.pickGenre = function () {
                    var page = this;
                    BtPo.UI.GenrePicker.pick(page.genres).then(function (genre) {
                        if (genre) {
                            if (genre === "all") {
                                page.selectedGenre = null;
                                page.genretitle.innerText = "all";
                            }
                            else {
                                page.selectedGenre = genre.label;
                                page.genretitle.innerText = page.selectedGenre;
                            }
                            page.semanticzoom.dataManager.refresh();
                        }
                    });
                };
                TvShowsListPage.prototype.updateLayout = function (element) {
                    var page = this;
                    this.calcItemsSizes();
                    page.semanticzoom.listview.forceLayout();
                };
                TvShowsListPage.prototype.calcItemsSizes = function () {
                    var page = this;
                    var w = page.element.clientWidth;
                    if (w) {
                        var content = [];
                        var nbitems = ((w / 260) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                        content.push(".page-tvshowslist.view-poster .tvshow { width:" + posterW + "px; height:" + posterH + "px}");
                        var nbitems = ((w / 400) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                        content.push(".page-tvshowslist.view-bigposter .tvshow { width:" + posterW + "px; height:" + posterH + "px}");
                        var nbitems = ((w / 1024) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.fanart) << 0;
                        content.push(".page-tvshowslist.view-detailed .tvshow { width:" + posterW + "px; height:" + posterH + "px}");
                        page.itemsStyle.innerHTML = content.join("\r\n");
                    }
                };
                TvShowsListPage.prototype.showMenu = function () {
                    if (this.menu)
                        this.menu.classList.add("visible");
                };
                TvShowsListPage.prototype.hideMenu = function () {
                    if (this.menu)
                        this.menu.classList.remove("visible");
                };
                TvShowsListPage.url = "/pages/tvshows/list/tvshowslist.html";
                TvShowsListPage.tvshowsGroups = {
                    "none": {
                        name: "no grouping",
                        groupKind: null,
                        groupField: null
                    },
                    "alphabetic": {
                        name: "alphabetic",
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'title'
                    },
                    "year": {
                        name: "year",
                        groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                        groupField: 'year'
                    },
                    "studio": {
                        name: "studio",
                        groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                        groupField: 'studio'
                    }
                };
                TvShowsListPage.tvshowsViews = {
                    "poster": {
                        name: "poster",
                        template: BtPo.Templates.tvshowposter
                    },
                    "bigposter": {
                        name: "big poster",
                        template: BtPo.Templates.tvshowposter
                    },
                };
                return TvShowsListPage;
            })();
            Pages.TvShowsListPage = TvShowsListPage;
            WinJS.UI.Pages.define(TvShowsListPage.url, TvShowsListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));

//# sourceMappingURL=../../../../BringThePopcorn/pages/tvshows/list/tvshowslist.js.map