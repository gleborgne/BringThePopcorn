var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Player;
        (function (Player) {
            var lastItem;
            function playerCall(methodname, data, playerid, forceCheck) {
                if (typeof data === "undefined") {
                    data = undefined;
                }
                if (typeof playerid === "undefined") {
                    playerid = undefined;
                }
                if (typeof forceCheck === "undefined") {
                    forceCheck = false;
                }
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
                            }
                            else {
                                error('noplayer');
                            }
                        }, error);
                    }
                    else {
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
            function getActivePlayer() {
                return API.kodiRequest('Player.GetActivePlayers');
            }
            Player.getActivePlayer = getActivePlayer;
            function currentItem(playerid) {
                return playerCall('Player.GetItem', { "properties": ["album", "thumbnail", "file"] }, playerid).then(function (item) {
                    lastItem = item;
                    return WinJS.Promise.wrap(item);
                });
            }
            Player.currentItem = currentItem;
            function properties(playerid) {
                return playerCall('Player.GetProperties', { properties: ["type", "speed", "percentage", "time", "totaltime", "position", "playlistid", "repeat", "canseek", "canchangespeed", "canrepeat", "canzoom", "canrotate", "subtitles", "currentsubtitle", "audiostreams", "currentaudiostream", "subtitleenabled"] }, playerid).then(function (props) {
                    Player.currentPlayerProperties = props;
                    return WinJS.Promise.wrap(props);
                });
            }
            Player.properties = properties;
            function play(playerid, index) {
                return playerCall('Player.PlayPause', { play: true }, playerid).then(function (result) {
                    if (result && result.speed != undefined) {
                        Kodi.NowPlaying.current.speed = result.speed;
                    }
                    return result;
                });
            }
            Player.play = play;
            function pause(playerid, index) {
                return playerCall('Player.PlayPause', { play: false }, playerid).then(function (result) {
                    if (result && result.speed != undefined) {
                        Kodi.NowPlaying.current.speed = result.speed;
                    }
                    return result;
                });
            }
            Player.pause = pause;
            function playPause(playerid, index) {
                return playerCall('Player.PlayPause', { play: 'toggle' }, playerid).then(function (result) {
                    if (result && result.speed != undefined) {
                        Kodi.NowPlaying.current.speed = result.speed;
                    }
                    return result;
                });
            }
            Player.playPause = playPause;
            function stop(playerid, index) {
                return playerCall('Player.Stop', {}, playerid, true);
            }
            Player.stop = stop;
            function open(path, recursive) {
                var arg = { item: { file: path } };
                if (recursive) {
                    arg = { item: { directory: path } };
                }
                return API.kodiRequest('Player.Open', arg);
            }
            Player.open = open;
            function add(path, recursive) {
                var arg = { playlistid: 0, item: { file: path } };
                if (recursive) {
                    arg = { playlistid: 0, item: { directory: path } };
                }
                return API.kodiRequest('Playlist.Add', arg);
            }
            Player.add = add;
            function moveTo(playerid, index) {
                if (API.version.major >= 12) {
                    return playerCall('Player.GoTo', { to: index }, playerid, true);
                }
                else {
                    return playerCall('Player.GoTo', { "position": index }, playerid, true);
                }
            }
            Player.moveTo = moveTo;
            function next(playerid) {
                if (API.version.major >= 12) {
                    return playerCall('Player.GoTo', { to: 'next' }, playerid, true);
                }
                else {
                    return playerCall('Player.GoNext', {}, playerid, true);
                }
            }
            Player.next = next;
            function previous(playerid) {
                if (API.version.major >= 12) {
                    return playerCall('Player.GoTo', { to: 'previous' }, playerid, true);
                }
                else {
                    return playerCall('Player.GoPrevious', {}, playerid, true);
                }
            }
            Player.previous = previous;
            function moveUp(playerid) {
                return playerCall('Player.MoveUp', {}, playerid);
            }
            Player.moveUp = moveUp;
            function moveDown(playerid) {
                return playerCall('Player.MoveDown', {}, playerid);
            }
            Player.moveDown = moveDown;
            function moveLeft(playerid) {
                return playerCall('Player.MoveLeft', {}, playerid);
            }
            Player.moveLeft = moveLeft;
            function moveRight(playerid) {
                return playerCall('Player.MoveRight', {}, playerid);
            }
            Player.moveRight = moveRight;
            function rotate(playerid) {
                return playerCall('Player.Rotate', {}, playerid);
            }
            Player.rotate = rotate;
            function setAudioStream(playerid, stream) {
                return playerCall('Player.SetAudioStream', { stream: stream }, playerid);
            }
            Player.setAudioStream = setAudioStream;
            function setSubtitle(playerid, subtitle) {
                return playerCall('Player.SetSubtitle', { subtitle: subtitle }, playerid);
            }
            Player.setSubtitle = setSubtitle;
            function seek(playerid, val) {
                return playerCall('Player.Seek', { value: val }, playerid, true);
            }
            Player.seek = seek;
        })(Player = API.Player || (API.Player = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
