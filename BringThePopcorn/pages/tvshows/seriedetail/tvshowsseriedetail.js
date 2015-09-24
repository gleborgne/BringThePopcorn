var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var TvShowsDetailPage = (function () {
                function TvShowsDetailPage() {
                }
                TvShowsDetailPage.prototype.init = function (element, options) {
                    this.tvshow = options.tvshow;
                    if (this.tvshow.seasons && this.tvshow.seasons.length) {
                        this.seasonsPromise = WinJS.Promise.wrap(this.tvshow.seasons);
                    }
                    else {
                        this.seasonsPromise = Kodi.API.Videos.TVShows.getTVShowSeasons(this.tvshow.tvshowid).then(function (seasons) {
                            if (seasons.seasons.length == 1) {
                                var season = seasons.seasons[0];
                                return Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                                    season.episodes = episodes.episodes;
                                    return seasons.seasons;
                                });
                            }
                            return seasons.seasons;
                        });
                    }
                };
                TvShowsDetailPage.prototype.processed = function (element, options) {
                    var _this = this;
                    this.eventTracker.addEvent(this.scrollContainer, "scroll", function () {
                        cancelAnimationFrame(_this.scrollDelay);
                        _this.scrollDelay = requestAnimationFrame(function () {
                            _this.checkScroll();
                        });
                    });
                    return WinJS.Binding.processAll(element.querySelector('.tvshowsseriedetail'), options.tvshow);
                };
                TvShowsDetailPage.prototype.checkScroll = function () {
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
                    }
                    else {
                        var val = (dif / h) + '';
                        this.headerbanner.style.opacity = val;
                        if (posterinbanner) {
                            this.headerposter.style.opacity = val;
                        }
                    }
                };
                TvShowsDetailPage.prototype.ready = function (element, options) {
                    var _this = this;
                    this.seasonsPromise.then(function (seasons) {
                        if (seasons) {
                            var container = document.createDocumentFragment();
                            var p = [];
                            if (seasons.length == 1) {
                                p.push(WinJS.Promise.timeout(200).then(function () {
                                    _this.renderEpisodes(container, seasons[0].episodes);
                                }));
                            }
                            else {
                                seasons.forEach(function (s) {
                                    p.push(_this.renderSeason(container, s));
                                });
                                setImmediate(function () {
                                });
                            }
                            WinJS.Promise.join(p).then(function () {
                                _this.seasonsItems.appendChild(container);
                                var seasons = _this.seasonsItems.querySelectorAll(".season");
                                if (seasons.length) {
                                    WinJS.UI.Animation.enterPage(seasons);
                                }
                            });
                        }
                    });
                };
                TvShowsDetailPage.prototype.renderSeason = function (container, season) {
                    var _this = this;
                    var tmpseason = season;
                    return this.seasonTemplate.render(season).then(function (rendered) {
                        rendered.style.opacity = '0';
                        container.appendChild(rendered);
                        var episodesContainer = rendered.querySelector(".season-episodes");
                        var episodesDesc = rendered.querySelector(".season-desc");
                        if (season.episodes && season.episodes.length) {
                            tmpseason.hasEpisodes = true;
                            _this.renderEpisodes(episodesContainer, season.episodes, true);
                        }
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
                TvShowsDetailPage.prototype.renderEpisodes = function (container, episodes, disableAnimation) {
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
                    if (!disableAnimation) {
                        setImmediate(function () {
                            WinJS.UI.Animation.enterPage(items);
                        });
                    }
                };
                TvShowsDetailPage.prototype.prepareEpisode = function (episode, element) {
                    var btnplay = element.querySelector(".btnplay");
                    var btnadd = element.querySelector(".btnadd");
                    var btnplaylocal = element.querySelector(".btnplaylocal");
                    var btndownload = element.querySelector(".btndownload");
                    var path = Kodi.Utils.getNetworkPath(episode.file);
                    if (path) {
                        btnplaylocal.style.display = "";
                    }
                    WinJSContrib.UI.tap(btnplay, function () {
                        return Kodi.API.Videos.TVShows.playEpisode(episode.episodeid);
                    });
                    if (btnadd) {
                        WinJSContrib.UI.tap(btnadd, function () {
                            return Kodi.API.Videos.TVShows.queueEpisode(episode.episodeid);
                        });
                    }
                    WinJSContrib.UI.tap(btnplaylocal, function () {
                        return Kodi.App.playLocalMedia(episode.file);
                    });
                };
                TvShowsDetailPage.prototype.updateLayout = function () {
                    this.checkScroll();
                };
                TvShowsDetailPage.url = "/pages/tvshows/seriedetail/tvshowsseriedetail.html";
                return TvShowsDetailPage;
            })();
            Pages.TvShowsDetailPage = TvShowsDetailPage;
            WinJS.UI.Pages.define(TvShowsDetailPage.url, TvShowsDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
