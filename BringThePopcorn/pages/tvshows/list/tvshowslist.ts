module BtPo.UI.Pages {

    export class TvShowsListPage {
        public static url = "/pages/tvshows/list/tvshowslist.html";

        itemsPromise: WinJS.Promise<any>;
        selectedGenre: string;
        semanticzoom: any;
        element: HTMLElement;
        genretitle: HTMLElement;
        listitemtemplate: WinJS.Binding.Template;
        itemsStyle: HTMLStyleElement;
        tvshows: Kodi.API.Videos.TVShows.TVShow[];
        genres: Kodi.API.Genre[];


        static tvshowsViews = {
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
        }

        init(element, options) {
            var page = this;
            element.classList.add("page-tvshowslist");
            var view = TvShowsListPage.tvshowsViews["wall"];
            page.itemsPromise = Kodi.Data.loadRootData();
        }

        setView(viewname) {
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
        }

        cleanViewClasses() {
            var page = this;
            for (var v in TvShowsListPage.tvshowsViews) {
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
                page.tvshows = data.tvshows.tvshows;
                page.genres = data.tvshowGenres.genres;
                page.setView("wall");
                page.semanticzoom.dataManager.filter = function (movie) {
                    if (!page.selectedGenre)
                        return true;

                    var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
                    return hasgenre;
                }
                page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                page.semanticzoom.listview.layout.orientation = "vertical";
                page.semanticzoom.listview.oniteminvoked = function (arg) {
                    arg.detail.itemPromise.then(function (item) {
                        WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item.data, navigateStacked: true });
                    });
                }
            });
        }

        ready() {
            var page = this;
            page.itemsPromise.then(function () {
                page.calcItemsSizes();
                page.semanticzoom.dataManager.items = page.tvshows;
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
                var nbitems = ((w / 260) << 0) + 1;
                var posterW = ((w / nbitems) << 0) - 1;
                var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                page.itemsStyle.innerHTML = ".page-tvshowslist.view-wall .tvshow { width:" + posterW + "px; height:" + posterH + "px}";
            }
        }
    }

    WinJS.UI.Pages.define(TvShowsListPage.url, TvShowsListPage);
}
