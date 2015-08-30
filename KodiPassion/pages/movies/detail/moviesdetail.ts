module KodiPassion.UI.Pages {
    
    export class MovieDetailPage {
        public static url = "/pages/movies/detail/moviesdetail.html";

        element: HTMLElement;
        eventTracker: WinJSContrib.UI.EventTracker;
        movie: Kodi.API.Videos.Movies.Movie;
        btnDownloadMovie: HTMLElement;
        btnPlayMovieLocal: HTMLElement;
        btnResumeMovie: HTMLElement;
        headerbanner: HTMLElement;
        headerposter: HTMLElement;
        visualstate: any;
        scrollContainer: HTMLElement;
        scrollDelay: number;

        processed(element, options) {
            this.movie = options.movie;

            this.eventTracker.addEvent(this.scrollContainer, "scroll", () => {
                cancelAnimationFrame(this.scrollDelay);
                this.scrollDelay = requestAnimationFrame(() => {
                    this.checkScroll();
                });
            });

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

        checkScroll() {
            var h = this.headerbanner.clientHeight;
            var posterinbanner = this.visualstate.states.medium.active;
            if (!posterinbanner && this.headerposter.style.opacity) {
                this.headerposter.style.opacity = '';
            }

            var dif = (h - this.scrollContainer.scrollTop);
            if (dif < 0) {
                if (this.headerbanner.style.opacity != '0') {
                    this.headerbanner.style.opacity = '0';
                }
                if (posterinbanner && this.headerposter.style.opacity != '0') {
                    this.headerposter.style.opacity = '0';
                }
            } else {
                var val = (dif / h) + '';
                this.headerbanner.style.opacity = val;
                if (posterinbanner) {
                    this.headerposter.style.opacity = val;
                }
            }
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

        updateLayout() {
            this.checkScroll();
        }
    }

    WinJS.UI.Pages.define(MovieDetailPage.url, MovieDetailPage);

}