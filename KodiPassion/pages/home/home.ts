module KodiPassion.UI.Pages {
                
    export class HomePage {
        public static url = "/pages/home/home.html";
        element: HTMLElement;
        eventTracker: WinJSContrib.UI.EventTracker;
        flipviewtemplate: WinJS.Binding.Template;        
        mainsplitview: WinJS.UI.FlipView<any>;
        tvshowsflipview: WinJS.UI.FlipView<any>;
        allowAutoFlip: boolean = true;
        data: Kodi.Data.IMediaLibrary;
        moviesbloc: HTMLElement;
        tvshowsbloc: HTMLElement;
        musicbloc: HTMLElement;
        albumscontainer: HTMLElement;
        
        processed(element, options) {
            var page = this;
            //Kodi.API.introspect().then(function (api) {
            //    Windows.Storage.ApplicationData.current.localFolder.createFileAsync("kodiapi.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
            //        console.log("kodi api details at " + file.path);
            //        return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(api));
            //    });
            //});        
            var registerpointerdown = page.eventTracker.addEvent(page.element, "pointerdown", () => {
                this.allowAutoFlip = false;
                registerpointerdown();
            }, true);

            Kodi.Data.loadRootData().then((data) => {
                page.data = data;
                this.loadMovies(data);
                this.loadTvshows(data);
                this.loadAlbums(data);
            });
        }

        flipMovies() {
            if (this.allowAutoFlip) {
                this.mainsplitview.itemDataSource.getCount().then((nbitems) => {
                    if (this.mainsplitview.currentPage < nbitems-1) {
                        this.mainsplitview.currentPage = this.mainsplitview.currentPage + 1;
                    } else {
                        this.mainsplitview.currentPage = 0;
                    }
                });
                setTimeout(() => {
                    this.flipMovies();
                }, 7000);
            }
        }

        flipTvshows() {
            if (this.allowAutoFlip) {
                this.tvshowsflipview.itemDataSource.getCount().then((nbitems) => {
                    if (this.tvshowsflipview.currentPage < nbitems-1) {
                        this.tvshowsflipview.currentPage = this.tvshowsflipview.currentPage + 1;
                    } else {
                        this.tvshowsflipview.currentPage = 0;
                    }
                });
                setTimeout(() => {
                    this.flipTvshows();
                }, 7000);
            }
        }

        loadMovies(data: Kodi.Data.IMediaLibrary) {
            if (data.movies && data.movies.movies) {
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
                if (data.recentMovies && data.recentMovies.movies) {
                    data.recentMovies.movies.forEach((e) => {
                        if (!e.lastplayed) {
                            movies[e.movieid] = true;
                        }
                    });
                }

                var movieslist = data.movies.movies.slice(0, data.movies.movies.length);
                movieslist = movieslist.sort(this.getSortFunction(movies, "movieid"));

                this.mainsplitview.itemDataSource = new WinJS.Binding.List(movieslist).dataSource;

                setTimeout(() => {
                    this.flipMovies();
                }, 4000);
            } else {
                this.moviesbloc.style.display = "none";
            }
        }

        loadTvshows(data: Kodi.Data.IMediaLibrary) {
            if (data.tvshows && data.tvshows.tvshows) {
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
                
                var tvshowslist = data.tvshows.tvshows.slice(0, data.tvshows.tvshows.length);
                tvshowslist = tvshowslist.sort(this.getSortFunction(tvshows, "tvshowid"));

                this.tvshowsflipview.itemDataSource = new WinJS.Binding.List(tvshowslist).dataSource;
                setTimeout(() => {
                    this.flipTvshows();
                }, 5000);
            } else {
                this.tvshowsbloc.style.display = "none";
            }
        }

        loadAlbums(data: Kodi.Data.IMediaLibrary) {
            if (data.music && data.music.albums) {

                var container = document.createDocumentFragment();
                var p = [];
                data.recentMusic.albums.slice(0, 12).forEach((a) => {
                    p.push(KodiPassion.Templates.album.render(a).then((rendered) => {
                        container.appendChild(rendered);
                        WinJSContrib.UI.tap(rendered, function () {
                            WinJS.Navigation.navigate("/pages/albums/detail/albumsdetail.html", { album: a, navigateStacked: true });
                        });
                    }));
                });

                WinJS.Promise.join(p).then(() => {
                    this.albumscontainer.appendChild(container);
                });
            } else {
                this.musicbloc.style.display = "none";
            }
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

        scanVideos() {
            Kodi.API.Videos.Movies.scan();
        }

        cleanVideos() {
            Kodi.API.Videos.Movies.clean();
        }

        moviesGenres() {
            if (this.data && this.data.movieGenres && this.data.movieGenres.genres) {
                KodiPassion.UI.GenrePicker.pick(this.data.movieGenres.genres).then(function (genre) {
                    if (genre) {
                        if (genre === "all") {
                            WinJS.Navigation.navigate("/pages/movies/list/movieslist.html");
                        } else {
                            WinJS.Navigation.navigate("/pages/movies/list/movieslist.html", { genre: genre.label });
                        }
                    }
                });
            }
        }

        tvshowsGenres() {
            if (this.data && this.data.tvshowGenres && this.data.tvshowGenres.genres) {
                KodiPassion.UI.GenrePicker.pick(this.data.tvshowGenres.genres).then(function (genre) {
                    if (genre) {
                        if (genre === "all") {
                            WinJS.Navigation.navigate("/pages/tvshows/list/tvshowslist.html");
                        } else {
                            WinJS.Navigation.navigate("/pages/tvshows/list/tvshowslist.html", { genre: genre.label });
                        }
                    }
                });
            }
        }

        albumsGenres() {
            if (this.data && this.data.tvshowGenres && this.data.tvshowGenres.genres) {
                KodiPassion.UI.GenrePicker.pick(this.data.musicGenres.genres).then(function (genre) {
                    if (genre) {
                        if (genre === "all") {
                            WinJS.Navigation.navigate("/pages/albums/list/albumslist.html");
                        } else {
                            WinJS.Navigation.navigate("/pages/albums/list/albumslist.html", { genre: genre.label });
                        }
                    }
                });
            }
        }

        unload() {
            this.allowAutoFlip = false;
        }
    }

    WinJS.UI.Pages.define(HomePage.url, HomePage);
}
