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
        castItems: HTMLElement;
        visualstate: any;
        scrollContainer: HTMLElement;
        scrollDelay: number;
        actorsAspectRatio: any;

        processed(element, options) {
            this.movie = options.movie;
            this.element.id = "page-" + WinJSContrib.Utils.guid();
            this.actorsAspectRatio.prefix = "#" + this.element.id + " .page-moviesdetail";
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

            
            var p = [];
            var bindables = this.element.querySelectorAll(".moviebinding");
            for (var i = 0, l = bindables.length; i < l; i++) {
                p.push(WinJS.Binding.processAll(<Element>bindables[i], options.movie));
            }
            return WinJS.Promise.join(p);
        }

        ready(element, options) {
            setTimeout(() => {
                this.renderCast();
            }, 400);
        }

        renderCast() {
            var template = new WinJS.Binding.Template(null, { href: '/templates/actor.html', extractChild: true });
            var container = document.createDocumentFragment();
            var p = [];
            var items = [];
            this.movie.cast.forEach((c) => {
                p.push(template.render(c).then((rendered) => {
                    rendered.style.opacity = '0';
                    items.push(rendered);
                    container.appendChild(rendered);
                }));
            });

            WinJS.Promise.join(p).then(() => {
                this.castItems.appendChild(container);
                WinJS.UI.Animation.enterPage(items);
            });
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
            return Kodi.API.Videos.Movies.playMovie(this.movie.movieid, true);
        }

        playMovie() {
            return Kodi.API.Videos.Movies.playMovie(this.movie.movieid);
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

    export var MovieDetail = WinJS.UI.Pages.define(MovieDetailPage.url, MovieDetailPage);

}