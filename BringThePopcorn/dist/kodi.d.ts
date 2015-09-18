declare module Kodi.App {
    var DefaultGridLayout: {
        horizontal: {
            query: string;
            layout: string;
        };
        vertical: {
            query: string;
            layout: string;
        };
        snapped: {
            query: string;
            layout: string;
        };
    };
    var DefaultListLayout: {
        hor: {
            query: string;
            layout: typeof WinJS.UI.GridLayout;
            options: {
                orientation: string;
                groupHeaderPosition: string;
            };
        };
        vert: {
            query: string;
            layout: typeof WinJS.UI.GridLayout;
            options: {
                orientation: string;
                groupHeaderPosition: string;
            };
        };
    };
    var PictureRatios: {
        fanart: number;
        movieposter: number;
        tvshowepisode: number;
        album: number;
        actor: number;
    };
    function playLocalMedia(kodipath: any): WinJS.Promise<{}>;
}
interface JQuery {
    winControl(): any;
    tap(handler: (eventObject: HTMLElement) => any): any;
    untap(): any;
    afterTransition(callback?: (JQuery) => void): WinJS.Promise<any>;
    afterAnimation(callback?: (JQuery) => void): WinJS.Promise<any>;
    classBasedAnimation(className: string): any;
    winJSAnimation(animName: string, offset?: any): any;
    scrollToView(horizontal?: boolean): any;
    scrollInView(offset: number): any;
    ctrlShow(elt?: any): any;
    ctrlHide(): any;
}

declare module Kodi.Data {
    interface IMediaLibrary {
        artists: API.Music.Artist[];
        musicPictures: any[];
        moviesPictures: any[];
        tvshowsPictures: any[];
        picturesPictures: any[];
        music: API.Music.AlbumsResultSet;
        movies: API.Videos.Movies.MoviesResultSet;
        movieSets: API.Videos.Movies.MoviesSetResultSet;
        tvshows: API.Videos.TVShows.TVShowsResultSet;
        musicGenres: API.GenresResultSet;
        movieGenres: API.GenresResultSet;
        tvshowGenres: API.GenresResultSet;
        recentMovies: API.Videos.Movies.MoviesResultSet;
        recentMusic: API.Music.AlbumsResultSet;
        tvshowRecentEpisodes: API.Videos.TVShows.EpisodesResultSet;
        pictures: any;
        profiles: any;
        currentprofile: any;
    }
    var SearchDefinitions: {
        movies: {
            definition: {
                fields: {
                    "label": number;
                    "allgenres": number;
                };
            };
        };
        music: {
            definition: {
                fields: {
                    "label": number;
                    "allartists": number;
                    "allgenres": number;
                };
            };
        };
        artists: {
            definition: {
                fields: {
                    "label": number;
                };
            };
        };
        tvshows: {
            definition: {
                fields: {
                    "label": number;
                    "allgenres": number;
                };
            };
        };
    };
    function checkConnectivity(): WinJS.Promise<any>;
    function loadRootData(forceLoad?: boolean): WinJS.IPromise<IMediaLibrary>;
    function checkSystemProperties(): void;
    function search(queryText: any): WinJS.Promise<{}>;
    function scanMovies(): void;
    function scanTvshows(): void;
    function scanAlbums(): void;
}

declare module Kodi.NowPlaying {
    interface Playing {
        id: number;
        type: string;
        position: number;
        progress: number;
        expanded: boolean;
        active: boolean;
        enabled: boolean;
        label: string;
        time: string;
        totaltime: string;
        thumbnail: string;
        playerid?: number;
        playlistid: number;
        volume: number;
        muted: boolean;
        reachable: boolean;
        checking: boolean;
        subtitles: any;
        currentsubtitle: any;
        audiostreams: any;
        currentaudiostream: any;
        subtitleenabled: any;
        bind: any;
        unbind: any;
        file: any;
        speed: number;
        isPlayingMusic: boolean;
        isPlayingMovie: boolean;
        isPlayingTvShow: boolean;
        isPlayingVideo: boolean;
        isPlaying: boolean;
        hasLanguages: boolean;
        hasSubtitles: boolean;
        hasLanguagesOrSubtitles: boolean;
    }
    var current: Playing;
    var intervaldelay: number;
    function checkError(err: any): void;
    function check(standby?: any): WinJS.Promise<{}>;
    function init(): void;
}

