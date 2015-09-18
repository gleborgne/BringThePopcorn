declare module WinJSContrib.UI {
    var DataSources: any;
}

declare module BtPo.UI {
    var GenrePicker: any;
}

module BtPo.UI.Pages {
    export class MoviesListPage {
        public static url = "/pages/movies/list/movieslist.html";

        itemsPromise: WinJS.Promise<any>;
        selectedGenre: string;
        semanticzoom: any;
        filterByPlayed: boolean;
        element: HTMLElement;
        onlyUnplayed: HTMLInputElement;
        genretitle: HTMLElement;
        menu: HTMLElement; 
        itemsStyle: HTMLStyleElement;
        movies: Kodi.API.Videos.Movies.Movie[];
        genres: Kodi.API.Genre[];
        
        static moviesGroups = {
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
        }

        static moviesViews = {
            "poster": {
                template: BtPo.Templates.movieposter
            },
            "bigposter": {
                template: BtPo.Templates.movieposter
            },
            "detailed": {
                template: BtPo.Templates.movieposter
            }
        }

        init(element, options) {
            var page = this;
            page.filterByPlayed = false;
            element.classList.add("page-movieslist");
            page.itemsPromise = Kodi.Data.loadRootData();            
        }

        setViewMenu(arg: { elt: HTMLElement }) {
            var name = arg.elt.getAttribute("view");
            if (name) {
                this.setView(name);
                this.semanticzoom.dataManager.refresh();
            }
            //this.hideMenu();
        }

        setGroupingMenu(arg: { elt: HTMLElement }) {
            var name = arg.elt.getAttribute("grouping");
            if (name) {
                this.setGroup(name);
                this.semanticzoom.dataManager.refresh();
            }
            //this.hideMenu();
        }

        setView(viewname?: string) {
            var page = this;
            viewname = viewname || "poster";
            page.cleanViewClasses();
            var view = MoviesListPage.moviesViews[viewname] || MoviesListPage.moviesViews["poster"];            
            page.element.classList.add("view-" + viewname);
            $('.item[view].selected', page.menu).removeClass("selected");
            $('.item[view="' + viewname + '"]', page.menu).addClass("selected");
            page.semanticzoom.listview.itemTemplate = view.template.element;
        }

        setGroup(groupname?:string) {
            var page = this;
            groupname = groupname || "none";
            page.cleanGroupClasses();
            var view = MoviesListPage.moviesGroups[groupname] || MoviesListPage.moviesGroups["none"];
            if (view.groupKind) {
                page.semanticzoom.dataManager.field = view.groupField;
                page.semanticzoom.dataManager.groupKind = view.groupKind;
            } else {
                page.semanticzoom.dataManager.groupKind = null;
                page.semanticzoom.dataManager.field = null;
            }
            $('.item[grouping].selected', page.menu).removeClass("selected");
            $('.item[grouping="' + groupname + '"]', page.menu).addClass("selected");
            page.element.classList.add("group-" + groupname);
        }

        cleanViewClasses() {
            var page = this;
            for (var v in MoviesListPage.moviesViews) {
                page.element.classList.remove("view-" + v);
            }
        }

        cleanGroupClasses() {
            var page = this;
            for (var v in MoviesListPage.moviesGroups) {
                page.element.classList.remove("group-" + v);
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
            page.itemsPromise = page.itemsPromise.then((data: Kodi.Data.IMediaLibrary) => {
                page.movies = data.movies.movies;
                page.genres = data.movieGenres.genres;
                page.setGroup();
                page.setView();
                page.semanticzoom.dataManager.filter = (movie: Kodi.API.Videos.Movies.Movie) => {
                    if (page.filterByPlayed && movie.lastplayed)
                        return false;

                    if (!page.selectedGenre)
                        return true;

                    var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
                    return hasgenre;
                }
                page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                page.semanticzoom.listview.layout.orientation = "vertical";
                page.semanticzoom.zoomedOutListview.layout = new WinJS.UI.GridLayout();
                page.semanticzoom.zoomedOutListview.layout.orientation = "vertical";
                page.semanticzoom.listview.oniteminvoked = (arg) => {
                    arg.detail.itemPromise.then((item) => {
                        WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                    });
                }
            });
            page.onlyUnplayed.onchange = () => {
                page.filterByPlayed = page.onlyUnplayed.checked;
                this.semanticzoom.dataManager.refresh();
            }

            $(element).on("click", ".win-groupheadercontainer", () => {
                page.semanticzoom.semanticZoom.zoomedOut = true;                
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
        }

        showMenu() {
            this.menu.classList.add("visible");   
        }

        hideMenu() {
            this.menu.classList.remove("visible");   
        }
    }

    WinJS.UI.Pages.define(MoviesListPage.url, MoviesListPage);
}
