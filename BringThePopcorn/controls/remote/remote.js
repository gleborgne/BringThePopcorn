var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var RemoteControllerControl = (function () {
            function RemoteControllerControl() {
            }
            RemoteControllerControl.prototype.processed = function (element, options) {
                var _this = this;
                BtPo.mapKodiApi(element);
                this.loadLanguages();
                this.loadSubtitles();
                this.rangeVolume.onchange = function () {
                    var volumeval = parseInt(_this.rangeVolume.value);
                    Kodi.API.Input.volume(volumeval);
                };
                this.eventTracker.addBinding(Kodi.NowPlaying.current, "expanded", function () {
                    if (Kodi.NowPlaying.current.expanded) {
                        _this.loadProfiles();
                    }
                });
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
            RemoteControllerControl.prototype.loadProfiles = function () {
                var _this = this;
                WinJS.Promise.join({
                    current: Kodi.API.Profiles.getCurrentProfile(),
                    list: Kodi.API.Profiles.getProfiles()
                }).then(function (profiles) {
                    _this.profilesItems.innerHTML = "";
                    if (profiles && profiles.list) {
                        if (profiles.list.profiles.length == 1) {
                            _this.btnProfiles.style.display = "none";
                            return;
                        }
                        else {
                            _this.btnProfiles.style.display = "";
                            profiles.list.profiles.forEach(function (p) {
                                var b = document.createElement("BUTTON");
                                b.innerText = p.label;
                                if (profiles.current && p.label == profiles.current.label) {
                                    b.classList.add("selected");
                                }
                                _this.profilesItems.appendChild(b);
                                WinJSContrib.UI.tap(b, function () {
                                    _this.profilesFlyout.hide();
                                    return Kodi.API.Profiles.loadProfile(p.label).then(function () {
                                        $('.selected', _this.profilesItems).removeClass("selected");
                                        b.classList.add("selected");
                                    });
                                });
                            });
                        }
                    }
                }, function (err) {
                    _this.btnProfiles.style.display = "none";
                });
            };
            RemoteControllerControl.prototype.showProfiles = function (arg) {
                this.profilesFlyout.show(arg.elt, "bottom", "right");
            };
            RemoteControllerControl.prototype.showPowerOptions = function (arg) {
                this.shutdownFlyout.show(arg.elt, "bottom", "right");
            };
            RemoteControllerControl.prototype.shutdown = function () {
                this.shutdownFlyout.hide();
                WinJSContrib.Alerts.messageBox({ content: "This will turn off your media server. After a few seconds, this application will not be able to reach your media server any more. \r\n\r\nDo you want to proceed ?", title: 'Shutdown media server ?', commands: [{ label: 'Yes' }, { label: 'No', isDefault: true }] }).done(function (c) {
                    if (c.label == 'Yes')
                        Kodi.API.System.shutdown().done(function () {
                            WinJS.Navigation.navigate("/pages/startup/startup.html");
                        });
                });
            };
            RemoteControllerControl.prototype.restart = function () {
                this.shutdownFlyout.hide();
                WinJSContrib.Alerts.messageBox({ content: "This will restart your media server.\r\n\r\nDo you want to proceed ?", title: 'Shutdown media server ?', commands: [{ label: 'Yes' }, { label: 'No', isDefault: true }] }).done(function (c) {
                    if (c.label == 'Yes')
                        Kodi.API.System.reboot().done(function () {
                            WinJS.Navigation.navigate("/pages/startup/startup.html");
                        });
                });
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
                                RemoteControllerControl.logger.info('subtitles changed to ' + props.currentaudiostream.name);
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
                                        RemoteControllerControl.logger.info('subtitles changed to ' + props.currentsubtitle.name);
                                        _this.subtitle.value = Kodi.NowPlaying.current.currentsubtitle.index;
                                    });
                                });
                            }
                            else {
                                Kodi.NowPlaying.check().done(function (props) {
                                    if (!props.subtitleenabled) {
                                        RemoteControllerControl.logger.info('subtitles changed to off');
                                        _this.subtitle.value = 'off';
                                    }
                                    else {
                                        RemoteControllerControl.logger.info('subtitles changed to ' + props.currentsubtitle.name);
                                        _this.subtitle.value = Kodi.NowPlaying.current.currentsubtitle.index;
                                    }
                                });
                            }
                        });
                    }
                };
            };
            RemoteControllerControl.url = "/controls/remote/remote.html";
            RemoteControllerControl.logger = WinJSContrib.Logs.getLogger("KDP.Remote");
            return RemoteControllerControl;
        })();
        UI.RemoteControllerControl = RemoteControllerControl;
        UI.RemoteController = WinJS.UI.Pages.define(RemoteControllerControl.url, RemoteControllerControl);
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));

//# sourceMappingURL=../../../BringThePopcorn/controls/remote/remote.js.map