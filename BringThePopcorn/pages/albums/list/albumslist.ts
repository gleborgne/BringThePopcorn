module BtPo.UI.Pages {
    interface IAlbumViewSetting {
        group: string;
        view: string;
    }

    export class AlbumsListPage {
        public static url = "/pages/albums/list/albumslist.html";

        itemsPromise: WinJS.Promise<any>;
        selectedGenre: string;
        semanticzoom: any;
        element: HTMLElement;
        genretitle: HTMLElement;
        menu: HTMLElement;
        menuGroups: HTMLElement;
        menuViews: HTMLElement;
        pagetitle: HTMLElement;
        itemsStyle: HTMLStyleElement;
        albums: Kodi.API.Music.Album[];
        genres: Kodi.API.Genre[];
        viewSetting: IAlbumViewSetting;        

        static albumsGroups = {
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
        }

        static albumsViews = {
            "list": {
                name: "list",
                template: BtPo.Templates.album
            }
        }

        init(element, options) {
            var page = this;
            element.classList.add("listpage");
            element.classList.add("page-albumslist");            
            page.itemsPromise = Kodi.Data.loadRootData();
            this.viewSetting = {
                group: "none",
                view: "list"
            }
            var s = localStorage["albumsListView"];
            if (s) {
                this.viewSetting = <IAlbumViewSetting>JSON.parse(s);
            }
        }

        saveViewSetting() {
            localStorage["albumsListView"] = JSON.stringify(this.viewSetting);
        }

        processed(element, options) {
            var page = this;
            if (options && options.genre) {
                page.selectedGenre = options.genre;
                page.genretitle.innerText = page.selectedGenre;
            }

            page.itemsStyle = <HTMLStyleElement>document.createElement("STYLE");
            page.element.appendChild(page.itemsStyle);

            page.itemsPromise = page.itemsPromise.then((data: Kodi.Data.IMediaLibrary) => {
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
                    saveSetting: () => {
                        this.saveViewSetting();
                    }
                });

                page.semanticzoom.dataManager.filter = (album: Kodi.API.Music.Album) => {
                    if (!page.selectedGenre)
                        return true;

                    var hasgenre = album.allgenres.indexOf(page.selectedGenre) >= 0;
                    return hasgenre;
                }
                if (options.artist) {
                    page.pagetitle.innerText = options.artist;
                    page.genretitle.style.display = "none";
                    page.semanticzoom.dataManager.filters.push((a) => {
                        return a.allartists.indexOf(options.artist) >= 0;
                    });
                }
                page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                page.semanticzoom.listview.layout.orientation = "vertical";
                page.semanticzoom.listview.oniteminvoked = (arg) => {
                    arg.detail.itemPromise.then((item) => {
                        WinJS.Navigation.navigate("/pages/albums/detail/albumsdetail.html", { album: item.data, navigateStacked: true });
                    });
                }
            });
        }

        ready() {
            var page = this;
            page.itemsPromise.then(() => {
                page.calcItemsSizes();
                page.semanticzoom.dataManager.items = page.albums;
            });
        }

        pickGenre() {
            var page = this;
            BtPo.UI.GenrePicker.pick(page.genres).then(function (genre) {
                if (genre) {
                    if (genre === "all") {
                        page.selectedGenre = null;
                        page.genretitle.innerText = "all";
                    } else {
                        page.selectedGenre = genre.label;
                        page.genretitle.innerText = page.selectedGenre;
                    }
                    page.semanticzoom.dataManager.refresh();
                }
            });
        }

        updateLayout(element) {
            var page = this;
            this.calcItemsSizes();
            page.semanticzoom.listview.forceLayout();
        }

        calcItemsSizes() {
            var page = this;
            var w = page.element.clientWidth;
            if (w) {
                var nbitems = ((w / 500) << 0) + 1;
                var posterW = ((w / nbitems) << 0) - 1 - 0.25;
                page.itemsStyle.innerHTML = ".page-albumslist.view-list .album-item { width:" + posterW + "px; }";
            }
        }

        showMenu() {
            if (this.menu) this.menu.classList.add("visible");
        }

        hideMenu() {
            if (this.menu) this.menu.classList.remove("visible");
        }
    }

    WinJS.UI.Pages.define(AlbumsListPage.url, AlbumsListPage);
}