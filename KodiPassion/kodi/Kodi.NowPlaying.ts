module Kodi.NowPlaying {
    export interface Playing {
        id: number;
        type: string;
        position: number;
        progress: number;
        active: boolean;
        enabled: boolean;
        label: string;
        time: string;
        totaltime: string;
        thumbnail: string;
        playerid: number;
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
        id: 0, position: 0, progress: 0, enabled: 0, speed: 0, label: '', time: '', totaltime: '', type: null,
        thumbnail: undefined, playerid: 0, playlistid: 0, volume: 0, muted: false, reachable: 0,
        subtitleenabled: false, currentsubtitle: null, currentaudiostream: null,
        checking: false, hasLanguages: false, hasSubtitles: false, hasLanguagesOrSubtitles: false,
        isPlaying: false, isPlayingMusic: false, isPlayingVideo: false, isPlayingTvShow: false, isPlayingMovie: false
    });

    export var current: Playing = new ObservablePlaying();
    var intervaldelay = 10000;

    function forceCheck() {
        check(true);
    }

    WinJS.Application.addEventListener('Player.OnPlay', forceCheck);
    WinJS.Application.addEventListener('Player.OnSeek', forceCheck);
    WinJS.Application.addEventListener('Player.OnStop', forceCheck);
    WinJS.Application.addEventListener('xbmcplayercheck', forceCheck);

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
            if (standby) {
                current.checking = true;
            }

            Kodi.API.Player.currentItem(undefined).done(function (currentItem) {
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
        current.isPlaying = current.isPlayingMusic || item.type == 'unknown';
        current.subtitles = properties.subtitles;
        if (idChanged || !current.currentsubtitle || current.currentsubtitle.index != properties.currentsubtitle.index)
            current.currentsubtitle = properties.currentsubtitle;
        current.audiostreams = properties.audiostreams;
        if (idChanged || !current.currentaudiostream || current.currentaudiostream.index != properties.currentaudiostream.index)
            current.currentaudiostream = properties.currentaudiostream;
        current.subtitleenabled = properties.subtitleenabled;
        current.hasLanguages = properties.audiostreams && properties.audiostreams.length > 1;
        current.hasSubtitles = properties.subtitles && properties.subtitles.length > 0;
        current.hasLanguagesOrSubtitles = current.hasLanguages || current.hasSubtitles;

        if (properties.percentage < 0) {
            current.progress = 0;
        } else {
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
            if (!current.enabled || $('#nowplaying').css('display') === 'none') {
                current.enabled = true;
                $('#nowplaying').css('display', '').css('opacity', '1');
            }
        }
    }

    var nowPlayingInterval;

    export function init() {
        if (nowPlayingInterval)
            clearInterval(nowPlayingInterval);
        
        current.enabled = false;
        current.reachable = false;
        $('#nowplaying').css('opacity', '0');

        nowPlayingInterval = setInterval(check, intervaldelay);
        check();
        
        $('#nowplaying, #nowplayingAppBar').tap(function (args) {
            var e = args;            
            WinJS.Navigation.navigate("/pages/playlistfull/playlistfull.html");
        });
    }
}