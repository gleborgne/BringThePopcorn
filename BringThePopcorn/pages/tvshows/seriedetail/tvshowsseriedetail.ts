module BtPo.UI.Pages {

    export class TvShowsDetailPage {
        public static url = "/pages/tvshows/seriedetail/tvshowsseriedetail.html";

        element: HTMLElement;
        eventTracker: WinJSContrib.UI.EventTracker;
        seasonsItems: HTMLElement;
        seasonTemplate: WinJS.Binding.Template;
        episodeTemplate: WinJS.Binding.Template;
        tvshow: Kodi.API.Videos.TVShows.TVShow;
        btnDownloadMovie: HTMLElement;
        btnPlayMovieLocal: HTMLElement;
        headerbanner: HTMLElement;
        headerposter: HTMLElement;
        seasonsPromise: WinJS.Promise<Kodi.API.Videos.TVShows.Season[]>;
        visualstate: any;
        scrollContainer: HTMLElement;
        scrollDelay: number;

        init(element, options) {
            this.tvshow = options.tvshow;
            if (this.tvshow.seasons && this.tvshow.seasons.length) {
                this.seasonsPromise = WinJS.Promise.wrap(this.tvshow.seasons);
            } else {
                this.seasonsPromise = Kodi.API.Videos.TVShows.getTVShowSeasons(this.tvshow.tvshowid).then((seasons) => {
                    if (seasons.seasons.length == 1) {
                        var season = seasons.seasons[0];
                        return Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                            (<any>season).episodes = episodes;
                            return seasons;
                        });
                    }
                    return seasons.seasons;
                });
            }
        }

        processed(element, options) {
            this.eventTracker.addEvent(this.scrollContainer, "scroll", () => {
                cancelAnimationFrame(this.scrollDelay);
                this.scrollDelay = requestAnimationFrame(() => {
                    this.checkScroll();
                });
            });
            return WinJS.Binding.processAll(element.querySelector('.tvshowsseriedetail'), options.tvshow);
        }

        checkScroll() {
            var h = this.headerbanner.clientHeight;
            var posterinbanner = this.visualstate.states.medium.active;
            if (!posterinbanner && this.headerposter.style.opacity) {
                this.headerposter.style.opacity = '';
            }
                
            var dif = (h - this.scrollContainer.scrollTop);
            if (dif <= 0) {
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

        ready(element, options) {
            this.seasonsPromise.then((seasons) => {
                if (seasons) {
                    var container = document.createDocumentFragment();
                    var p = [];
                    if (seasons.length == 1) {
                        p.push(WinJS.Promise.timeout(200).then(() => {
                            this.renderEpisodes(<HTMLElement>container, seasons[0].episodes);
                        }));
                    } else {
                        seasons.forEach((s) => {
                            p.push(this.renderSeason(container, s));
                        });
                        setImmediate(() => {
                            
                        });
                    }

                    WinJS.Promise.join(p).then(() => {
                        this.seasonsItems.appendChild(container);
                        var seasons = this.seasonsItems.querySelectorAll(".season");
                        if (seasons.length) {
                            WinJS.UI.Animation.enterPage(seasons);
                        }
                    });
                }
            });
        }

        renderSeason(container: DocumentFragment, season: Kodi.API.Videos.TVShows.Season) {
            var tmpseason = <any>season;
            return this.seasonTemplate.render(season).then((rendered) => {
                rendered.style.opacity = '0';
                container.appendChild(rendered);

                var episodesContainer = <HTMLElement>rendered.querySelector(".season-episodes");
                var episodesDesc = <HTMLElement>rendered.querySelector(".season-desc");

                if (season.episodes && season.episodes.length) {
                    tmpseason.hasEpisodes = true;
                    this.renderEpisodes(episodesContainer, season.episodes, true);
                }

                WinJSContrib.UI.tap(episodesDesc, () => {
                    rendered.classList.toggle("expanded");
                    if (!tmpseason.hasEpisodes) {
                        tmpseason.hasEpisodes = true;
                        Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then((episodes) => {
                            this.renderEpisodes(episodesContainer, episodes.episodes);
                        });
                    } else if (rendered.classList.contains("expanded")) {
                        setImmediate(() => {
                            WinJS.UI.Animation.enterPage(episodesContainer.querySelectorAll('.episode'));
                        });
                    } else {
                        $('.episode', episodesContainer).css('opacity', '0');
                    }
                });
            });
            
        }

        renderEpisodes(container: HTMLElement, episodes: Kodi.API.Videos.TVShows.Episode[], disableAnimation?: boolean) {
            var items = [];

            episodes.forEach((e) => {
                this.episodeTemplate.render(e).then((rendered) => {
                    items.push(rendered);
                    rendered.style.opacity = '0';
                    this.prepareEpisode(e, rendered);
                    container.appendChild(rendered);
                });
            });

            if (!disableAnimation) {
                setImmediate(() => {
                    WinJS.UI.Animation.enterPage(items);
                });
            }
        }

        prepareEpisode(episode: Kodi.API.Videos.TVShows.Episode, element: HTMLElement) {
            var btnplay = element.querySelector(".btnplay");
            var btnadd = element.querySelector(".btnadd");
            var btnplaylocal = <HTMLElement>element.querySelector(".btnplaylocal");
            var btndownload = <HTMLElement>element.querySelector(".btndownload");

            var path = Kodi.Utils.getNetworkPath(episode.file);
            if (path) {
                btnplaylocal.style.display = "";
                //btndownload.style.display = "";
            }

            WinJSContrib.UI.tap(btnplay, () => {
                return Kodi.API.Videos.TVShows.playEpisode(episode.episodeid);
            });

            if (btnadd) {
                WinJSContrib.UI.tap(btnadd, () => {
                    return Kodi.API.Videos.TVShows.queueEpisode(episode.episodeid);
                });
            }

            WinJSContrib.UI.tap(btnplaylocal, () => {
                return Kodi.App.playLocalMedia(episode.file);
            });
        }

        updateLayout() {
            this.checkScroll();
        }
    }

    WinJS.UI.Pages.define(TvShowsDetailPage.url, TvShowsDetailPage);
}