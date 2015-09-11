module KodiPassion.UI.Pages {
    WinJSContrib.Search.workerPath = "/scripts/winjscontrib/js/winjscontrib.search.worker.js";

    export class SearchPage {
        public static url = "/pages/search/search.html";
        eventTracker: WinJSContrib.UI.EventTracker;
        txtsearch: HTMLInputElement;
        resultItems: HTMLElement;
        index: WinJSContrib.Search.IndexGroup;
        indexReady: WinJS.Promise<any>;
        currentSearch: WinJS.Promise<any>;
        data: WinJS.Promise<Kodi.Data.IMediaLibrary>;

        init(element, options) {
            WinJSContrib.Search.workerPath = "/js/searchworker.js";
            this.index = new WinJSContrib.Search.IndexGroup({
                movies: { useworker: true },
                tvshows: { useworker: true },
                music: { useworker: true },
                artists: { useworker: true },                
            });
            this.indexReady = this.index.load();
            this.data = Kodi.Data.loadRootData();
        }

        processed(element, options) {
            $(this.txtsearch).pressEnterDefaultTo("#btnSearch");
            this.eventTracker.addEvent(this.txtsearch, "input", () => {
                this.search();
            });
        }

        ready() {
            setTimeout(() => {
                this.txtsearch.focus();
            }, 300);
        }

        search() {
            if (this.currentSearch) {
                this.currentSearch.cancel();
            }

            var searchterm = this.txtsearch.value;
            if (searchterm && searchterm.length > 2) {
                this.currentSearch = this.indexReady.then(() => {
                    return this.index.search(searchterm).then((searchresult) => {
                        if (searchresult && searchresult.allResults) {
                            return this.renderSearchResult(searchresult.allResults.slice(0,20));
                        } else {
                            this.resultItems.innerHTML = "";
                        }
                    }, (err) => {
                        var e = err;
                    });
                });
            } else {
                this.resultItems.innerHTML = "";
            }
        }

        renderSearchResult(searchResult) {
            this.resultItems.innerHTML = "";
            return WinJSContrib.Promise.waterfall(searchResult, (s) => {
                s.label = s.item.label;
                s.thumbnail = s.item.thumbnail;
                return KodiPassion.Templates.search.render(s).then((rendered) => {
                    this.resultItems.appendChild(rendered);
                    WinJSContrib.UI.tap(rendered, () => {
                        return this.data.then((data) => {
                            return this.resolveItem(s, data);
                        });
                    });
                });
            });
        }

        resolveItem(searchitem, lib: Kodi.Data.IMediaLibrary) {
            if (searchitem.searchItemType == "music") {
                let item = <Kodi.API.Music.Album>searchitem.item;
                WinJS.Navigation.navigate("/pages/albums/detail/albumsdetail.html", { album: item, navigateStacked: true });
            } else if (searchitem.searchItemType == "artists") {
                WinJS.Navigation.navigate("/pages/albums/list/albumslist.html", { artist: searchitem.item.label });
            } else if (searchitem.searchItemType == "movies") {
                let item = <Kodi.API.Videos.Movies.Movie>searchitem.item; 
                WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item, navigateStacked: true });
            } else if (searchitem.searchItemType == "tvshows") {
                let item = <Kodi.API.Videos.TVShows.TVShow>searchitem.item;
                WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item, navigateStacked: true }); 
            }
        }

        unload() {
            this.index.dispose();
        }
    }

    WinJS.UI.Pages.define(SearchPage.url, SearchPage);
}