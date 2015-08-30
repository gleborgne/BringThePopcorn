module KodiPassion.UI.Pages {

    export class HomePage {
        public static url = "/pages/home/home.html";
        element: HTMLElement;
        flipviewtemplate: WinJS.Binding.Template;        
        mainsplitview: WinJS.UI.FlipView<any>;
        tvshowsflipview: WinJS.UI.FlipView<any>;
        
        processed(element, options) {
            var page = this;
            //Kodi.API.introspect().then(function (api) {
            //    Windows.Storage.ApplicationData.current.localFolder.createFileAsync("kodiapi.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
            //        console.log("kodi api details at " + file.path);
            //        return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(api));
            //    });
            //});            

            Kodi.Data.loadRootData().then((data) => {
                this.loadMovies(data);
                this.loadTvshows(data);
            });
        }

        loadMovies(data: Kodi.Data.IMediaLibrary) {
            this.flipviewtemplate = new WinJS.Binding.Template(null, { href: '/templates/moviesplitview.html', extractChild: true });
            this.mainsplitview.itemTemplate = (itemPromise) => {
                return itemPromise.then((item) => {
                    return this.flipviewtemplate.render(item.data).then((rendered) => {
                        WinJSContrib.UI.tap(rendered, (elt) => {
                            if (!this.element.classList.contains("inactive")) {
                                WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                            }
                        }, { disableAnimation: true })
                        return rendered;
                    });
                })
            }
            var movies = {};
            data.recentMovies.movies.forEach((e) => {
                if (!e.lastplayed) {
                    movies[e.movieid] = true;
                }
            });

            var movieslist = data.movies.movies.sort(this.getSortFunction(movies, "movieid"));    
            
            this.mainsplitview.itemDataSource = new WinJS.Binding.List(movieslist).dataSource;
        }

        loadTvshows(data: Kodi.Data.IMediaLibrary) {
            this.tvshowsflipview.itemTemplate = (itemPromise) => {
                return itemPromise.then((item) => {
                    return this.flipviewtemplate.render(item.data).then((rendered) => {
                        WinJSContrib.UI.tap(rendered, (elt) => {
                            if (!this.element.classList.contains("inactive")) {
                                WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item.data, navigateStacked: true });
                            }
                        }, { disableAnimation: true })
                        return rendered;
                    });
                })
            }

            var tvshows = {};
            data.tvshowRecentEpisodes.episodes.forEach((e) => {
                if (!e.lastplayed && !tvshows[e.tvshowid]) {
                    tvshows[e.tvshowid] = true;
                }
            });

            var tvshowslist = data.tvshows.tvshows.sort(this.getSortFunction(tvshows, "tvshowid"));            

            this.tvshowsflipview.itemDataSource = new WinJS.Binding.List(tvshowslist).dataSource;
        }

        loadAlbums(data: Kodi.Data.IMediaLibrary) {
        }

        getSortFunction(catalog, fieldname) {
            var calcpoints = function (item) {
                var p = item.rating;

                if (catalog[item[fieldname]])
                    p += 10000;

                if (!item.lastplayed)
                    p += 5000;

                return p;
            }

            return function (a, b) {
                var aPoints = calcpoints(a);
                var bPoints = calcpoints(b);
                if (aPoints > bPoints)
                    return -1;
                if (aPoints < bPoints)
                    return 1;

                if (a.lastplayed < b.lastplayed) {
                    return -1
                } else if (a.lastplayed > b.lastplayed) {
                    return 1;
                }

                if (a.playcount < b.playcount) {
                    return -1
                } else if (a.playcount > b.playcount) {
                    return 1;
                }
            }
        }
    }

    WinJS.UI.Pages.define(HomePage.url, HomePage);
}
