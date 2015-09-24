module Kodi.NowPlaying {
    export interface Playing {
        id: number;
        type: string;
        position: number;
        progress: number;
        expanded: boolean;
        active: boolean;
        loadingLibrary: boolean;
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

    var ObservablePlaying = <any>WinJS.Binding.define({
        id: null, position: 0, progress: 0, enabled: 0, speed: 0, label: '', time: '', totaltime: '', type: null,
        thumbnail: undefined, playerid: null, playlistid: null, volume: 0, muted: false, reachable: 0,
        subtitleenabled: false, currentsubtitle: null, currentaudiostream: null, expanded : false,
        checking: false, hasLanguages: false, hasSubtitles: false, hasLanguagesOrSubtitles: false, loadingLibrary: false,
        isPlaying: false, isPlayingMusic: false, isPlayingVideo: false, isPlayingTvShow: false, isPlayingMovie: false
    });

    export var current: Playing = new ObservablePlaying();
    export var intervaldelay = 10000;

    function forceCheck() {        
        check(true);
    }

    WinJS.Application.addEventListener('Player.OnPlay', forceCheck);
    WinJS.Application.addEventListener('Player.OnSeek', forceCheck);
    WinJS.Application.addEventListener('Player.OnStop', forceCheck);
    var xbmcplayercheck;
    WinJS.Application.addEventListener('xbmcplayercheck', function () {
        clearTimeout(xbmcplayercheck);

        if (nowPlayingInterval)
            clearInterval(nowPlayingInterval);

        xbmcplayercheck = setTimeout(function () {
            clearInterval(nowPlayingInterval);
            nowPlayingInterval = setInterval(check, intervaldelay);
            check(true);
        }, 500);        
    });

    export function checkError(err) {
        current.id = undefined;
        current.position = undefined;
        current.playerid = undefined;
        current.playlistid = undefined;
        current.type = undefined;
        current.active = false;

        if (!current || current.enabled === true) {
            if (current) {
                current.enabled = false;
            }
        }

        if (current) {
            if (err === 'noplayer') {
                current.reachable = true;
            } else {
                current.reachable = false;
            }
        }

        current.checking = false;
    }

    export function check(standby?) {
        return new WinJS.Promise(function (complete, error) {
            if (!current)
                current = new ObservablePlaying();

            if (standby) {
                current.checking = true;
            }

            Kodi.API.properties().then(function (p) {
                current.muted = p.muted;
                current.volume = p.volume;
            }, function () {
            });

            Kodi.API.Player.currentItem(undefined).done(function (currentItem) {
                if (Kodi.API.Player.currentPlayer) {
                    var id = Kodi.API.Player.currentPlayer.playerid;
                    Kodi.API.Player.properties(id).done(function (props) {
                        if (props && currentItem) {
                            nowPlaying(props, currentItem.item);
                        }
                        if (current.checking) {
                            current.checking = false;
                        }
                        complete(current);
                    }, function (err) {
                        checkError(err);
                        complete(current);
                    });
                } else {
                    current.playerid = null;
                    complete(current);
                }
            }, function (err) {
                

                checkError(err);
                complete(current);
            });

            if (nowPlayingInterval)
                clearInterval(nowPlayingInterval);

            nowPlayingInterval = setInterval(check, intervaldelay);
        });
    }

    function nowPlaying(properties, item) {
        current.reachable = true;
        var idChanged = item.id != current.id;
        current.id = item.id;
        current.file = item.file;

        if (!properties) {
            return;
        }

        current.position = properties.position;
        current.playerid = properties.playerid;
        current.playlistid = properties.playlistid;
        current.speed = properties.speed;
        current.type = item.type;
        current.isPlayingMusic = item.type == 'song';
        current.isPlayingMovie = item.type == 'movie';
        current.isPlayingTvShow = item.type == 'episode';
        current.isPlayingVideo = current.isPlayingMovie || current.isPlayingTvShow;
        current.isPlaying = current.isPlayingVideo || current.isPlayingMusic || item.type == 'unknown';
        current.subtitles = properties.subtitles;
        if (idChanged || !current.currentsubtitle || (current.currentsubtitle && properties.currentsubtitle && current.currentsubtitle.index != properties.currentsubtitle.index))
            current.currentsubtitle = properties.currentsubtitle;
        current.audiostreams = properties.audiostreams;
        if (idChanged || !current.currentaudiostream || (current.currentaudiostream && properties.currentaudiostream && current.currentaudiostream.index != properties.currentaudiostream.index))
            current.currentaudiostream = properties.currentaudiostream;
        current.subtitleenabled = properties.subtitleenabled;
        current.hasLanguages = properties.audiostreams && properties.audiostreams.length > 1;
        current.hasSubtitles = properties.subtitles && properties.subtitles.length > 0;
        current.hasLanguagesOrSubtitles = current.hasLanguages || current.hasSubtitles;

        if (properties.percentage < 0) {
            current.progress = 0;
        } else {
            if (properties.percentage > 100)
                current.progress = 100;
            else if (properties.percentage < 0)
                current.progress = 0;
            else
                current.progress = properties.percentage;
        }

        if (properties.time.minutes < 0) {
            current.time = '00:00';
        } else {
            current.time = Kodi.Utils.formatPlayerTime(properties, properties.time);
        }
        current.totaltime = Kodi.Utils.formatPlayerTime(properties, properties.totaltime);
        current.label = item.label;
        current.label = current.label.replace(new RegExp("[_]", 'g'), " ");
        var thumb = item.thumbnail;
        if (!item.thumbnail && item.type == 'unknown') {
            thumb = 'DefaultAlbumCover.png';
        }
        current.thumbnail = thumb;

        if (!item.type) {
            current.enabled = false;
        } else {
            if (!current.enabled) {
                current.enabled = true;
            }
        }
    }

    var nowPlayingInterval;

    export function init() {
        if (nowPlayingInterval)
            clearInterval(nowPlayingInterval);

        current.enabled = false;
        current.reachable = false;

        nowPlayingInterval = setInterval(check, intervaldelay);
        check();
    }
}