declare module Kodi.Settings {
    interface KodiServerSetting {
        name: string;
        host: string;
        port: number;
        user: string;
        password: string;
        macAddress: string[];
    }
    function save(initialName: any, setting: any, setDefault: any): void;
    function remove(name: any): void;
    function getSetting(name: any): KodiServerSetting;
    function load(): any;
    function defaultConnection(): any;
    function list(): any[];
}

declare module Kodi.Utils {
    function formatPlayerTime(props: any, data: any): string;
    var toThumbnailBg: Function;
    var toThumbnailAlbumBg: Function;
    var toThumbnailActorBg: Function;
    var toThumbnailImg: Function;
    var toThumbnailAlbumImg: Function;
    var toThumbnailActorImg: Function;
    var toFormatedPlayerTime: Function;
    var toDuration: Function;
    var rating: Function;
    var stringlist: Function;
    var showIfNetworkPath: Function;
    var searchItemKind: Function;
    var isCurrent: Function;
    function getNetworkPath(mediapath: any): any;
}

declare module Kodi.WOL {
    function wakeUp(macAddress: string[]): WinJS.IPromise<any>;
}

declare module Kodi.API.Input {
    function mute(mute: boolean): WinJS.Promise<any>;
    function volumeMute(): WinJS.Promise<any>;
    function volumeUnmute(): WinJS.Promise<any>;
    function volume(volume: any): WinJS.Promise<any>;
    function back(): WinJS.Promise<any>;
    function home(): WinJS.Promise<any>;
    function select(): WinJS.Promise<any>;
    function menu(): WinJS.Promise<any>;
    function info(): WinJS.Promise<any>;
    function up(): WinJS.Promise<any>;
    function down(): WinJS.Promise<any>;
    function left(): WinJS.Promise<any>;
    function right(): WinJS.Promise<any>;
    function activateWindow(window: any, parameters: any): WinJS.Promise<{}>;
    function openMovies(): WinJS.Promise<{}>;
    function openTvShows(): WinJS.Promise<{}>;
    function openMusic(): WinJS.Promise<{}>;
    function openPictures(): WinJS.Promise<{}>;
}

declare module Kodi.API.Music {
    interface Album {
        albumid: number;
        title: string;
        label: string;
        description?: string;
        allartists: string[];
        artist: string;
        allgenres: string[];
        genre: string;
        theme?: string;
        mood?: string;
        style: string;
        type?: string;
        albumlabel: string;
        rating: number;
        year: number;
        musicbrainzalbumid?: number;
        musicbrainzalbumartistid?: number;
        fanart: string;
        thumbnail: string;
        artistid?: number;
        reducedtitle: string;
        reducedartist: string;
        reducedgenre: string;
    }
    interface AlbumsResultSet extends API.ApiResultSet {
        albums: Album[];
    }
    interface AlbumDetailResultSet extends API.ApiResultSet {
        albumdetails: Album;
    }
    interface Song {
        songid: number;
        track: string;
        file: string;
        duration: number;
    }
    interface SongsResultSet extends API.ApiResultSet {
        songs: Song[];
    }
    interface Artist {
        label: string;
        reducedlabel?: string;
    }
    function processAlbums(albumset: AlbumsResultSet, albumitemcallback?: (Album) => void): void;
    function getGenres(): WinJS.Promise<GenresResultSet>;
    function getArtists(): WinJS.Promise<{}>;
    function scan(): WinJS.Promise<{}>;
    function getAllAlbums(): WinJS.IPromise<AlbumsResultSet>;
    function getAlbumDetails(albumid: any): WinJS.Promise<AlbumDetailResultSet>;
    function getRecentAlbums(): WinJS.IPromise<AlbumsResultSet>;
    function getAlbumsByArtist(artistid: any): WinJS.IPromise<AlbumsResultSet>;
    function getAlbumsByGenre(genreid: any): WinJS.IPromise<AlbumsResultSet>;
    function albumSongs(albumid: any): WinJS.Promise<SongsResultSet>;
    function playAlbum(albumid: any): WinJS.Promise<any>;
    function queueAlbum(albumid: any): WinJS.Promise<any>;
    function playSong(songid: any): WinJS.Promise<any>;
    function queueSong(songid: any): WinJS.Promise<any>;
}

