module Kodi.API.Videos.TVShows {
    export interface TVShow extends ApiCall {
        tvshowid: number;
        label: string;
        title: string;
        genre: string;
        allgenres: string[];
        year: string;
        rating: string;
        plot: string;
        studio: string;
        mpaa: string;
        cast: any;
        playcount: string;
        episode: string;
        imdbnumber: string;
        premiered: string;
        votes: string;
        lastplayed: string;
        fanart: string;
        thumbnail: string;
        file: string;
        originaltitle: string;
        sorttitle: string;
        episodeguide: string;
        art?: any;
        reducedtitle: string;
        reducedgenre: string;
        seasons?: Season[];
        allplayed?: boolean;
    }

    export interface TVShowsResultSet extends ApiResultSet {
        tvshows: TVShow[];
    }

    export interface TVShowsDetailsResultSet extends ApiResultSet {
        tvshowdetails: TVShow;
    }

    export interface Season extends ApiCall {
        season: number;
        label: string;
        showtitle: string;
        playcount: number;
        episode: string;
        fanart: string;
        thumbnail: string;
        tvshowid: number;
        episodes: Episode[];
        allplayed?: boolean;
    }

    export interface SeasonsResultSet extends ApiResultSet {
        seasons: TVShows.Season[];
    }

    export interface Episode extends ApiCall {
        episodeid: number;
        title: string;
        plot: string;
        votes: string;
        rating: string;
        writer: string;
        firstaired: string;
        playcount: number;
        runtime: string;
        director: string;
        productioncode: string;
        season: number;
        episode: string;
        originaltitle: string;
        showtitle: string;
        cast: any;
        streamdetails: string;
        lastplayed: string;
        fanart: string;
        thumbnail: string;
        file: string;
        resume?: { position: number, total: number };
        tvshowid: number;
    }

    export interface EpisodesResultSet extends ApiResultSet {
        episodes: Episode[];
    }

    export function TVShowOptions(detailed?): KodiRequest {
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
        } else {
            res = { "properties": ["thumbnail", "fanart", "title", "originaltitle", "genre", "year"], "sort": { "method": "label", "order": "ascending" } };
            if (API.version && API.version.major >= 12) {
                res.properties.push("art");
            }
            return res;
        }
    }

    export function TVShowSeasonOptions(detailed?): KodiRequest {
        return {
            "properties": [
                "season", "showtitle", "playcount", "episode", "fanart", "thumbnail", "tvshowid"
            ], "sort": { "method": "label", "order": "ascending" }
        };
    }

    export function TVShowEpisodeOptions(detailed?): KodiRequest {
        if (detailed) {
            return {
                "properties": [
                    "title", "plot", "votes", "rating", "writer", "firstaired", "playcount", "runtime",
                    "director", "productioncode", "season", "episode", "originaltitle", "showtitle", "cast",
                    "streamdetails", "lastplayed", "fanart", "thumbnail", "file", "resume", "tvshowid"
                ]
            };
        } else {
            return { "properties": ["thumbnail", "fanart", "tvshowid", "season", "title", "originaltitle", "showtitle", "episode", "plot"], "sort": { "method": "label", "order": "ascending" } };
        }
    }

    export function processTVShows(tvshowset: TVShowsResultSet, tvshowitemcallback?: (TVShow) => any) {
        if (tvshowset && tvshowset.tvshows && tvshowset.tvshows.length) {
            tvshowset.tvshows.forEach(function (tvshow) {
                if (tvshow.genre) {
                    var albtype = typeof tvshow.genre;
                    if (albtype === 'object') {
                        tvshow.allgenres = <any>tvshow.genre;
                        tvshow.genre = tvshow.allgenres.join(', ');
                    }
                }

                if (tvshowitemcallback)
                    tvshowitemcallback(tvshow);
            });
        }
    }

    export function getAllTVShows() {
        var data = TVShowOptions(true);
        return API.kodiRequest<TVShowsResultSet>('VideoLibrary.GetTVShows', data, false, true).then(function (tvshows) {
            processTVShows(tvshows);
            return WinJS.Promise.wrap(tvshows);
        });
    }

    export function getTVShowsGenres() {
        return API.kodiRequest<GenresResultSet>('VideoLibrary.GetGenres', { type: "tvshow", "sort": { "method": "label", "order": "ascending" } }, false, true);
    }

    export function getRecentEpisodes() {
        var data = TVShowEpisodeOptions(true);
        return API.kodiRequest<EpisodesResultSet>('VideoLibrary.GetRecentlyAddedEpisodes', data, false, true);
    }

    export function getTVShowDetails(tvshowid) {
        var data = TVShowOptions(true);
        data.tvshowid = tvshowid;
        return API.kodiRequest<TVShowsDetailsResultSet>('VideoLibrary.GetTVShowDetails', data);
    }

    export function getTVShowSeasons(tvshowid) {
        var data = TVShowSeasonOptions(true);
        data.tvshowid = tvshowid;
        return API.kodiRequest<SeasonsResultSet>('VideoLibrary.GetSeasons', data);
    }

    export function getTVShowEpisodes(tvshowid, seasonid) {
        var data = TVShowEpisodeOptions(true);
        data.tvshowid = tvshowid;
        data.season = seasonid;
        return API.kodiRequest<EpisodesResultSet>('VideoLibrary.GetEpisodes', data);
    }

    export function getTVShowEpisodeDetails(episodeid) {
        return API.kodiRequest<any>('VideoLibrary.GetEpisodes', { episodeid: episodeid });
    }

    export function playEpisode(episodeid, resume?: boolean) {
        var data = <any>{ "item": { "episodeid": episodeid } };
        if (resume) {
            data.options = { resume: true };
        }
        return API.kodiRequest<any>('Player.Open', data, true);
    }

    export function queueEpisode(episodeid) {
        return API.kodiRequest<any>('Playlist.Add', { "playlistid": 0, "item": { "episodeid": episodeid } }, true);
    }

    export function scan() {
        return API.kodiRequest<any>('VideoLibrary.Scan', {});
    }

    export function loadTVShow(tvshow: TVShow) {
        return Kodi.API.Videos.TVShows.getTVShowSeasons(tvshow.tvshowid).then(function (seasons) {
            if (seasons && seasons.seasons) {
                tvshow.seasons = seasons.seasons;
                return WinJSContrib.Promise.parallel(tvshow.seasons, function (season: Kodi.API.Videos.TVShows.Season) {
                    return Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                        if (episodes && episodes.episodes) {
                            season.episodes = episodes.episodes;
                        }
                    });
                });
            }
        }).then(function () {
            if (tvshow.seasons && tvshow.seasons.length) {
                tvshow.seasons.forEach((s) => {
                    if (s.episodes && s.episodes.length) {
                        s.allplayed = s.episodes.filter((e) => {
                            return e.lastplayed == null || e.lastplayed == undefined || e.lastplayed == '';
                        }).length == 0;
                    }
                });
                tvshow.allplayed = tvshow.seasons.filter((s) => {
                    return !s.allplayed;
                }).length == 0;
            }
            return tvshow;
        });
    }
}