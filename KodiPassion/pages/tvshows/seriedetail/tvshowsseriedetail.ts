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
                return seasons;
            });
        }

        processed(element, options) {            
            return WinJS.Binding.processAll(element, options.tvshow);
        }

        ready(element, options) {
            this.seasonsPromise.then((seasons) => {
                if (seasons) {
                    var container = document.createDocumentFragment();
                    seasons.seasons.forEach((s) => {
                        this.renderSeason(container, s);
                    });
                    this.seasonsItems.appendChild(container);
                }
            });
        }

        renderSeason(container: DocumentFragment, season: Kodi.API.Videos.TVShows.Season) {
            var tmpseason = <any>season;
            this.seasonTemplate.render(season).then((rendered) => {
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
                    }
                });
            });
        }

        renderEpisodes(container: HTMLElement, episodes: Kodi.API.Videos.TVShows.Episode[]) {
            episodes.forEach((e) => {
                this.episodeTemplate.render(e, container).then(function (rendered) {

                });
            });
        }
    }

    WinJS.UI.Pages.define(TvShowsDetailPage.url, TvShowsDetailPage);
}