declare module Kodi.API.Player {
    var currentPlayer: any;
    var currentPlayerProperties: any;
    function getActivePlayer(): WinJS.Promise<any>;
    function currentItem(playerid: any): WinJS.IPromise<any>;
    function properties(playerid: any): WinJS.IPromise<any>;
    function play(playerid: any, index: any): WinJS.IPromise<any>;
    function pause(playerid: any, index: any): WinJS.IPromise<any>;
    function playPause(playerid: any, index: any): WinJS.IPromise<any>;
    function stop(playerid: any, index: any): WinJS.Promise<any>;
    function open(path: any, recursive: any): WinJS.Promise<any>;
    function add(path: any, recursive: any): WinJS.Promise<any>;
    function moveTo(playerid: any, index: any): WinJS.Promise<any>;
    function next(playerid: any): WinJS.Promise<any>;
    function previous(playerid: any): WinJS.Promise<any>;
    function moveUp(playerid: any): WinJS.Promise<any>;
    function moveDown(playerid: any): WinJS.Promise<any>;
    function moveLeft(playerid: any): WinJS.Promise<any>;
    function moveRight(playerid: any): WinJS.Promise<any>;
    function rotate(playerid: any): WinJS.Promise<any>;
    function setAudioStream(playerid: any, stream: any): WinJS.Promise<any>;
    function setSubtitle(playerid: any, subtitle: any): WinJS.Promise<any>;
    function seek(playerid: any, val: any): WinJS.Promise<any>;
}

declare module Kodi.API {
    var defaultCallTimeout: number;
    var currentSettings: Kodi.Settings.KodiServerSetting;
    var version: any;
    interface KodiRequest {
        albumid?: number;
        genreid?: number;
        artistid?: number;
        movieid?: number;
        tvshowid?: number;
        season?: number;
        properties?: string[];
        sort?: {
            method: string;
            order: string;
        };
    }
    function redirectToSettings(error: any): WinJS.IPromise<{}>;
    function kodiServerRequest<T>(setting: Kodi.Settings.KodiServerSetting, methodname: any, params?: any, forceCheck?: any, ignoreXBMCErrors?: any, retries?: any, timeout?: number): WinJS.Promise<T>;
    function testServerSetting(setting: Kodi.Settings.KodiServerSetting): WinJS.Promise<any>;
    function kodiRequest<T>(methodname: any, params?: any, forceCheck?: any, ignoreXBMCErrors?: any, retries?: any, timeout?: number): WinJS.Promise<T>;
    function kodiThumbnail(thumburl: any): string;
    function getFilePath(path: any): string;
    function introspect(): WinJS.Promise<{}>;
    function properties(): WinJS.Promise<any>;
    interface ApiCall {
        error?: any;
    }
    interface ApiResultSet extends ApiCall {
        limits: any;
    }
    interface Genre {
        label: string;
    }
    interface GenresResultSet extends ApiResultSet {
        genres: Genre[];
    }
}
declare module Kodi.API.Profiles {
    function getCurrentProfile(): WinJS.Promise<any>;
    function getProfiles(): WinJS.Promise<any>;
    function loadProfile(name: any, prompt?: any, password?: any): WinJS.Promise<{}>;
}
declare module Kodi.API.PlayList {
    function getProperties(playlistid: any): WinJS.Promise<{}>;
    function getItems(playlistid: any): WinJS.Promise<any>;
    function removeAt(playlistid: any, position: any): WinJS.Promise<{}>;
    function swap(playlistid: any, position: any, position2: any): WinJS.Promise<{}>;
    function insertSong(playlistid: any, position: any, songId: any): WinJS.Promise<{}>;
}
declare module Kodi.API.Files {
    function getPicturesDirectory(directory: any): WinJS.Promise<{}>;
    function getPicturesSources(): WinJS.Promise<{}>;
    function download(path: any): WinJS.Promise<{}>;
    function getDirectory(media: any, directory: any): WinJS.Promise<{}>;
    function getSources(media: any): WinJS.Promise<{}>;
}
declare module Kodi.API.System {
    function shutdown(): WinJS.Promise<{}>;
    function hibernate(): WinJS.Promise<{}>;
    function reboot(): WinJS.Promise<{}>;
    function properties(): WinJS.Promise<{}>;
}

