module BtPo.UI.Pages {

    export class AlbumsListPage {
        public static url = "/pages/albums/list/albumslist.html";

        itemsPromise: WinJS.Promise<any>;
        selectedGenre: string;
        semanticzoom: any;
        element: HTMLElement;
        genretitle: HTMLElement;
        pagetitle: HTMLElement;
        itemsStyle: HTMLStyleElement;
        albums: Kodi.API.Music.Album[];
        genres: Kodi.API.Genre[];

        static albumViews = {
            "wall": {
                groupKind: null,
                groupField: null,
                template: BtPo.Templates.album
            },
            "alphabetic": {
                groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                groupField: 'title',
                template: BtPo.Templates.album
            },
            "year": {
                groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                groupField: 'year',
                template: BtPo.Templates.album
            }
        }

        init(element, options) {
            var page = this;
            element.classList.add("page-albumslist");
            var view = AlbumsListPage.albumViews["wall"];
            page.itemsPromise = Kodi.Data.loadRootData();

        }

        setView(viewname) {
            var page = this;
            page.cleanViewClasses();
            var view = AlbumsListPage.albumViews[viewname] || AlbumsListPage.albumViews["wall"];
            if (view.groupKind) {
                page.semanticzoom.dataManager.groupKind = view.groupKind;
                page.semanticzoom.dataManager.field = view.groupField;
            }
            page.element.classList.add("view-" + viewname);
            page.semanticzoom.listview.itemTemplate = view.template.element;
        }

        cleanViewClasses() {
            var page = this;
            for (var v in AlbumsListPage.albumViews) {
                page.element.classList.remove("view-" + v);
            }
        }

        processed(element, options) {
            var page = this;
            if (options && options.genre) {
                page.selectedGenre = options.genre;
                page.genretitle.innerText = page.selectedGenre;
            }

            page.itemsStyle = <HTMLStyleElement>document.createElement("STYLE");
            page.element.appendChild(page.itemsStyle);

            page.itemsPromise = page.itemsPromise.then(function (data: Kodi.Data.IMediaLibrary) {
                page.albums = data.music.albums;
                page.genres = data.musicGenres.genres;
                page.setView("wall");
                page.semanticzoom.dataManager.filter = function (movie) {
                    if (!page.selectedGenre)
                        return true;

                    var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
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
                page.semanticzoom.listview.oniteminvoked = function (arg) {
                    arg.detail.itemPromise.then(function (item) {
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
                page.itemsStyle.innerHTML = ".page-albumslist.view-wall .album-item { width:" + posterW + "px; }";
            }
        }
    }

    WinJS.UI.Pages.define(AlbumsListPage.url, AlbumsListPage);
}