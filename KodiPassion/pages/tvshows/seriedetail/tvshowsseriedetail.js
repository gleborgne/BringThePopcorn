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
                        if (seasons.seasons.length == 1) {
                            var season = seasons.seasons[0];
                            return Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                                season.episodes = episodes;
                                return seasons;
                            });
                        }
                        return seasons;
                    });
                };
                TvShowsDetailPage.prototype.processed = function (element, options) {
                    return WinJS.Binding.processAll(element.querySelector('.tvshowsseriedetail'), options.tvshow);
                };
                TvShowsDetailPage.prototype.ready = function (element, options) {
                    var _this = this;
                    this.seasonsPromise.then(function (seasons) {
                        if (seasons) {
                            var container = document.createDocumentFragment();
                            if (seasons.seasons.length == 1) {
                                _this.renderEpisodes(container, seasons.seasons[0].episodes.episodes);
                            }
                            else {
                                seasons.seasons.forEach(function (s) {
                                    _this.renderSeason(container, s);
                                });
                                setImmediate(function () {
                                    WinJS.UI.Animation.enterPage(_this.seasonsItems.querySelectorAll(".season"));
                                });
                            }
                            _this.seasonsItems.appendChild(container);
                        }
                    });
                };
                TvShowsDetailPage.prototype.renderSeason = function (container, season) {
                    var _this = this;
                    var tmpseason = season;
                    this.seasonTemplate.render(season).then(function (rendered) {
                        rendered.style.opacity = '0';
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
                            else if (rendered.classList.contains("expanded")) {
                                setImmediate(function () {
                                    WinJS.UI.Animation.enterPage(episodesContainer.querySelectorAll('.episode'));
                                });
                            }
                            else {
                                $('.episode', episodesContainer).css('opacity', '0');
                            }
                        });
                    });
                };
                TvShowsDetailPage.prototype.renderEpisodes = function (container, episodes) {
                    var _this = this;
                    var items = [];
                    episodes.forEach(function (e) {
                        _this.episodeTemplate.render(e).then(function (rendered) {
                            items.push(rendered);
                            rendered.style.opacity = '0';
                            _this.prepareEpisode(e, rendered);
                            container.appendChild(rendered);
                        });
                    });
                    setImmediate(function () {
                        WinJS.UI.Animation.enterPage(items);
                    });
                };
                TvShowsDetailPage.prototype.prepareEpisode = function (episode, element) {
                    var btnplay = element.querySelector(".btnplay");
                    var btnplaylocal = element.querySelector(".btnplaylocal");
                    var btndownload = element.querySelector(".btndownload");
                    var path = Kodi.Utils.getNetworkPath(episode.file);
                    if (path) {
                        btnplaylocal.style.display = "";
                    }
                    WinJSContrib.UI.tap(btnplay, function () {
                        return Kodi.API.Videos.TVShows.playEpisode(episode.episodeid);
                    });
                    WinJSContrib.UI.tap(btnplaylocal, function () {
                        return Kodi.App.playLocalMedia(episode.file);
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