declare module Kodi.API.Videos.TVShows {
    interface TVShow extends ApiCall {
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
    interface TVShowsResultSet extends ApiResultSet {
        tvshows: TVShow[];
    }
    interface TVShowsDetailsResultSet extends ApiResultSet {
        tvshowdetails: TVShow;
    }
    interface Season extends ApiCall {
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
    interface SeasonsResultSet extends ApiResultSet {
        seasons: TVShows.Season[];
    }
    interface Episode extends ApiCall {
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
        resume?: {
            position: number;
            total: number;
        };
        tvshowid: number;
    }
    interface EpisodesResultSet extends ApiResultSet {
        episodes: Episode[];
    }
    function TVShowOptions(detailed?: any): KodiRequest;
    function TVShowSeasonOptions(detailed?: any): KodiRequest;
    function TVShowEpisodeOptions(detailed?: any): KodiRequest;
    function processTVShows(tvshowset: TVShowsResultSet, tvshowitemcallback?: (TVShow) => any): void;
    function getAllTVShows(): WinJS.IPromise<TVShowsResultSet>;
    function getTVShowsGenres(): WinJS.Promise<GenresResultSet>;
    function getRecentEpisodes(): WinJS.Promise<EpisodesResultSet>;
    function getTVShowDetails(tvshowid: any): WinJS.Promise<TVShowsDetailsResultSet>;
    function getTVShowSeasons(tvshowid: any): WinJS.Promise<SeasonsResultSet>;
    function getTVShowEpisodes(tvshowid: any, seasonid: any): WinJS.Promise<EpisodesResultSet>;
    function getTVShowEpisodeDetails(episodeid: any): WinJS.Promise<any>;
    function playEpisode(episodeid: any, resume?: boolean): WinJS.Promise<any>;
    function queueEpisode(episodeid: any): WinJS.Promise<any>;
    function scan(): WinJS.Promise<any>;
    function loadTVShow(tvshow: TVShow): WinJS.IPromise<TVShow>;
}

declare module Kodi.API.Videos.Movies {
    interface Movie extends ApiCall {
        movieid: number;
        label: string;
        title: string;
        genre: string;
        allgenres: string[];
        year: string;
        rating: string;
        director: string;
        trailer?: string;
        tagline: string;
        plot?: string;
        plotoutline?: string;
        originaltitle: string;
        lastplayed?: string;
        playcount: string;
        writer?: string;
        studio?: string;
        mpaa?: string;
        cast?: Cast[];
        country?: string;
        set?: string;
        showlink?: string;
        streamdetails?: string;
        votes: string;
        fanart: string;
        thumbnail: string;
        file?: string;
        sorttitle?: string;
        resume?: {
            position: number;
            total: number;
        };
        setid?: string;
        art?: any;
        reducedtitle: string;
        reducedgenre: string;
    }
    interface MovieSet extends ApiCall {
        movieid: number;
        label: string;
        title: string;
        genre: string;
        allgenres: string[];
        year: string;
        rating: string;
        director: string;
        trailer?: string;
        tagline: string;
        plot?: string;
        plotoutline?: string;
        originaltitle: string;
        lastplayed?: string;
        playcount: string;
        writer?: string;
        studio?: string;
        mpaa?: string;
        cast?: Cast[];
        country?: string;
        set?: string;
        showlink?: string;
        streamdetails?: string;
        votes: string;
        fanart: string;
        thumbnail: string;
        file?: string;
        sorttitle?: string;
        resume?: string;
        setid?: string;
    }
    interface Cast {
        role: string;
        thumbnail: string;
        name: string;
    }
    interface MovieResultSet extends ApiResultSet {
        moviedetails: Movie;
    }
    interface MoviesResultSet extends ApiResultSet {
        movies: Movie[];
    }
    interface MoviesSetResultSet extends ApiResultSet {
        items: MovieSet[];
    }
    function MovieOptions(detailed?: any): KodiRequest;
    function MovieSetOptions(detailed?: any): KodiRequest;
    function processMovies(movieset: MoviesResultSet, movieItemCallback?: (Movie) => any): void;
    function getMovieGenres(): WinJS.Promise<{}>;
    function getAllMovies(): WinJS.IPromise<MoviesResultSet>;
    function getAllMovieSets(): WinJS.Promise<MoviesSetResultSet>;
    function getMovieDetails(movieid: any): WinJS.Promise<MovieResultSet>;
    function getRecentMovies(): WinJS.Promise<MoviesResultSet>;
    function playMovie(movieid: any, resume?: boolean): WinJS.Promise<any>;
    function scan(): WinJS.Promise<any>;
    function clean(): WinJS.Promise<any>;
}

declare module Kodi.API.Websocket {
    var current: any;
    function init(setting: Kodi.Settings.KodiServerSetting): void;
    function close(): void;
    function isReady(): boolean;
    function sendData(data: any, forceCheck: any, ignoreXBMCErrors: any): WinJS.IPromise<{
        message: string;
    }>;
}
