var Kodi;
(function (Kodi) {
    var NowPlaying;
    (function (NowPlaying) {
        var ObservablePlaying = WinJS.Binding.define({
            id: 0, position: 0, progress: 0, enabled: 0, speed: 0, label: '', time: '', totaltime: '', type: null,
            thumbnail: undefined, playerid: 0, playlistid: 0, volume: 0, muted: false, reachable: 0,
            subtitleenabled: false, currentsubtitle: null, currentaudiostream: null,
            checking: false, hasLanguages: false, hasSubtitles: false, hasLanguagesOrSubtitles: false,
            isPlaying: false, isPlayingMusic: false, isPlayingVideo: false, isPlayingTvShow: false, isPlayingMovie: false
        });
        NowPlaying.current = new ObservablePlaying();
        var intervaldelay = 10000;
        function forceCheck() {
            check(true);
        }
        WinJS.Application.addEventListener('Player.OnPlay', forceCheck);
        WinJS.Application.addEventListener('Player.OnSeek', forceCheck);
        WinJS.Application.addEventListener('Player.OnStop', forceCheck);
        WinJS.Application.addEventListener('xbmcplayercheck', forceCheck);
        function checkError(err) {
            NowPlaying.current.id = undefined;
            NowPlaying.current.position = undefined;
            NowPlaying.current.playerid = undefined;
            NowPlaying.current.playlistid = undefined;
            NowPlaying.current.type = undefined;
            NowPlaying.current.active = false;
            if (!NowPlaying.current || NowPlaying.current.enabled === true) {
                if (NowPlaying.current) {
                    NowPlaying.current.enabled = false;
                }
            }
            if (NowPlaying.current) {
                if (err === 'noplayer') {
                    NowPlaying.current.reachable = true;
                }
                else {
                    NowPlaying.current.reachable = false;
                }
            }
            NowPlaying.current.checking = false;
        }
        NowPlaying.checkError = checkError;
        function check(standby) {
            return new WinJS.Promise(function (complete, error) {
                if (standby) {
                    NowPlaying.current.checking = true;
                }
                Kodi.API.Player.currentItem(undefined).done(function (currentItem) {
                    var id = Kodi.API.Player.currentPlayer.playerid;
                    Kodi.API.Player.properties(id).done(function (props) {
                        if (props && currentItem) {
                            nowPlaying(props, currentItem.item);
                        }
                        if (NowPlaying.current.checking) {
                            NowPlaying.current.checking = false;
                        }
                        complete(NowPlaying.current);
                    }, function (err) {
                        checkError(err);
                        complete(NowPlaying.current);
                    });
                }, function (err) {
                    checkError(err);
                    complete(NowPlaying.current);
                });
                if (nowPlayingInterval)
                    clearInterval(nowPlayingInterval);
                nowPlayingInterval = setInterval(check, intervaldelay);
            });
        }
        NowPlaying.check = check;
        function nowPlaying(properties, item) {
            NowPlaying.current.reachable = true;
            var idChanged = item.id != NowPlaying.current.id;
            NowPlaying.current.id = item.id;
            NowPlaying.current.file = item.file;
            if (!properties) {
                return;
            }
            NowPlaying.current.position = properties.position;
            NowPlaying.current.playerid = properties.playerid;
            NowPlaying.current.playlistid = properties.playlistid;
            NowPlaying.current.speed = properties.speed;
            NowPlaying.current.type = item.type;
            NowPlaying.current.isPlayingMusic = item.type == 'song';
            NowPlaying.current.isPlayingMovie = item.type == 'movie';
            NowPlaying.current.isPlayingTvShow = item.type == 'episode';
            NowPlaying.current.isPlayingVideo = NowPlaying.current.isPlayingMovie || NowPlaying.current.isPlayingTvShow;
            NowPlaying.current.isPlaying = NowPlaying.current.isPlayingMusic || item.type == 'unknown';
            NowPlaying.current.subtitles = properties.subtitles;
            if (idChanged || !NowPlaying.current.currentsubtitle || NowPlaying.current.currentsubtitle.index != properties.currentsubtitle.index)
                NowPlaying.current.currentsubtitle = properties.currentsubtitle;
            NowPlaying.current.audiostreams = properties.audiostreams;
            if (idChanged || !NowPlaying.current.currentaudiostream || NowPlaying.current.currentaudiostream.index != properties.currentaudiostream.index)
                NowPlaying.current.currentaudiostream = properties.currentaudiostream;
            NowPlaying.current.subtitleenabled = properties.subtitleenabled;
            NowPlaying.current.hasLanguages = properties.audiostreams && properties.audiostreams.length > 1;
            NowPlaying.current.hasSubtitles = properties.subtitles && properties.subtitles.length > 0;
            NowPlaying.current.hasLanguagesOrSubtitles = NowPlaying.current.hasLanguages || NowPlaying.current.hasSubtitles;
            if (properties.percentage < 0) {
                NowPlaying.current.progress = 0;
            }
            else {
                NowPlaying.current.progress = properties.percentage;
            }
            if (properties.time.minutes < 0) {
                NowPlaying.current.time = '00:00';
            }
            else {
                NowPlaying.current.time = Kodi.Utils.formatPlayerTime(properties, properties.time);
            }
            NowPlaying.current.totaltime = Kodi.Utils.formatPlayerTime(properties, properties.totaltime);
            NowPlaying.current.label = item.label;
            NowPlaying.current.label = NowPlaying.current.label.replace(new RegExp("[_]", 'g'), " ");
            var thumb = item.thumbnail;
            if (!item.thumbnail && item.type == 'unknown') {
                thumb = 'DefaultAlbumCover.png';
            }
            NowPlaying.current.thumbnail = thumb;
            if (!item.type) {
                NowPlaying.current.enabled = false;
            }
            else {
                if (!NowPlaying.current.enabled || $('#nowplaying').css('display') === 'none') {
                    NowPlaying.current.enabled = true;
                    $('#nowplaying').css('display', '').css('opacity', '1');
                }
            }
        }
        var nowPlayingInterval;
        function init() {
            if (nowPlayingInterval)
                clearInterval(nowPlayingInterval);
            NowPlaying.current.enabled = false;
            NowPlaying.current.reachable = false;
            $('#nowplaying').css('opacity', '0');
            nowPlayingInterval = setInterval(check, intervaldelay);
            check();
            $('#nowplaying, #nowplayingAppBar').tap(function (args) {
                var e = args;
                WinJS.Navigation.navigate("/pages/playlistfull/playlistfull.html");
            });
        }
        NowPlaying.init = init;
    })(NowPlaying = Kodi.NowPlaying || (Kodi.NowPlaying = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=Kodi.NowPlaying.js.map