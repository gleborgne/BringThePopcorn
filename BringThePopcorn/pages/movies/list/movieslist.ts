﻿declare module WinJSContrib.UI {
    var DataSources: any;
}

declare module BtPo.UI {
    var GenrePicker: any;
}

module BtPo.UI.Pages {
    interface IMovieViewSetting
    {
        group: string;
        view: string;
    }

    export class MoviesListPage {
        public static url = "/pages/movies/list/movieslist.html";

        itemsPromise: WinJS.Promise<any>;
        selectedGenre: string;
        semanticzoom: any;
        filterByPlayed: boolean;
        element: HTMLElement;
        onlyUnplayed: HTMLInputElement;
        menuGroups: HTMLElement;
        menuViews: HTMLElement;
        genretitle: HTMLElement;
        menu: HTMLElement; 
        itemsStyle: HTMLStyleElement;
        movies: Kodi.API.Videos.Movies.Movie[];
        genres: Kodi.API.Genre[];
        viewSetting: IMovieViewSetting;
        
        static moviesGroups = {
            "none": {
                name : "no grouping",
                groupKind: null,
                groupField: null
            },
            "alphabetic": {
                name: "alphabetic",
                groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                groupField: 'title'
            },
            "year": {
                name: "year",
                groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                groupField: 'year'
            },
            "studio": {
                name: "studio",
                groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                groupField: 'studio'
            }
        }

        static moviesViews = {
            "poster": {
                name: "poster",
                template: BtPo.Templates.movieposter
            },
            "bigposter": {
                name: "big poster",
                template: BtPo.Templates.movieposter
            },
            //"detailed": {
            //    name: "detailed",
            //    template: BtPo.Templates.movieposter
            //}
        }

        init(element, options) {
            this.filterByPlayed = false;
            element.classList.add("listpage");
            element.classList.add("page-movieslist");
            this.itemsPromise = Kodi.Data.loadRootData();      
            this.viewSetting = {
                group: "none",
                view : "poster"
            }
            var s = localStorage["moviesListView"];
            if (s) {
                this.viewSetting = <IMovieViewSetting>JSON.parse(s);
            }
        }

        saveViewSetting() {
            localStorage["moviesListView"] = JSON.stringify(this.viewSetting);
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
                
                BtPo.ListHelpers.renderMenu({
                    views: MoviesListPage.moviesViews,
                    groups: MoviesListPage.moviesGroups,
                    root: page.element,
                    viewsContainer: page.menuViews,
                    groupsContainer: page.menuGroups,
                    dsManager: page.semanticzoom,
                    setting: page.viewSetting,
                    defaultView: "poster",
                    defaultGroup: "none",
                    saveSetting: () => {
                        this.saveViewSetting();
                    }
                });

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
            if (this.menu) this.menu.classList.add("visible");   
        }

        hideMenu() {
            if (this.menu) this.menu.classList.remove("visible");   
        }
    }

    WinJS.UI.Pages.define(MoviesListPage.url, MoviesListPage);
}
