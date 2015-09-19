var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Videos;
        (function (Videos) {
            var TVShows;
            (function (TVShows) {
                function TVShowOptions(detailed) {
                    var res;
                    if (detailed) {
                        res = {
                            "properties": [
                                "title", "genre", "year", "rating", "plot", "studio", "mpaa", "cast", "playcount",
                                "episode", "imdbnumber", "premiered", "votes", "lastplayed", "fanart", "thumbnail",
                                "file", "originaltitle", "sorttitle", "episodeguide"
                            ]
                        };
                        if (API.version && API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                    else {
                        res = { "properties": ["thumbnail", "fanart", "title", "originaltitle", "genre", "year"], "sort": { "method": "label", "order": "ascending" } };
                        if (API.version && API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                }
                TVShows.TVShowOptions = TVShowOptions;
                function TVShowSeasonOptions(detailed) {
                    return {
                        "properties": [
                            "season", "showtitle", "playcount", "episode", "fanart", "thumbnail", "tvshowid"
                        ], "sort": { "method": "label", "order": "ascending" }
                    };
                }
                TVShows.TVShowSeasonOptions = TVShowSeasonOptions;
                function TVShowEpisodeOptions(detailed) {
                    if (detailed) {
                        return {
                            "properties": [
                                "title", "plot", "votes", "rating", "writer", "firstaired", "playcount", "runtime",
                                "director", "productioncode", "season", "episode", "originaltitle", "showtitle", "cast",
                                "streamdetails", "lastplayed", "fanart", "thumbnail", "file", "resume", "tvshowid"
                            ]
                        };
                    }
                    else {
                        return { "properties": ["thumbnail", "fanart", "tvshowid", "season", "title", "originaltitle", "showtitle", "episode", "plot"], "sort": { "method": "label", "order": "ascending" } };
                    }
                }
                TVShows.TVShowEpisodeOptions = TVShowEpisodeOptions;
                function processTVShows(tvshowset, tvshowitemcallback) {
                    if (tvshowset && tvshowset.tvshows && tvshowset.tvshows.length) {
                        tvshowset.tvshows.forEach(function (tvshow) {
                            if (tvshow.genre) {
                                var albtype = typeof tvshow.genre;
                                if (albtype === 'object') {
                                    tvshow.allgenres = tvshow.genre;
                                    tvshow.genre = tvshow.allgenres.join(', ');
                                }
                            }
                            if (tvshowitemcallback)
                                tvshowitemcallback(tvshow);
                        });
                    }
                }
                TVShows.processTVShows = processTVShows;
                function getAllTVShows() {
                    var data = TVShowOptions(true);
                    return API.kodiRequest('VideoLibrary.GetTVShows', data, false, true).then(function (tvshows) {
                        processTVShows(tvshows);
                        return WinJS.Promise.wrap(tvshows);
                    });
                }
                TVShows.getAllTVShows = getAllTVShows;
                function getTVShowsGenres() {
                    return API.kodiRequest('VideoLibrary.GetGenres', { type: "tvshow", "sort": { "method": "label", "order": "ascending" } }, false, true);
                }
                TVShows.getTVShowsGenres = getTVShowsGenres;
                function getRecentEpisodes() {
                    var data = TVShowEpisodeOptions(true);
                    return API.kodiRequest('VideoLibrary.GetRecentlyAddedEpisodes', data, false, true);
                }
                TVShows.getRecentEpisodes = getRecentEpisodes;
                function getTVShowDetails(tvshowid) {
                    var data = TVShowOptions(true);
                    data.tvshowid = tvshowid;
                    return API.kodiRequest('VideoLibrary.GetTVShowDetails', data);
                }
                TVShows.getTVShowDetails = getTVShowDetails;
                function getTVShowSeasons(tvshowid) {
                    var data = TVShowSeasonOptions(true);
                    data.tvshowid = tvshowid;
                    return API.kodiRequest('VideoLibrary.GetSeasons', data);
                }
                TVShows.getTVShowSeasons = getTVShowSeasons;
                function getTVShowEpisodes(tvshowid, seasonid) {
                    var data = TVShowEpisodeOptions(true);
                    data.tvshowid = tvshowid;
                    data.season = seasonid;
                    return API.kodiRequest('VideoLibrary.GetEpisodes', data);
                }
                TVShows.getTVShowEpisodes = getTVShowEpisodes;
                function getTVShowEpisodeDetails(episodeid) {
                    return API.kodiRequest('VideoLibrary.GetEpisodes', { episodeid: episodeid });
                }
                TVShows.getTVShowEpisodeDetails = getTVShowEpisodeDetails;
                function playEpisode(episodeid, resume) {
                    var data = { "item": { "episodeid": episodeid } };
                    if (resume) {
                        data.options = { resume: true };
                    }
                    return API.kodiRequest('Player.Open', data, true);
                }
                TVShows.playEpisode = playEpisode;
                function queueEpisode(episodeid) {
                    return API.kodiRequest('Playlist.Add', { "playlistid": 0, "item": { "episodeid": episodeid } }, true);
                }
                TVShows.queueEpisode = queueEpisode;
                function scan() {
                    return API.kodiRequest('VideoLibrary.Scan', {});
                }
                TVShows.scan = scan;
                function loadTVShow(tvshow) {
                    return Kodi.API.Videos.TVShows.getTVShowSeasons(tvshow.tvshowid).then(function (seasons) {
                        if (seasons && seasons.seasons) {
                            tvshow.seasons = seasons.seasons;
                            return WinJSContrib.Promise.parallel(tvshow.seasons, function (season) {
                                return Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                                    if (episodes && episodes.episodes) {
                                        season.episodes = episodes.episodes;
                                    }
                                });
                            });
                        }
                    }).then(function () {
                        if (tvshow.seasons && tvshow.seasons.length) {
                            tvshow.seasons.forEach(function (s) {
                                if (s.episodes && s.episodes.length) {
                                    s.allplayed = s.episodes.filter(function (e) {
                                        return e.lastplayed == null || e.lastplayed == undefined || e.lastplayed == '';
                                    }).length == 0;
                                }
                            });
                            tvshow.allplayed = tvshow.seasons.filter(function (s) {
                                return !s.allplayed;
                            }).length == 0;
                        }
                        return tvshow;
                    });
                }
                TVShows.loadTVShow = loadTVShow;
            })(TVShows = Videos.TVShows || (Videos.TVShows = {}));
        })(Videos = API.Videos || (API.Videos = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
