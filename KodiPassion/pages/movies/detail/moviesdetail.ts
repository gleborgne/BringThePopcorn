module KodiPassion.UI.Pages {
    
    export class MovieDetailPage {
        public static url = "/pages/movies/detail/moviesdetail.html";

        element: HTMLElement;
        movie: Kodi.API.Videos.Movies.Movie;
        btnDownloadMovie: HTMLElement;
        btnPlayMovieLocal: HTMLElement;

        processed(element, options) {
            this.movie = options.movie;

            if (this.movie.file) {
                var path = Kodi.Utils.getNetworkPath(this.movie.file);
                if (path) {
                    this.btnDownloadMovie.style.display = "";
                    this.btnPlayMovieLocal.style.display = "";
                }
            }

            return WinJS.Binding.processAll(element, options.movie);
        }

        playMovie() {
            return Kodi.API.Videos.Movies.playMovie(this.movie.movieid).then((res) => {
                console.log(res);
            }, (err) => {
                console.error(err);
            });
        }

        playMovieLocal() {
            return new WinJS.Promise((complete, error) => {
                var path = Kodi.Utils.getNetworkPath(this.movie.file);
                var uri = new Windows.Foundation.Uri(path);
                var opt = <any>new Windows.System.LauncherOptions();
                opt.desiredRemainingView = (<any>(Windows.UI.ViewManagement)).ViewSizePreference.useNone;
                Windows.System.Launcher.launchUriAsync(uri, opt).done((a) => {
                    if (a == true) {
                        complete();
                    }
                    else {
                        complete();
                        WinJSContrib.Alerts.message('unable to play media', 'cannot play this media. Check the network path you set in your Kodi/XBMC (due to Windows constraints, path with server IP will not work, use server name instead within your media server)');
                    }
                }, error);
            });
        }

        downloadMovie() {
        }
    }

    WinJS.UI.Pages.define(MovieDetailPage.url, MovieDetailPage);

}