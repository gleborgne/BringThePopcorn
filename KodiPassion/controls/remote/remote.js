var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var RemoteControllerControl = (function () {
            function RemoteControllerControl() {
            }
            RemoteControllerControl.prototype.processed = function (element, options) {
                var _this = this;
                KodiPassion.mapKodiApi(element);
                this.loadLanguages();
                this.loadSubtitles();
                this.rangeVolume.onchange = function () {
                    var volumeval = parseInt(_this.rangeVolume.value);
                    Kodi.API.Input.volume(volumeval);
                };
                this.rangeSeek.onchange = function () {
                    var progressval = parseInt(_this.rangeSeek.value);
                    console.log("seek to " + progressval);
                    Kodi.API.Player.seek(Kodi.NowPlaying.current.playerid, progressval).then(function (r) {
                        Kodi.NowPlaying.current.progress = progressval;
                    }, function (err) {
                        var e = err;
                    });
                };
                return WinJS.Binding.processAll(element, Kodi.NowPlaying.current);
            };
            RemoteControllerControl.prototype.loadLanguages = function () {
                var _this = this;
                this.eventTracker.addBinding(Kodi.NowPlaying.current, "hasLanguages", function () {
                    _this.language.innerHTML = "";
                    if (Kodi.NowPlaying.current.audiostreams) {
                        Kodi.NowPlaying.current.audiostreams.forEach(function (audiostream) {
                            var selected = Kodi.NowPlaying.current.currentaudiostream.name == audiostream.name;
                            var o = document.createElement("OPTION");
                            o.selected = selected;
                            o.value = audiostream.index;
                            o.innerText = audiostream.name;
                            _this.language.appendChild(o);
                        });
                    }
                });
                this.language.onchange = function () {
                    var lng = _this.language.value;
                    if (lng) {
                        lng = parseInt(lng);
                        Kodi.API.Player.setAudioStream(Kodi.NowPlaying.current.playerid, lng).done(function () {
                            Kodi.NowPlaying.check().done(function (props) {
                                console.log('subtitles changed to ' + props.currentaudiostream.name);
                                _this.language.value = props.currentaudiostream.index;
                                //$('.languagelabel', page.element).html(toStaticHTML(props.currentaudiostream.name));
                            });
                        });
                    }
                };
            };
            RemoteControllerControl.prototype.loadSubtitles = function () {
                var _this = this;
                this.eventTracker.addBinding(Kodi.NowPlaying.current, "id", function () {
                    _this.subtitle.innerHTML = "";
                    if (Kodi.NowPlaying.current.subtitles) {
                        var o = document.createElement("OPTION");
                        o.value = "off";
                        o.innerText = "off";
                        o.selected = !Kodi.NowPlaying.current.subtitleenabled;
                        _this.subtitle.appendChild(o);
                        Kodi.NowPlaying.current.subtitles.forEach(function (subtitle) {
                            var selected = Kodi.NowPlaying.current.currentsubtitle.name == subtitle.name;
                            var o = document.createElement("OPTION");
                            o.selected = selected;
                            o.value = subtitle.index;
                            o.innerText = subtitle.name;
                            _this.subtitle.appendChild(o);
                        });
                    }
                });
                this.subtitle.onchange = function () {
                    var subtitle = _this.subtitle.value;
                    if (subtitle) {
                        if (subtitle != 'off')
                            subtitle = parseInt(subtitle);
                        Kodi.API.Player.setSubtitle(Kodi.NowPlaying.current.playerid, subtitle).done(function () {
                            if (subtitle != 'off' && !Kodi.NowPlaying.current.subtitleenabled) {
                                Kodi.API.Player.setSubtitle(Kodi.NowPlaying.current.playerid, 'on').done(function () {
                                    Kodi.NowPlaying.check().done(function (props) {
                                        console.log('subtitles changed to ' + props.currentsubtitle.name);
                                        _this.subtitle.value = Kodi.NowPlaying.current.currentsubtitle.index;
                                    });
                                });
                            }
                            else {
                                Kodi.NowPlaying.check().done(function (props) {
                                    if (!props.subtitleenabled) {
                                        console.log('subtitles changed to off');
                                        _this.subtitle.value = 'off';
                                    }
                                    else {
                                        console.log('subtitles changed to ' + props.currentsubtitle.name);
                                        _this.subtitle.value = Kodi.NowPlaying.current.currentsubtitle.index;
                                    }
                                });
                            }
                        });
                    }
                };
                //var subtitles = $('#subtitle', element);
                //subtitles.html('');
                //if (subtitles.length && XBMC.NowPlaying.current.subtitles && XBMC.NowPlaying.current.subtitles.length) {
                //    subtitles.append('<option ' + (XBMC.NowPlaying.current.subtitleenabled ? 'selected' : '') + ' value="off">off</option>')
                //    XBMC.NowPlaying.current.subtitles.forEach(function (subtitle) {
                //        var selected = XBMC.NowPlaying.current.subtitleenabled ? (XBMC.NowPlaying.current.currentsubtitle.name == subtitle.name ? 'selected' : '') : '';
                //        subtitles.append('<option ' + selected + ' value="' + subtitle.index + '">' + subtitle.name + '</option>');
                //    });
                //    subtitles[0].onchange = function () {
                //        var subtitle = subtitles.val();
                //        if (subtitle) {
                //            if (subtitle != 'off')
                //                subtitle = parseInt(subtitle);
                //            XBMC.API.Player.setSubtitle(XBMC.NowPlaying.current.playerid, subtitle).done(function () {
                //                if (subtitle != 'off' && !XBMC.NowPlaying.current.subtitleenabled) {
                //                    XBMC.API.Player.setSubtitle(XBMC.NowPlaying.current.playerid, 'on').done(function () {
                //                        XBMC.NowPlaying.check().done(function (props) {
                //                            console.log('subtitles changed to ' + props.currentsubtitle.name);
                //                            subtitles.val(XBMC.NowPlaying.current.currentsubtitle.index);
                //                        });
                //                    });
                //                } else {
                //                    XBMC.NowPlaying.check().done(function (props) {
                //                        if (!props.subtitleenabled) {
                //                            console.log('subtitles changed to off');
                //                            subtitles.val('off');
                //                        } else {
                //                            console.log('subtitles changed to ' + props.currentsubtitle.name);
                //                            subtitles.val(XBMC.NowPlaying.current.currentsubtitle.index);
                //                        }
                //                    });
                //                }
                //            });
                //        }
                //    };
                //}
            };
            RemoteControllerControl.url = "/controls/remote/remote.html";
            return RemoteControllerControl;
        })();
        UI.RemoteControllerControl = RemoteControllerControl;
        UI.RemoteController = WinJS.UI.Pages.define(RemoteControllerControl.url, RemoteControllerControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));

//# sourceMappingURL=../../../KodiPassion/controls/remote/remote.js.map