var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var TvShowsListPage = (function () {
                function TvShowsListPage() {
                }
                TvShowsListPage.prototype.init = function (element, options) {
                    var page = this;
                    element.classList.add("page-tvshowslist");
                    var view = TvShowsListPage.tvshowsViews["wall"];
                    page.itemsPromise = Kodi.Data.loadRootData();
                };
                TvShowsListPage.prototype.setView = function (viewname) {
                    var page = this;
                    page.cleanViewClasses();
                    var view = TvShowsListPage.tvshowsViews[viewname] || TvShowsListPage.tvshowsViews["wall"];
                    if (view.groupKind) {
                        page.semanticzoom.dataManager.groupKind = view.groupKind;
                        page.semanticzoom.dataManager.field = view.groupField;
                    }
                    page.element.classList.add("view-" + viewname);
                    page.listitemtemplate = new WinJS.Binding.Template(null, { href: view.template });
                    page.semanticzoom.listview.itemTemplate = page.listitemtemplate.element;
                };
                TvShowsListPage.prototype.cleanViewClasses = function () {
                    var page = this;
                    for (var v in TvShowsListPage.tvshowsViews) {
                        page.element.classList.remove("view-" + v);
                    }
                };
                TvShowsListPage.prototype.processed = function (element, options) {
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
                        page.setView("wall");
                        page.semanticzoom.dataManager.filter = function (movie) {
                            if (!page.selectedGenre)
                                return true;
                            var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
                            return hasgenre;
                        };
                        page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                        page.semanticzoom.listview.layout.orientation = "vertical";
                        page.semanticzoom.listview.oniteminvoked = function (arg) {
                            arg.detail.itemPromise.then(function (item) {
                                WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item.data, navigateStacked: true });
                            });
                        };
                    });
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
                    KodiPassion.UI.GenrePicker.pick(page.genres).then(function (genre) {
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
                        var nbitems = ((w / 260) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                        page.itemsStyle.innerHTML = ".page-tvshowslist.view-wall .tvshow { width:" + posterW + "px; height:" + posterH + "px}";
                    }
                };
                TvShowsListPage.url = "/pages/tvshows/list/tvshowslist.html";
                TvShowsListPage.tvshowsViews = {
                    "wall": {
                        groupKind: null,
                        groupField: null,
                        template: '/templates/tvshowposter.html'
                    },
                    "alphabetic": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'title',
                        template: '/templates/tvshowposter.html'
                    },
                    "year": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'year',
                        template: '/templates/tvshowposter.html'
                    }
                };
                return TvShowsListPage;
            })();
            Pages.TvShowsListPage = TvShowsListPage;
            WinJS.UI.Pages.define(TvShowsListPage.url, TvShowsListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
