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
                this.showEmpty();
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
                //this.closeCurrent().then(() => {
                //    this.showReactPlayList([{ id: "1", label: "item1" }, { id: "2", label: "item2" }, { id: "3", label: "item3" }, { id: "4", label: "item4" }]);
                //});
                //return;
                if (Kodi.NowPlaying.current.playlistid == null || Kodi.NowPlaying.current.playlistid == undefined) {
                    return this.showEmpty();
                }
                if (Kodi.NowPlaying.current.playerid != this.currentPlayerId || Kodi.NowPlaying.current.playlistid != this.currentPlaylistId || Kodi.NowPlaying.current.type != this.currentType) {
                    this.currentPlaylistId = Kodi.NowPlaying.current.playlistid;
                    this.currentPlayerId = Kodi.NowPlaying.current.playerid;
                    this.currentType = Kodi.NowPlaying.current.type;
                    this.closeCurrent().then(function () {
                        if (Kodi.NowPlaying.current.id != null && Kodi.NowPlaying.current.id != undefined) {
                            if (Kodi.NowPlaying.current.playlistid != null && Kodi.NowPlaying.current.playlistid != undefined) {
                                return Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then(function (playlist) {
                                    if (Kodi.NowPlaying.current.type === "song") {
                                        return _this.showReactPlayList(playlist.items);
                                    }
                                    else if (playlist.items && playlist.items.length > 1) {
                                        return _this.showPlayList(playlist.items);
                                    }
                                    else if (Kodi.NowPlaying.current.type === "movie") {
                                        return _this.showMovie();
                                    }
                                    else if (Kodi.NowPlaying.current.type === "episode") {
                                        return _this.showEpisode();
                                    }
                                    return _this.showEmpty();
                                });
                            }
                        }
                        _this.showEmpty();
                    });
                }
            };
            PlayingContentControl.prototype.showEmpty = function () {
                var _this = this;
                var p = WinJS.Promise.wrap();
                this.currentPlaylistId = null;
                this.currentPlayerId = null;
                this.currentType = null;
                if (this.currentContent && !this.currentContent.classList.contains("emptyplaying")) {
                    p = this.closeCurrent();
                }
                p.then(function () {
                    if (!_this.currentContent || !_this.currentContent.classList.contains("emptyplaying")) {
                        _this.currentContent = document.createElement("DIV");
                        _this.currentContent.classList.add("emptyplaying");
                        _this.currentContent.innerHTML = '<div class="content"><img src="/images/logos/PopcornRounded.svg"  draggable="false"/><div class="message">nothing is currently playing</div></div>';
                        _this.element.appendChild(_this.currentContent);
                    }
                });
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
            PlayingContentControl.prototype.showReactPlayList = function (items) {
                var elt = document.createElement("DIV");
                this.element.appendChild(elt);
                var playlistctrl = new KodiPassion.UI.ReactPlayListControl(elt);
                this.currentContent = playlistctrl.element;
                playlistctrl.items = items;
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