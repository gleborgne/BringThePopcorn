var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var PlayingContentControl = (function () {
            function PlayingContentControl(element, options) {
                var _this = this;
                this.element = element || document.createElement('DIV');
                this.eventTracker = new WinJSContrib.UI.EventTracker();
                options = options || {};
                this.element.winControl = this;
                this.element.classList.add('playingcontent');
                this.element.classList.add('win-disposable');
                this.element.classList.add('mcn-layout-ctrl');
                WinJS.UI.setOptions(this, options);
                this.eventTracker.addBinding(Kodi.NowPlaying.current, "id", function () {
                    _this.setCurrentItem();
                });
                this.eventTracker.addEvent(window, "resize", function () {
                    _this.updateLayout();
                });
                this.manageSmallScreen();
            }
            PlayingContentControl.prototype.manageSmallScreen = function () {
                var controls = document.querySelectorAll("#nowplayingcontent .menubar .menu");
                for (var i = 0, l = controls.length; i < l; i++) {
                    this.manageSmallScreenMenu(controls[i]);
                }
            };
            PlayingContentControl.prototype.manageSmallScreenMenu = function (menu) {
                var targetid = menu.getAttribute("target");
                if (targetid) {
                    var target = document.getElementById(targetid);
                    WinJSContrib.UI.tap(menu, function () {
                        var currentSelection = $("#nowplayingcontent .panel.selected");
                        if (!target.classList.contains("selected") || currentSelection.length > 1) {
                            $("#nowplayingcontent .menubar .menu.selected").removeClass("selected");
                            menu.classList.add("selected");
                            if (currentSelection.length) {
                                dynamics.animate(currentSelection.get(0), { translateX: currentSelection.outerWidth() + 50 }, {
                                    type: dynamics.spring,
                                    duration: 350,
                                    frequency: 1,
                                    friction: 200,
                                    complete: function () {
                                        currentSelection.removeClass("selected");
                                        currentSelection.get(0).style.transform = "";
                                    }
                                });
                            }
                            dynamics.animate(target, { translateX: 0 }, {
                                type: dynamics.spring,
                                duration: 500,
                                frequency: 100,
                                friction: 210,
                                complete: function () {
                                    target.classList.add("selected");
                                    target.style.transform = "";
                                }
                            });
                        }
                    });
                }
            };
            PlayingContentControl.prototype.setCurrentItem = function () {
                var _this = this;
                var id = Kodi.NowPlaying.current.id;
                if (Kodi.NowPlaying.current.playerid != this.currentPlayerId || Kodi.NowPlaying.current.type != this.currentType) {
                    this.currentPlayerId = Kodi.NowPlaying.current.playerid;
                    this.currentType = Kodi.NowPlaying.current.type;
                    this.closeCurrent().then(function () {
                        if (Kodi.NowPlaying.current.id != null && Kodi.NowPlaying.current.id != undefined) {
                            if (Kodi.NowPlaying.current.playlistid != null && Kodi.NowPlaying.current.playlistid != undefined) {
                                Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then(function (playlist) {
                                    if (playlist.items && playlist.items.length > 1) {
                                        _this.showPlayList(playlist.items);
                                    }
                                    else {
                                        if (Kodi.NowPlaying.current.type === "movie") {
                                            _this.showMovie();
                                        }
                                        else if (Kodi.NowPlaying.current.type === "episode") {
                                            _this.showEpisode();
                                        }
                                        else if (Kodi.NowPlaying.current.type === "song") {
                                        }
                                    }
                                });
                            }
                            else {
                            }
                        }
                    });
                }
            };
            PlayingContentControl.prototype.showMovie = function () {
                var _this = this;
                Kodi.Data.loadRootData().then(function (data) {
                    var movie = data.movies.movies.filter(function (m) {
                        return m.movieid == Kodi.NowPlaying.current.id;
                    })[0];
                    if (movie) {
                        _this.currentContent = document.createElement("DIV");
                        _this.element.appendChild(_this.currentContent);
                        var page = new KodiPassion.UI.Pages.MovieDetail(_this.currentContent, { movie: movie });
                    }
                });
            };
            PlayingContentControl.prototype.showEpisode = function () {
            };
            PlayingContentControl.prototype.showPlayList = function (items) {
                var playlistctrl = new KodiPassion.UI.PlayListControl();
                this.currentContent = playlistctrl.element;
                this.element.appendChild(this.currentContent);
                playlistctrl.items = items;
            };
            PlayingContentControl.prototype.closeCurrent = function () {
                if (this.currentContent) {
                    $(this.currentContent).remove();
                    var control = this.currentContent.winControl;
                    if (control) {
                        if (control.dispose) {
                            control.dispose();
                        }
                    }
                    this.currentContent = null;
                }
                return WinJS.Promise.wrap();
            };
            PlayingContentControl.prototype.updateLayout = function () {
                if (this.currentContent) {
                    var control = this.currentContent.winControl;
                    if (control) {
                        if (control.updateLayout) {
                            control.updateLayout();
                            var layoutcontrols = this.currentContent.querySelectorAll(".mcn-layout-ctrl");
                            for (var i = 0, l = layoutcontrols.length; i < l; i++) {
                                var ctrl = layoutcontrols[i];
                                if (ctrl.winControl && ctrl.winControl.updateLayout) {
                                    ctrl.winControl.updateLayout();
                                }
                            }
                        }
                    }
                }
            };
            PlayingContentControl.prototype.dispose = function () {
                this.eventTracker.dispose();
            };
            return PlayingContentControl;
        })();
        UI.PlayingContent = WinJS.Class.mix(WinJS.Utilities.markSupportedForProcessing(PlayingContentControl), WinJS.Utilities.eventMixin, WinJS.Utilities.createEventProperties("myevent"));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=playingcontent.js.map