declare module WinJSContrib.UI {
    var DataSources: any;
}

declare module KodiPassion.UI {
    var GenrePicker: any;
}

module KodiPassion.UI.Pages {
    export class MoviesListPage {
        public static url = "/pages/movies/list/movieslist.html";

        itemsPromise: WinJS.Promise<any>;
        selectedGenre: string;
        semanticzoom: any;
        element: HTMLElement;
        genretitle: HTMLElement;
        itemsStyle: HTMLStyleElement;
        movies: Kodi.API.Videos.Movies.Movie[];
        genres: Kodi.API.Genre[];
        
        static moviesViews = {
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
        }

        init(element, options) {
            var page = this;
            element.classList.add("page-movieslist");
            var view = MoviesListPage.moviesViews["wall"];
            page.itemsPromise = Kodi.Data.loadRootData();
            
        }

        setView(viewname) {
            var page = this;
            page.cleanViewClasses();
            var view = MoviesListPage.moviesViews[viewname] || MoviesListPage.moviesViews["wall"];
            if (view.groupKind) {
                page.semanticzoom.dataManager.groupKind = view.groupKind;
                page.semanticzoom.dataManager.field = view.groupField;
            }
            page.element.classList.add("view-" + viewname);
            page.semanticzoom.listview.itemTemplate = view.template.element;
        }

        cleanViewClasses() {
            var page = this;
            for (var v in MoviesListPage.moviesViews) {
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
                page.movies = data.movies.movies;
                page.genres = data.movieGenres.genres;
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
                        WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                    });
                }
            });
        }

        ready() {
            var page = this;
            page.itemsPromise.then(function () {
                page.calcItemsSizes();
                page.semanticzoom.dataManager.items = page.movies;
            });
        }

        pickGenre() {
            var page = this;
            KodiPassion.UI.GenrePicker.pick(page.genres).then(function (genre) {
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
                page.itemsStyle.innerHTML = ".page-movieslist.view-wall .movie { width:" + posterW + "px; height:" + posterH + "px}";
            }
        }
    }

    WinJS.UI.Pages.define(MoviesListPage.url, MoviesListPage);
}
