module KodiPassion.UI.Pages {

    export class TvShowsDetailPage {
        public static url = "/pages/tvshows/seriedetail/tvshowsseriedetail.html";

        element: HTMLElement;
        seasonsItems: HTMLElement;
        seasonTemplate: WinJS.Binding.Template;
        episodeTemplate: WinJS.Binding.Template;
        tvshow: Kodi.API.Videos.TVShows.TVShow;
        btnDownloadMovie: HTMLElement;
        btnPlayMovieLocal: HTMLElement;
        seasonsPromise: WinJS.Promise<Kodi.API.Videos.TVShows.SeasonsResultSet>;

        init(element, options) {
            this.tvshow = options.tvshow;

            this.seasonsPromise = Kodi.API.Videos.TVShows.getTVShowSeasons(this.tvshow.tvshowid).then((seasons) => {
                if (seasons.seasons.length == 1) {
                    var season = seasons.seasons[0];
                    return Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                        (<any>season).episodes = episodes;
                        return seasons;
                    });
                }
                return seasons;
            });
        }

        processed(element, options) {
            return WinJS.Binding.processAll(element.querySelector('.tvshowsseriedetail'), options.tvshow);
        }

        ready(element, options) {
            this.seasonsPromise.then((seasons) => {
                if (seasons) {
                    var container = document.createDocumentFragment();
                    if (seasons.seasons.length == 1) {
                        this.renderEpisodes(<HTMLElement>container, (<any>seasons.seasons[0]).episodes.episodes);
                    } else {
                        seasons.seasons.forEach((s) => {
                            this.renderSeason(container, s);
                        });
                        setImmediate(() => {
                            WinJS.UI.Animation.enterPage(this.seasonsItems.querySelectorAll(".season"));
                        });
                    }
                    this.seasonsItems.appendChild(container);
                }
            });
        }

        renderSeason(container: DocumentFragment, season: Kodi.API.Videos.TVShows.Season) {
            var tmpseason = <any>season;
            this.seasonTemplate.render(season).then((rendered) => {
                rendered.style.opacity = '0';
                container.appendChild(rendered);

                var episodesContainer = <HTMLElement>rendered.querySelector(".season-episodes");
                var episodesDesc = <HTMLElement>rendered.querySelector(".season-desc");
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

        renderEpisodes(container: HTMLElement, episodes: Kodi.API.Videos.TVShows.Episode[]) {
            var items = [];

            episodes.forEach((e) => {
                this.episodeTemplate.render(e).then((rendered) => {
                    items.push(rendered);
                    rendered.style.opacity = '0';
                    this.prepareEpisode(e, rendered);
                    container.appendChild(rendered);
                });
            });

            setImmediate(() => {
                WinJS.UI.Animation.enterPage(items);
            });
        }

        prepareEpisode(episode: Kodi.API.Videos.TVShows.Episode, element: HTMLElement) {
            var btnplay = element.querySelector(".btnplay");
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

            WinJSContrib.UI.tap(btnplaylocal, () => {
                return Kodi.App.playLocalMedia(episode.file);
            });
        }
    }

    WinJS.UI.Pages.define(TvShowsDetailPage.url, TvShowsDetailPage);
}