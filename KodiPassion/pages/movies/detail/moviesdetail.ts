module KodiPassion.UI.Pages {
    
    export class MovieDetailPage {
        public static url = "/pages/movies/detail/moviesdetail.html";

        element: HTMLElement;
        movie: Kodi.API.Videos.Movies.Movie;
        btnDownloadMovie: HTMLElement;
        btnPlayMovieLocal: HTMLElement;
        btnResumeMovie: HTMLElement;

        processed(element, options) {
            this.movie = options.movie;

            if (this.movie.file) {
                var path = Kodi.Utils.getNetworkPath(this.movie.file);
                if (path) {
                    //this.btnDownloadMovie.style.display = "";
                    this.btnPlayMovieLocal.style.display = "";
                }
            }

            Kodi.API.Videos.Movies.getMovieDetails(this.movie.movieid).then((detail) => {
                if (detail.moviedetails.resume && detail.moviedetails.resume.position) {
                    this.btnResumeMovie.style.display = "";
                }
            }, function (err) {
                var e = err;
            });

            return WinJS.Binding.processAll(element, options.movie);
        }

        resumeMovie() {
            return Kodi.API.Videos.Movies.playMovie(this.movie.movieid, true).then((res) => {
                console.log(res);
            }, (err) => {
                console.error(err);
            });
        }

        playMovie() {
            return Kodi.API.Videos.Movies.playMovie(this.movie.movieid).then((res) => {
                console.log(res);
            }, (err) => {
                console.error(err);
            });
        }

        playMovieLocal() {
            return Kodi.App.playLocalMedia(this.movie.file);
        }

        downloadMovie() {
        }
    }

    WinJS.UI.Pages.define(MovieDetailPage.url, MovieDetailPage);

}