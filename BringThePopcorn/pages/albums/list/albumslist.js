var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsListPage = (function () {
                function AlbumsListPage() {
                }
                AlbumsListPage.prototype.init = function (element, options) {
                    var page = this;
                    element.classList.add("listpage");
                    element.classList.add("page-albumslist");
                    page.itemsPromise = Kodi.Data.loadRootData();
                    this.viewSetting = {
                        group: "none",
                        view: "list"
                    };
                    var s = localStorage["albumsListView"];
                    if (s) {
                        this.viewSetting = JSON.parse(s);
                    }
                };
                AlbumsListPage.prototype.saveViewSetting = function () {
                    localStorage["albumsListView"] = JSON.stringify(this.viewSetting);
                };
                AlbumsListPage.prototype.processed = function (element, options) {
                    var _this = this;
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
                        BtPo.ListHelpers.renderMenu({
                            views: AlbumsListPage.albumsViews,
                            groups: AlbumsListPage.albumsGroups,
                            root: page.element,
                            viewsContainer: page.menuViews,
                            groupsContainer: page.menuGroups,
                            dsManager: page.semanticzoom,
                            setting: page.viewSetting,
                            defaultView: "list",
                            defaultGroup: "none",
                            saveSetting: function () {
                                _this.saveViewSetting();
                            }
                        });
                        page.semanticzoom.dataManager.filter = function (album) {
                            if (!page.selectedGenre)
                                return true;
                            var hasgenre = album.allgenres.indexOf(page.selectedGenre) >= 0;
                            return hasgenre;
                        };
                        if (options.artist) {
                            page.pagetitle.innerText = options.artist;
                            page.genretitle.style.display = "none";
                            page.semanticzoom.dataManager.filters.push(function (a) {
                                return a.allartists.indexOf(options.artist) >= 0;
                            });
                        }
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
                        page.itemsStyle.innerHTML = ".page-albumslist.view-list .album-item { width:" + posterW + "px; }";
                    }
                };
                AlbumsListPage.prototype.showMenu = function () {
                    if (this.menu)
                        this.menu.classList.add("visible");
                };
                AlbumsListPage.prototype.hideMenu = function () {
                    if (this.menu)
                        this.menu.classList.remove("visible");
                };
                AlbumsListPage.url = "/pages/albums/list/albumslist.html";
                AlbumsListPage.albumsGroups = {
                    "none": {
                        name: "no grouping",
                        groupKind: null,
                        groupField: null
                    },
                    "alphabetic": {
                        name: "alphabetic",
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'label'
                    },
                    "artist": {
                        name: "artist",
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'artist'
                    },
                    "year": {
                        name: "year",
                        groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                        groupField: 'year'
                    }
                };
                AlbumsListPage.albumsViews = {
                    "list": {
                        name: "list",
                        template: BtPo.Templates.album
                    }
                };
                return AlbumsListPage;
            })();
            Pages.AlbumsListPage = AlbumsListPage;
            WinJS.UI.Pages.define(AlbumsListPage.url, AlbumsListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
