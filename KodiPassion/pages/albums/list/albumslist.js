var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsListPage = (function () {
                function AlbumsListPage() {
                }
                AlbumsListPage.prototype.init = function (element, options) {
                    var page = this;
                    element.classList.add("page-albumslist");
                    var view = AlbumsListPage.albumViews["wall"];
                    page.itemsPromise = Kodi.Data.loadRootData();
                };
                AlbumsListPage.prototype.setView = function (viewname) {
                    var page = this;
                    page.cleanViewClasses();
                    var view = AlbumsListPage.albumViews[viewname] || AlbumsListPage.albumViews["wall"];
                    if (view.groupKind) {
                        page.semanticzoom.dataManager.groupKind = view.groupKind;
                        page.semanticzoom.dataManager.field = view.groupField;
                    }
                    page.element.classList.add("view-" + viewname);
                    page.semanticzoom.listview.itemTemplate = view.template.element;
                };
                AlbumsListPage.prototype.cleanViewClasses = function () {
                    var page = this;
                    for (var v in AlbumsListPage.albumViews) {
                        page.element.classList.remove("view-" + v);
                    }
                };
                AlbumsListPage.prototype.processed = function (element, options) {
                    var page = this;
                    if (options && options.genre) {
                        page.selectedGenre = options.genre;
                        page.genretitle.innerText = page.selectedGenre;
                    }
                    page.itemsStyle = document.createElement("STYLE");
                    page.element.appendChild(page.itemsStyle);
                    page.itemsPromise = page.itemsPromise.then(function (data) {
                        page.albums = data.music.albums;
                        page.genres = data.musicGenres.genres;
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
                                WinJS.Navigation.navigate("/pages/albums/detail/albumsdetail.html", { album: item.data, navigateStacked: true });
                            });
                        };
                    });
                };
                AlbumsListPage.prototype.ready = function () {
                    var page = this;
                    page.itemsPromise.then(function () {
                        page.calcItemsSizes();
                        page.semanticzoom.dataManager.items = page.albums;
                    });
                };
                AlbumsListPage.prototype.pickGenre = function () {
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
                AlbumsListPage.prototype.updateLayout = function (element) {
                    var page = this;
                    this.calcItemsSizes();
                    page.semanticzoom.listview.forceLayout();
                };
                AlbumsListPage.prototype.calcItemsSizes = function () {
                    var page = this;
                    var w = page.element.clientWidth;
                    if (w) {
                        var nbitems = ((w / 500) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1 - 0.25;
                        page.itemsStyle.innerHTML = ".page-albumslist.view-wall .album-item { width:" + posterW + "px; }";
                    }
                };
                AlbumsListPage.url = "/pages/albums/list/albumslist.html";
                AlbumsListPage.albumViews = {
                    "wall": {
                        groupKind: null,
                        groupField: null,
                        template: KodiPassion.Templates.album
                    },
                    "alphabetic": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'title',
                        template: KodiPassion.Templates.album
                    },
                    "year": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'year',
                        template: KodiPassion.Templates.album
                    }
                };
                return AlbumsListPage;
            })();
            Pages.AlbumsListPage = AlbumsListPage;
            WinJS.UI.Pages.define(AlbumsListPage.url, AlbumsListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=albumslist.js.map