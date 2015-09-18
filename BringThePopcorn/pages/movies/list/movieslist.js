var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var MoviesListPage = (function () {
                function MoviesListPage() {
                }
                MoviesListPage.prototype.init = function (element, options) {
                    var page = this;
                    page.filterByPlayed = false;
                    element.classList.add("page-movieslist");
                    page.itemsPromise = Kodi.Data.loadRootData();
                };
                MoviesListPage.prototype.setViewMenu = function (arg) {
                    var name = arg.elt.getAttribute("view");
                    if (name) {
                        this.setView(name);
                        this.semanticzoom.dataManager.refresh();
                    }
                    //this.hideMenu();
                };
                MoviesListPage.prototype.setGroupingMenu = function (arg) {
                    var name = arg.elt.getAttribute("grouping");
                    if (name) {
                        this.setGroup(name);
                        this.semanticzoom.dataManager.refresh();
                    }
                    //this.hideMenu();
                };
                MoviesListPage.prototype.setView = function (viewname) {
                    var page = this;
                    viewname = viewname || "poster";
                    page.cleanViewClasses();
                    var view = MoviesListPage.moviesViews[viewname] || MoviesListPage.moviesViews["poster"];
                    page.element.classList.add("view-" + viewname);
                    $('.item[view].selected', page.menu).removeClass("selected");
                    $('.item[view="' + viewname + '"]', page.menu).addClass("selected");
                    page.semanticzoom.listview.itemTemplate = view.template.element;
                };
                MoviesListPage.prototype.setGroup = function (groupname) {
                    var page = this;
                    groupname = groupname || "none";
                    page.cleanGroupClasses();
                    var view = MoviesListPage.moviesGroups[groupname] || MoviesListPage.moviesGroups["none"];
                    if (view.groupKind) {
                        page.semanticzoom.dataManager.field = view.groupField;
                        page.semanticzoom.dataManager.groupKind = view.groupKind;
                    }
                    else {
                        page.semanticzoom.dataManager.groupKind = null;
                        page.semanticzoom.dataManager.field = null;
                    }
                    $('.item[grouping].selected', page.menu).removeClass("selected");
                    $('.item[grouping="' + groupname + '"]', page.menu).addClass("selected");
                    page.element.classList.add("group-" + groupname);
                };
                MoviesListPage.prototype.cleanViewClasses = function () {
                    var page = this;
                    for (var v in MoviesListPage.moviesViews) {
                        page.element.classList.remove("view-" + v);
                    }
                };
                MoviesListPage.prototype.cleanGroupClasses = function () {
                    var page = this;
                    for (var v in MoviesListPage.moviesGroups) {
                        page.element.classList.remove("group-" + v);
                    }
                };
                MoviesListPage.prototype.processed = function (element, options) {
                    var _this = this;
                    var page = this;
                    if (options && options.genre) {
                        page.selectedGenre = options.genre;
                        page.genretitle.innerText = page.selectedGenre;
                    }
                    page.itemsStyle = document.createElement("STYLE");
                    page.element.appendChild(page.itemsStyle);
                    page.itemsPromise = page.itemsPromise.then(function (data) {
                        page.movies = data.movies.movies;
                        page.genres = data.movieGenres.genres;
                        page.setGroup();
                        page.setView();
                        page.semanticzoom.dataManager.filter = function (movie) {
                            if (page.filterByPlayed && movie.lastplayed)
                                return false;
                            if (!page.selectedGenre)
                                return true;
                            var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
                            return hasgenre;
                        };
                        page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                        page.semanticzoom.listview.layout.orientation = "vertical";
                        page.semanticzoom.zoomedOutListview.layout = new WinJS.UI.GridLayout();
                        page.semanticzoom.zoomedOutListview.layout.orientation = "vertical";
                        page.semanticzoom.listview.oniteminvoked = function (arg) {
                            arg.detail.itemPromise.then(function (item) {
                                WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                            });
                        };
                    });
                    page.onlyUnplayed.onchange = function () {
                        page.filterByPlayed = page.onlyUnplayed.checked;
                        _this.semanticzoom.dataManager.refresh();
                    };
                    $(element).on("click", ".win-groupheadercontainer", function () {
                        page.semanticzoom.semanticZoom.zoomedOut = true;
                    });
                };
                MoviesListPage.prototype.ready = function () {
                    var page = this;
                    page.itemsPromise.then(function () {
                        page.calcItemsSizes();
                        page.semanticzoom.dataManager.items = page.movies;
                    });
                };
                MoviesListPage.prototype.pickGenre = function () {
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
                MoviesListPage.prototype.updateLayout = function (element) {
                    var page = this;
                    this.calcItemsSizes();
                    page.semanticzoom.listview.forceLayout();
                };
                MoviesListPage.prototype.calcItemsSizes = function () {
                    var page = this;
                    var w = page.element.clientWidth;
                    if (w) {
                        var content = [];
                        var nbitems = ((w / 260) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                        content.push(".page-movieslist.view-poster .movie { width:" + posterW + "px; height:" + posterH + "px}");
                        var nbitems = ((w / 400) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                        content.push(".page-movieslist.view-bigposter .movie { width:" + posterW + "px; height:" + posterH + "px}");
                        var nbitems = ((w / 1024) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.fanart) << 0;
                        content.push(".page-movieslist.view-detailed .movie { width:" + posterW + "px; height:" + posterH + "px}");
                        page.itemsStyle.innerHTML = content.join("\r\n");
                    }
                };
                MoviesListPage.prototype.showMenu = function () {
                    this.menu.classList.add("visible");
                };
                MoviesListPage.prototype.hideMenu = function () {
                    this.menu.classList.remove("visible");
                };
                MoviesListPage.url = "/pages/movies/list/movieslist.html";
                MoviesListPage.moviesGroups = {
                    "none": {
                        groupKind: null,
                        groupField: null
                    },
                    "alphabetic": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'title'
                    },
                    "year": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                        groupField: 'year'
                    },
                    "studio": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                        groupField: 'studio'
                    }
                };
                MoviesListPage.moviesViews = {
                    "poster": {
                        template: BtPo.Templates.movieposter
                    },
                    "bigposter": {
                        template: BtPo.Templates.movieposter
                    },
                    "detailed": {
                        template: BtPo.Templates.movieposter
                    }
                };
                return MoviesListPage;
            })();
            Pages.MoviesListPage = MoviesListPage;
            WinJS.UI.Pages.define(MoviesListPage.url, MoviesListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
//# sourceMappingURL=movieslist.js.map