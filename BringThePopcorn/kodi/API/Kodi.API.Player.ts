module Kodi.API.Player {
    export var currentPlayer;
    export var currentPlayerProperties;
    var lastItem;

    function playerCall<T>(methodname, data, playerid?, forceCheck?): WinJS.Promise<T> {
        if (typeof data === "undefined") { data = undefined; }
        if (typeof playerid === "undefined") { playerid = undefined; }
        if (typeof forceCheck === "undefined") { forceCheck = false; }
        return new WinJS.Promise(function (complete, error) {
            var datacall = data || {};
            var playerToUse = playerid;

            //if (!playerToUse && player.currentPlayer) {
            //    playerToUse = player.currentPlayer.playerid;
            //}
            if (playerToUse === undefined && (Kodi.NowPlaying.current.playerid == null || Kodi.NowPlaying.current.playerid == undefined)) {
                getActivePlayer().done(function (activeplayers) {
                    if (activeplayers && activeplayers.length) {
                        Player.currentPlayer = activeplayers[0];
                        playerCall(methodname, data, activeplayers[0].playerid, forceCheck).done(function (result) {
                            complete(result);
                        }, error);
                    } else {
                        error('noplayer');
                    }
                }, error);
            } else {
                if (playerToUse == null || playerToUse == undefined) {
                    playerToUse = Kodi.NowPlaying.current.playerid;
                }
                datacall.playerid = playerToUse;

                API.kodiRequest(methodname, datacall, forceCheck, true).done(function (result) {
                    complete(result);
                }, error);
            }
        });
    }

    export function getActivePlayer(): WinJS.Promise<any> {
        return API.kodiRequest<any>('Player.GetActivePlayers');
    }
    
    export function currentItem(playerid) {
        return playerCall<any>('Player.GetItem', { "properties": ["album", "thumbnail", "file"] }, playerid).then(function (item) {
            lastItem = item;
            return WinJS.Promise.wrap(item);
        });
    }
    
    export function properties(playerid) {
        return playerCall<any>('Player.GetProperties', { properties: ["type", "speed", "percentage", "time", "totaltime", "position", "playlistid", "repeat", "canseek", "canchangespeed", "canrepeat", "canzoom", "canrotate", "subtitles", "currentsubtitle", "audiostreams", "currentaudiostream", "subtitleenabled"] }, playerid).then(function (props) {
            Player.currentPlayerProperties = props;
            return WinJS.Promise.wrap(props);
        });
    }
    
    export function play(playerid, index) {
        return playerCall<any>('Player.PlayPause', { play: true }, playerid).then(function (result) {
            if (result && result.speed != undefined) {
                Kodi.NowPlaying.current.speed = result.speed;
            }
            return result;
        });
    }

    export function pause(playerid, index) {
        return playerCall<any>('Player.PlayPause', { play: false }, playerid).then(function (result) {
            if (result && result.speed != undefined) {
                Kodi.NowPlaying.current.speed = result.speed;
            }
            return result;
        });
    }

    export function playPause(playerid, index) {
        return playerCall<any>('Player.PlayPause', { play: 'toggle' }, playerid).then(function (result) {
            if (result && result.speed != undefined) {
                Kodi.NowPlaying.current.speed = result.speed;
            }
            return result;
        });
    }

    export function stop(playerid, index) {
        return playerCall<any>('Player.Stop', {}, playerid, true);
    }
    
    export function open(path, recursive) {
        var arg = <any>{ item: { file: path } };
        if (recursive) {
            arg = { item: { directory: path } }
        }
        return API.kodiRequest<any>('Player.Open', arg, true);
    }

    export function add(path, recursive) {
        var arg = <any>{ playlistid: 0, item: { file: path } };
        if (recursive) {
            arg = { playlistid: 0, item: { directory: path } }
        }
        return API.kodiRequest<any>('Playlist.Add', arg, true);
    }

    export function moveTo(playerid, index) {
        if (API.version.major >= 12) {
            return playerCall<any>('Player.GoTo', { to: index }, playerid, true);
        } else {
            return playerCall<any>('Player.GoTo', { "position": index }, playerid, true);
        }
    }

    export function next(playerid) {
        if (API.version.major >= 12) {
            return playerCall<any>('Player.GoTo', { to: 'next' }, playerid, true);
        } else {
            return playerCall<any>('Player.GoNext', {}, playerid, true);
        }
    }

    export function previous(playerid) {
        if (API.version.major >= 12) {
            return playerCall<any>('Player.GoTo', { to: 'previous' }, playerid, true);
        } else {
            return playerCall<any>('Player.GoPrevious', {}, playerid, true);
        }
    }

    export function moveUp(playerid) {
        return playerCall<any>('Player.MoveUp', {}, playerid);
    }

    export function moveDown(playerid) {
        return playerCall<any>('Player.MoveDown', {}, playerid);
    }

    export function moveLeft(playerid) {
        return playerCall<any>('Player.MoveLeft', {}, playerid);
    }

    export function moveRight(playerid) {
        return playerCall<any>('Player.MoveRight', {}, playerid);
    }

    export function rotate(playerid) {
        return playerCall<any>('Player.Rotate', {}, playerid);
    }

    export function setAudioStream(playerid, stream) {
        return playerCall<any>('Player.SetAudioStream', { stream: stream }, playerid);
    }

    export function setSubtitle(playerid, subtitle) {
        return playerCall<any>('Player.SetSubtitle', { subtitle: subtitle }, playerid);
    }

    export function seek(playerid, val) {
        return playerCall<any>('Player.Seek', { value: val }, playerid, true);
    }
}