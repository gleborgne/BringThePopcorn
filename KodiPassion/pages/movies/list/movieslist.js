var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var MoviesListPage = (function () {
                function MoviesListPage() {
                }
                MoviesListPage.prototype.init = function (element, options) {
                    var page = this;
                    element.classList.add("page-movieslist");
                    var view = MoviesListPage.moviesViews["wall"];
                    page.itemsPromise = Kodi.Data.loadRootData();
                };
                MoviesListPage.prototype.setView = function (viewname) {
                    var page = this;
                    page.cleanViewClasses();
                    var view = MoviesListPage.moviesViews[viewname] || MoviesListPage.moviesViews["wall"];
                    if (view.groupKind) {
                        page.semanticzoom.dataManager.groupKind = view.groupKind;
                        page.semanticzoom.dataManager.field = view.groupField;
                    }
                    page.element.classList.add("view-" + viewname);
                    page.semanticzoom.listview.itemTemplate = view.template.element;
                };
                MoviesListPage.prototype.cleanViewClasses = function () {
                    var page = this;
                    for (var v in MoviesListPage.moviesViews) {
                        page.element.classList.remove("view-" + v);
                    }
                };
                MoviesListPage.prototype.processed = function (element, options) {
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
                                WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                            });
                        };
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
                MoviesListPage.prototype.updateLayout = function (element) {
                    var page = this;
                    this.calcItemsSizes();
                    page.semanticzoom.listview.forceLayout();
                };
                MoviesListPage.prototype.calcItemsSizes = function () {
                    var page = this;
                    var w = page.element.clientWidth;
                    if (w) {
                        var nbitems = ((w / 260) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                        page.itemsStyle.innerHTML = ".page-movieslist.view-wall .movie { width:" + posterW + "px; height:" + posterH + "px}";
                    }
                };
                MoviesListPage.url = "/pages/movies/list/movieslist.html";
                MoviesListPage.moviesViews = {
                    "wall": {
                        groupKind: null,
                        groupField: null,
                        template: KodiPassion.Templates.movieposter
                    },
                    "alphabetic": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'title',
                        template: KodiPassion.Templates.movieposter
                    },
                    "year": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'year',
                        template: KodiPassion.Templates.movieposter
                    }
                };
                return MoviesListPage;
            })();
            Pages.MoviesListPage = MoviesListPage;
            WinJS.UI.Pages.define(MoviesListPage.url, MoviesListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
