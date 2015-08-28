var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var TvShowsDetailPage = (function () {
                function TvShowsDetailPage() {
                }
                TvShowsDetailPage.prototype.init = function (element, options) {
                    this.tvshow = options.tvshow;
                    this.seasonsPromise = Kodi.API.Videos.TVShows.getTVShowSeasons(this.tvshow.tvshowid).then(function (seasons) {
                        return seasons;
                    });
                };
                TvShowsDetailPage.prototype.processed = function (element, options) {
                    return WinJS.Binding.processAll(element, options.tvshow);
                };
                TvShowsDetailPage.prototype.ready = function (element, options) {
                    var _this = this;
                    this.seasonsPromise.then(function (seasons) {
                        if (seasons) {
                            var container = document.createDocumentFragment();
                            seasons.seasons.forEach(function (s) {
                                _this.renderSeason(container, s);
                            });
                            _this.seasonsItems.appendChild(container);
                        }
                    });
                };
                TvShowsDetailPage.prototype.renderSeason = function (container, season) {
                    var _this = this;
                    var tmpseason = season;
                    this.seasonTemplate.render(season).then(function (rendered) {
                        container.appendChild(rendered);
                        var episodesContainer = rendered.querySelector(".season-episodes");
                        var episodesDesc = rendered.querySelector(".season-desc");
                        WinJSContrib.UI.tap(episodesDesc, function () {
                            rendered.classList.toggle("expanded");
                            if (!tmpseason.hasEpisodes) {
                                tmpseason.hasEpisodes = true;
                                Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                                    _this.renderEpisodes(episodesContainer, episodes.episodes);
                                });
                            }
                        });
                    });
                };
                TvShowsDetailPage.prototype.renderEpisodes = function (container, episodes) {
                    var _this = this;
                    episodes.forEach(function (e) {
                        _this.episodeTemplate.render(e, container).then(function (rendered) {
                        });
                    });
                };
                TvShowsDetailPage.url = "/pages/tvshows/seriedetail/tvshowsseriedetail.html";
                return TvShowsDetailPage;
            })();
            Pages.TvShowsDetailPage = TvShowsDetailPage;
            WinJS.UI.Pages.define(TvShowsDetailPage.url, TvShowsDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=tvshowsseriedetail.js.map