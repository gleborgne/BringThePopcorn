var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var GenrePickerControl = (function () {
            function GenrePickerControl(element, options) {
                var ctrl = this;
                this.element = element || document.createElement('DIV');
                options = options || {};
                this.element.winControl = this;
                this.element.classList.add("genrepickerctrl");
                this.element.classList.add('win-disposable');
                this.render();
                this.eventTracker = new WinJSContrib.UI.EventTracker();
                var nav = WinJS.Navigation;
                this.eventTracker.addEvent(nav, "beforenavigate", function (arg) {
                    ctrl.__pickComplete();
                });
                WinJS.UI.setOptions(this, options);
            }
            GenrePickerControl.prototype.render = function () {
                var ctrl = this;
                ctrl.element.innerHTML = '<div class="btnclose"><i class="kdp-close"></i></div><div class="genre-items"></div>';
                ctrl.itemsContainer = ctrl.element.querySelector(".genre-items");
                ctrl.btnclose = ctrl.element.querySelector(".btnclose");
                WinJSContrib.UI.tap(ctrl.btnclose, function () {
                    ctrl.__pickComplete();
                });
            };
            GenrePickerControl.prototype.pickGenre = function (genres, selected) {
                var ctrl = this;
                var p = new WinJS.Promise(function (complete, error) {
                    ctrl.__pickComplete = complete;
                    ctrl.__pickError = error;
                });
                this.genres = genres;
                this.selected = selected;
                ctrl.renderGenres();
                return p;
            };
            GenrePickerControl.prototype.renderGenres = function () {
                var ctrl = this;
                ctrl.itemsContainer.innerHTML = "";
                if (ctrl.genres) {
                    var container = document.createDocumentFragment();
                    var items = [];
                    var e = document.createElement("DIV");
                    e.className = "genre genre-all";
                    e.style.opacity = "0";
                    e.innerText = "all";
                    WinJSContrib.UI.tap(e, function () {
                        ctrl.__pickComplete("all");
                    });
                    items.push(e);
                    container.appendChild(e);
                    ctrl.genres.forEach(function (genre) {
                        var e = document.createElement("DIV");
                        e.className = "genre";
                        e.style.opacity = "0";
                        e.innerText = genre.label;
                        WinJSContrib.UI.tap(e, function () {
                            ctrl.__pickComplete(genre);
                        });
                        items.push(e);
                        container.appendChild(e);
                    });
                    ctrl.itemsContainer.appendChild(container);
                    WinJS.UI.Animation.enterPage(items);
                }
            };
            GenrePickerControl.prototype.dispose = function () {
                WinJS.Utilities.disposeSubTree(this.element);
                this.element = null;
                this.eventTracker.dispose();
            };
            GenrePickerControl.prototype.hide = function () {
                var ctrl = this;
                return WinJSContrib.UI.Animation.fadeOut(ctrl.element, { duration: 100 }).then(function () {
                    $(ctrl.element).remove();
                    ctrl.dispose();
                });
            };
            return GenrePickerControl;
        })();
        UI.GenrePickerControl = GenrePickerControl;
        UI.GenrePicker = WinJS.Class.mix(GenrePickerControl, WinJS.Utilities.eventMixin, WinJS.Utilities.createEventProperties("myevent"));
        UI.GenrePicker.pick = function (genres, selectedgenre) {
            var ctrl = new KodiPassion.UI.GenrePicker();
            var container = document.getElementById("pageshostwrapper");
            ctrl.element.style.opacity = '0';
            container.appendChild(ctrl.element);
            WinJSContrib.UI.Animation.fadeIn(ctrl.element, { duration: 200 });
            WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(20, 90);
            return ctrl.pickGenre(genres, selectedgenre).then(function (data) {
                WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(0, 90);
                return ctrl.hide().then(function () {
                    return WinJS.Promise.timeout(50);
                }).then(function () {
                    return data;
                });
            });
        };
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var DataLoaderControl = (function () {
            function DataLoaderControl() {
            }
            DataLoaderControl.prototype.processed = function (element, options) {
            };
            DataLoaderControl.prototype.ready = function (element, options) {
                var page = this;
                WinJSContrib.UI.Application.navigator.closeAllPages();
                Kodi.API.Websocket.init(Kodi.API.currentSettings);
                WinJS.Navigation.history.backstack = [];
                var p = WinJS.Promise.wrap();
                if (options && options.transitionIn) {
                    p = WinJSContrib.UI.Animation.fadeIn(element);
                }
                p.then(function () {
                    return WinJSContrib.UI.Animation.enterGrow(page.content, { easing: WinJSContrib.UI.Animation.Easings.easeOutBack }).then(function () {
                        return WinJS.Promise.join({
                            mintime: WinJS.Promise.timeout(1000),
                            data: Kodi.Data.loadRootData(true)
                        });
                    });
                }).then(function (data) {
                    document.body.classList.remove("unconnected");
                    Kodi.NowPlaying.init();
                    return WinJS.Navigation.navigate("/pages/home/home.html");
                }, function (err) {
                    document.body.classList.add("unconnected");
                    return WinJS.Navigation.navigate("/pages/startup/startup.html");
                }).then(function () {
                    page.container.classList.add('exit');
                    //return WinJSContrib.UI.afterTransition(page.container);
                    return WinJS.Promise.timeout(700);
                }).then(function () {
                    $(page.element).remove();
                    page.dispose();
                });
            };
            DataLoaderControl.url = "/controls/loader/loader.html";
            return DataLoaderControl;
        })();
        UI.DataLoaderControl = DataLoaderControl;
        UI.DataLoader = WinJS.UI.Pages.define(DataLoaderControl.url, DataLoaderControl);
        UI.DataLoader.showLoader = function (transitionIn, startupArgs) {
            var e = document.createElement("DIV");
            e.className = "page-loader-wrapper";
            if (transitionIn)
                e.style.opacity = '0';
            document.body.appendChild(e);
            var loader = new KodiPassion.UI.DataLoader(e, { transitionIn: transitionIn, startupArgs: startupArgs });
        };
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var MainMenuControl = (function () {
            function MainMenuControl() {
            }
            MainMenuControl.prototype.openremote = function () {
                WinJS.Navigation.navigate("/pages/remote/remote.html", { navigateStacked: true });
            };
            MainMenuControl.url = "/controls/menu/menu.html";
            return MainMenuControl;
        })();
        UI.MainMenu = WinJS.UI.Pages.define(MainMenuControl.url, MainMenuControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var NowPlayingBarControl = (function () {
            function NowPlayingBarControl() {
            }
            NowPlayingBarControl.prototype.processed = function (element, options) {
                var _this = this;
                this.container = document.getElementById("contentwrapper");
                this.playingElt = document.getElementById("nowplaying");
                this.contentElt = document.getElementById("nowplayingcontent");
                WinJS.Navigation.addEventListener("beforenavigate", function () {
                    _this.minimize(true);
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
                KodiPassion.mapKodiApi(element);
                return WinJS.Binding.processAll(this.element, Kodi.NowPlaying.current);
            };
            NowPlayingBarControl.prototype.toggleView = function () {
                var ctrl = this;
                if (document.body.classList.contains("nowplaying-expanded")) {
                    this.minimize();
                }
                else {
                    this.maximize();
                }
            };
            NowPlayingBarControl.prototype.maximize = function () {
                var ctrl = this;
                if (!document.body.classList.contains("nowplaying-expanded")) {
                    var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                    ctrl.playingElt.style.height = 'auto';
                    $.Velocity.hook(ctrl.playingElt, "top", target + "px");
                    WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(20, 120);
                    $.Velocity(ctrl.playingElt, { top: '0px' }, { duration: 200, easing: 'easeOutQuart' }).then(function () {
                        document.body.classList.add("nowplaying-expanded");
                        Kodi.NowPlaying.current.expanded = true;
                    });
                }
            };
            NowPlayingBarControl.prototype.minimize = function (instantly) {
                var ctrl = this;
                if (document.body.classList.contains("nowplaying-expanded")) {
                    if (instantly) {
                        ctrl.playingElt.style.top = '';
                        ctrl.playingElt.style.height = '';
                        document.body.classList.remove("nowplaying-expanded");
                        return;
                    }
                    var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                    $.Velocity.hook(ctrl.playingElt, "top", "0");
                    WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(0, 90);
                    $.Velocity(ctrl.playingElt, { top: target + 'px' }, { duration: 90, easing: 'easeOutQuart' }).then(function () {
                        ctrl.playingElt.style.height = '';
                        ctrl.playingElt.style.top = '';
                        document.body.classList.remove("nowplaying-expanded");
                        Kodi.NowPlaying.current.expanded = false;
                    });
                }
            };
            NowPlayingBarControl.url = "/controls/nowplayingbar/nowplayingbar.html";
            return NowPlayingBarControl;
        })();
        UI.NowPlayingBarControl = NowPlayingBarControl;
        UI.NowPlayingSummary = WinJS.UI.Pages.define(NowPlayingBarControl.url, NowPlayingBarControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
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
                                        return _this.showPlayList(playlist.items);
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
                        _this.currentContent.innerHTML = '<div class="content"><img src="/images/logos/KodiPassion-notitle-white.svg"  draggable="false"/><div class="message">nothing is currently playing</div></div>';
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
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var PlayListControl = (function () {
            function PlayListControl(element, options) {
                var _this = this;
                this.element = element || document.createElement('DIV');
                this.eventTracker = new WinJSContrib.UI.EventTracker();
                options = options || {};
                this.element.winControl = this;
                this.element.classList.add('playlistcontrol');
                this.element.classList.add('win-disposable');
                this.element.classList.add('mcn-layout-ctrl');
                WinJS.UI.setOptions(this, options);
                this.itemTemplate = new WinJS.Binding.Template(null, { href: '/templates/playlistitem.html', extractChild: true });
                this.eventTracker.addBinding(Kodi.NowPlaying.current, "id", function () {
                    _this.refresh();
                });
                this.eventTracker.addBinding(Kodi.NowPlaying.current, "expanded", function () {
                    _this.refresh(true);
                    if (!Kodi.NowPlaying.current.expanded) {
                        _this.element.innerHTML = "";
                    }
                });
                this.eventTracker.addEvent(WinJS.Application, "Playlist.OnAdd", function () {
                    clearTimeout(_this.throttle);
                    _this.throttle = setTimeout(function () {
                        var delta = (new Date()) - _this.lastrefresh;
                        if (delta > 1000) {
                            _this.refresh();
                        }
                    }, 700);
                });
            }
            Object.defineProperty(PlayListControl.prototype, "items", {
                get: function () {
                    return this._items;
                },
                set: function (val) {
                    this._items = val;
                },
                enumerable: true,
                configurable: true
            });
            PlayListControl.prototype.refresh = function (animate) {
                var _this = this;
                if (Kodi.NowPlaying.current.expanded) {
                    Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then(function (playlist) {
                        _this.items = playlist.items;
                        _this.renderItems(animate);
                        _this.lastrefresh = new Date();
                    });
                }
            };
            PlayListControl.prototype.renderItems = function (animate) {
                var _this = this;
                //var container = document.createDocumentFragment();
                var p = [];
                var elts = [];
                this.element.innerHTML = "";
                if (this.items) {
                    this.items.forEach(function (i, index) {
                        p.push(_this.itemTemplate.render(i).then(function (rendered) {
                            elts.push(rendered);
                            if (animate) {
                                rendered.style.opacity = "0";
                            }
                            _this.element.appendChild(rendered);
                            if (i.id == Kodi.NowPlaying.current.id) {
                                rendered.classList.add("current");
                            }
                            var btnplay = rendered.querySelector(".btnplay");
                            var btnremove = rendered.querySelector(".btnremove");
                            WinJSContrib.UI.tap(btnplay, function () {
                                return Kodi.API.Player.moveTo(Kodi.NowPlaying.current.playerid, index).then(function () {
                                    _this.refresh();
                                });
                            });
                            WinJSContrib.UI.tap(btnremove, function () {
                                return Kodi.API.PlayList.removeAt(Kodi.NowPlaying.current.playlistid, index).then(function () {
                                    return WinJSContrib.UI.removeElementAnimation(rendered).then(function () {
                                        //this.refresh();
                                    });
                                });
                            });
                        }));
                    });
                    WinJS.Promise.join(p).then(function () {
                        if (animate) {
                            WinJS.UI.Animation.enterPage(elts);
                        }
                        //    this.element.innerHTML = "";
                        //    this.element.appendChild(container);
                    });
                }
            };
            PlayListControl.prototype.dispose = function () {
                this.eventTracker.dispose();
            };
            return PlayListControl;
        })();
        UI.PlayListControl = PlayListControl;
        UI.PlayList = WinJS.Class.mix(WinJS.Utilities.markSupportedForProcessing(PlayListControl), WinJS.Utilities.eventMixin, WinJS.Utilities.createEventProperties("myevent"));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
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
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var SettingsFormControl = (function () {
            function SettingsFormControl() {
            }
            Object.defineProperty(SettingsFormControl.prototype, "setting", {
                get: function () {
                    return this.dataForm.item;
                },
                set: function (val) {
                    this.dataForm.item = val;
                },
                enumerable: true,
                configurable: true
            });
            SettingsFormControl.prototype.ready = function (element, options) {
            };
            SettingsFormControl.prototype.validate = function () {
                return this.dataForm.validate();
            };
            SettingsFormControl.url = "/controls/settingsform/settingsform.html";
            return SettingsFormControl;
        })();
        UI.SettingsFormControl = SettingsFormControl;
        UI.SettingsForm = WinJS.UI.Pages.define(SettingsFormControl.url, SettingsFormControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var SettingsListControl = (function () {
            function SettingsListControl() {
            }
            SettingsListControl.prototype.processed = function (element, options) {
                if (options)
                    this.autoconnect = options.autoconnect || false;
                return this.renderSettings();
            };
            SettingsListControl.prototype.clearIntervals = function () {
                if (this.intervals) {
                    this.intervals.forEach(function (i) {
                        clearInterval(i);
                    });
                }
                this.intervals = [];
            };
            SettingsListControl.prototype.renderSettings = function () {
                var _this = this;
                this.clearIntervals();
                var settings = Kodi.Settings.list();
                this.availablesettings.innerHTML = "";
                var container = document.createDocumentFragment();
                var defaultsetting = Kodi.Settings.defaultConnection();
                var servertemplate = new WinJS.Binding.Template(null, { href: "/templates/serveritem.html" });
                var p = [];
                settings.forEach(function (s) {
                    var setting = Kodi.Settings.getSetting(s);
                    var addInterval = function () {
                        if (_this.autoconnect) {
                            _this.intervals.push(setInterval(function () {
                                return Kodi.API.testServerSetting(setting).then(function (res) {
                                    _this.clearIntervals();
                                    Kodi.API.currentSettings = setting;
                                    return KodiPassion.UI.DataLoader.showLoader(true);
                                }, function (err) {
                                    console.error(err);
                                });
                            }, 4000));
                        }
                    };
                    p.push(servertemplate.render(setting).then(function (rendered) {
                        var elt = rendered.children[0];
                        var btnedit = elt.querySelector(".btnedit");
                        var btnconnect = elt.querySelector(".btnconnect");
                        var btnwakeup = elt.querySelector(".btnwakeup");
                        if (s == defaultsetting) {
                            var e = elt.querySelector(".name");
                            e.innerText = setting.name + ' (default)';
                            addInterval();
                        }
                        WinJSContrib.UI.tap(btnedit, function () {
                            WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { setting: s, navigateStacked: true });
                        });
                        WinJSContrib.UI.tap(btnconnect, function () {
                            return Kodi.API.testServerSetting(setting).then(function (res) {
                                _this.clearIntervals();
                                Kodi.API.currentSettings = setting;
                                return KodiPassion.UI.DataLoader.showLoader(true);
                            }, function (err) {
                                console.error(err);
                                return WinJS.Promise.wrapError(err);
                            });
                        });
                        if (_this.isValidMacAddress(setting)) {
                            WinJSContrib.UI.tap(btnwakeup, function () {
                                return Kodi.WOL.wakeUp(setting.macAddress).then(function () {
                                    var ctrl = _this;
                                    ctrl.dispatchEvent("settingslistmessage", { message: "Wake on lan sended to " + setting.name + ". Please wait for your media server to startup" });
                                    _this.clearIntervals();
                                    if (setting.host) {
                                        addInterval();
                                    }
                                    //WinJSContrib.Alerts.toast("Wake on lan sended to " + setting.name);
                                });
                            });
                        }
                        else {
                            btnwakeup.style.display = "none";
                        }
                        container.appendChild(elt);
                        if (Kodi.API.currentSettings && setting.host == Kodi.API.currentSettings.host) {
                            elt.classList.add("current");
                        }
                    }));
                });
                return WinJS.Promise.join(p).then(function () {
                    _this.availablesettings.appendChild(container);
                });
            };
            SettingsListControl.prototype.isValidMacAddress = function (setting) {
                if (setting.macAddress && setting.macAddress.length == 6) {
                    var res = true;
                    setting.macAddress.forEach(function (s) {
                        res = res && s;
                    });
                    return res;
                }
                else {
                    return false;
                }
            };
            SettingsListControl.prototype.addSetting = function () {
                WinJS.Navigation.navigate("/pages/settings/serverdetail/serverdetail.html", { navigateStacked: true });
            };
            SettingsListControl.prototype.unload = function () {
                this.clearIntervals();
            };
            SettingsListControl.url = "/controls/settingslist/settingslist.html";
            return SettingsListControl;
        })();
        UI.SettingsListControl = SettingsListControl;
        UI.SettingsList = WinJS.UI.Pages.define(SettingsListControl.url, SettingsListControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var Templates;
    (function (Templates) {
        Templates.album = new WinJS.Binding.Template(null, { href: "/templates/album.html", extractChild: true });
        Templates.song = new WinJS.Binding.Template(null, { href: "/templates/song.html", extractChild: true });
        Templates.movieposter = new WinJS.Binding.Template(null, { href: "/templates/movieposter.html", extractChild: true });
    })(Templates = KodiPassion.Templates || (KodiPassion.Templates = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJSContrib.UI.enableSystemBackButton = true;
    WinJSContrib.UI.defaultTapBehavior.awaitAnim = true;
    WinJSContrib.UI.defaultTapBehavior.animDown = function (elt) {
        var w = elt.clientWidth;
        var h = elt.clientHeight;
        var target = { scaleX: (w - 10) / w, scaleY: (h + 10) / h };
        //if (elt.clientWidth < 70 && elt.clientHeight < 70)
        //    target = { scaleX: 0.8, scaleY: 1.2 };
        //else if (elt.clientWidth < 100 && elt.clientHeight < 100)
        //    target = { scaleX: 0.9, scaleY: 1.1 };
        //    return $.Velocity(elt, target, { duration: 90 });
        return new WinJS.Promise(function (complete, error) {
            dynamics.animate(elt, target, {
                type: dynamics.spring,
                duration: 160,
                frequency: 1,
                friction: 166,
                complete: complete
            });
        });
        //return WinJS.UI.executeTransition(elt, {
        //    property: "transform",
        //    delay: 0,
        //    duration: 167,
        //    timing: "cubic-bezier(0.1, 0.9, 0.2, 1)",
        //    to: "scale(0.7, 1.2)"
        //});
    };
    WinJSContrib.UI.defaultTapBehavior.animUp = function (elt) {
        var p = new WinJS.Promise(function (complete, error) {
            dynamics.animate(elt, {
                scaleX: 1,
                scaleY: 1
            }, {
                type: dynamics.spring,
                frequency: 300,
                duration: 700,
                friction: 105,
                anticipationSize: 216,
                anticipationStrength: 572,
                complete: complete
            });
        });
        return WinJS.Promise.timeout(50);
        //return WinJS.UI.executeTransition(elt, {
        //    property: "transform",
        //    delay: 0,
        //    duration: 300,
        //    timing: WinJSContrib.UI.Animation.Easings.easeOutBack, //"cubic-bezier(.39,.66,.5,1)", 
        //    to: "scale(1, 1)"
        //});
        //$.Velocity(elt, { scaleX: 1, scaleY: 1 }, { duration: 800, easing: [600, 25] });
        //return WinJS.Promise.timeout(50);
    };
    WinJSContrib.UI.Pages.defaultFragmentMixins.push({
        navdeactivate: function () {
            if (this.foWrapper) {
                this.foWrapper.element.style.opacity = '0.2';
                this.foWrapper.blurTo(20, 160);
                return WinJS.Promise.timeout(50);
            }
            else {
                console.error("fowrapper not present");
            }
            if (this.pageNavDeactivate) {
                this.pageNavDeactivate();
            }
        },
        navactivate: function () {
            if (this.foWrapper) {
                this.foWrapper.element.style.opacity = '';
                this.foWrapper.blurTo(0, 160);
            }
            else {
                console.error("fowrapper not present");
            }
            if (this.pageNavActivate) {
                this.pageNavActivate();
            }
        }
    });
    function appInit(args) {
        var pageshost = document.getElementById("pageshost");
        pageshost.winControl.fragmentInjector = function (pagecontrol) {
            var parent = pagecontrol.element.parentElement;
            var wrapper = new WinJSContrib.UI.FOWrapper();
            var _unload = pagecontrol.unload;
            var _updateLayout = pagecontrol.updateLayout;
            var proxy = document.createElement("DIV");
            proxy.className = "pagecontrolproxy pagecontrol";
            proxy.winControl = pagecontrol;
            proxy.winControl.unload = function () {
                $(proxy).remove();
                if (_unload) {
                    _unload.apply(this);
                }
            };
            proxy.winControl.updateLayout = function () {
                wrapper.updateLayout();
                if (_updateLayout) {
                    _updateLayout.apply(this);
                }
            };
            proxy.appendChild(wrapper.element);
            parent.appendChild(proxy);
            wrapper.content.appendChild(pagecontrol.element);
            pagecontrol.foWrapper = wrapper;
        };
        var settingName = Kodi.Settings.defaultConnection();
        if (settingName) {
            var currentSetting = Kodi.Settings.getSetting(settingName);
            if (currentSetting && currentSetting.host) {
                return Kodi.API.testServerSetting(currentSetting).then(function (p) {
                    Kodi.API.currentSettings = currentSetting;
                    return KodiPassion.UI.DataLoader.showLoader(false, args);
                }, function (err) {
                    return WinJS.Navigation.navigate("/pages/startup/startup.html");
                });
            }
        }
        return WinJS.Navigation.navigate("/pages/bootstrap/bootstrap.html");
    }
    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
            }
            else {
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                return appInit(args);
            }));
        }
    };
    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };
    app.start();
    function mapKodiApi(element) {
        var items = element.querySelectorAll("*[kodiapi]");
        var processItem = function (item) {
            var api = item.getAttribute("kodiapi");
            if (api) {
                var fn = WinJSContrib.Utils.resolveValue(item, "global:" + api);
                if (fn && typeof fn === "function") {
                    WinJSContrib.UI.tap(item, function (arg) {
                        return fn();
                    }, {});
                }
            }
        };
        for (var i = 0, l = items.length; i < l; i++) {
            processItem(items[i]);
        }
    }
    KodiPassion.mapKodiApi = mapKodiApi;
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsArtistsPage = (function () {
                function AlbumsArtistsPage() {
                }
                AlbumsArtistsPage.prototype.processed = function (element, options) {
                };
                AlbumsArtistsPage.url = "/pages/albums/artists/artists.html";
                return AlbumsArtistsPage;
            })();
            Pages.AlbumsArtistsPage = AlbumsArtistsPage;
            WinJS.UI.Pages.define(AlbumsArtistsPage.url, AlbumsArtistsPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsDetailPage = (function () {
                function AlbumsDetailPage() {
                }
                AlbumsDetailPage.prototype.processed = function (element, options) {
                    var _this = this;
                    this.album = options.album;
                    WinJS.Binding.processAll(element, this.album);
                    Kodi.API.Music.albumSongs(this.album.albumid).then(function (songs) {
                        WinJS.Promise.timeout(300).then(function () {
                            _this.renderSongs(songs.songs);
                        });
                    });
                };
                AlbumsDetailPage.prototype.renderSongs = function (songs) {
                    var _this = this;
                    if (songs) {
                        var container = document.createDocumentFragment();
                        var p = [];
                        var elts = [];
                        songs.forEach(function (s) {
                            p.push(KodiPassion.Templates.song.render(s).then(function (rendered) {
                                rendered.style.opacity = "0";
                                elts.push(rendered);
                                container.appendChild(rendered);
                                var btnplay = rendered.querySelector(".kdp-play");
                                var btnadd = rendered.querySelector(".kdp-add");
                                WinJSContrib.UI.tap(btnplay, function () {
                                    return Kodi.API.Music.playSong(s.songid);
                                });
                                WinJSContrib.UI.tap(btnadd, function () {
                                    return Kodi.API.Music.queueSong(s.songid);
                                });
                            }));
                        });
                        WinJS.Promise.join(p).then(function () {
                            _this.albumSongs.appendChild(container);
                            WinJS.UI.Animation.enterPage(elts);
                        });
                    }
                };
                AlbumsDetailPage.prototype.addAlbum = function () {
                    return Kodi.API.Music.queueAlbum(this.album.albumid);
                };
                AlbumsDetailPage.prototype.playAlbum = function () {
                    return Kodi.API.Music.playAlbum(this.album.albumid);
                };
                AlbumsDetailPage.url = "/pages/albums/detail/albumsdetail.html";
                return AlbumsDetailPage;
            })();
            Pages.AlbumsDetailPage = AlbumsDetailPage;
            WinJS.UI.Pages.define(AlbumsDetailPage.url, AlbumsDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var AlbumsListPage = (function () {
                function AlbumsListPage() {
                }
                AlbumsListPage.prototype.init = function (element, options) {
                    var page = this;
                    element.classList.add("page-albumslist");
                    var view = AlbumsListPage.albumViews["wall"];
                    page.itemsPromise = Kodi.Data.loadRootData();
                };
                AlbumsListPage.prototype.setView = function (viewname) {
                    var page = this;
                    page.cleanViewClasses();
                    var view = AlbumsListPage.albumViews[viewname] || AlbumsListPage.albumViews["wall"];
                    if (view.groupKind) {
                        page.semanticzoom.dataManager.groupKind = view.groupKind;
                        page.semanticzoom.dataManager.field = view.groupField;
                    }
                    page.element.classList.add("view-" + viewname);
                    page.semanticzoom.listview.itemTemplate = view.template.element;
                };
                AlbumsListPage.prototype.cleanViewClasses = function () {
                    var page = this;
                    for (var v in AlbumsListPage.albumViews) {
                        page.element.classList.remove("view-" + v);
                    }
                };
                AlbumsListPage.prototype.processed = function (element, options) {
                    var page = this;
                    if (options && options.genre) {
                        page.selectedGenre = options.genre;
                        page.genretitle.innerText = page.selectedGenre;
                    }
                    page.itemsStyle = document.createElement("STYLE");
                    page.element.appendChild(page.itemsStyle);
                    page.itemsPromise = page.itemsPromise.then(function (data) {
                        page.albums = data.music.albums;
                        page.genres = data.musicGenres.genres;
                        page.setView("wall");
                        page.semanticzoom.dataManager.filter = function (movie) {
                            if (!page.selectedGenre)
                                return true;
                            var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
                            return hasgenre;
                        };
                        page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                        page.semanticzoom.listview.layout.orientation = "vertical";
                        page.semanticzoom.listview.oniteminvoked = function (arg) {
                            arg.detail.itemPromise.then(function (item) {
                                WinJS.Navigation.navigate("/pages/albums/detail/albumsdetail.html", { album: item.data, navigateStacked: true });
                            });
                        };
                    });
                };
                AlbumsListPage.prototype.ready = function () {
                    var page = this;
                    page.itemsPromise.then(function () {
                        page.calcItemsSizes();
                        page.semanticzoom.dataManager.items = page.albums;
                    });
                };
                AlbumsListPage.prototype.pickGenre = function () {
                    var page = this;
                    KodiPassion.UI.GenrePicker.pick(page.genres).then(function (genre) {
                        if (genre) {
                            if (genre === "all") {
                                page.selectedGenre = null;
                                page.genretitle.innerText = "all";
                            }
                            else {
                                page.selectedGenre = genre.label;
                                page.genretitle.innerText = page.selectedGenre;
                            }
                            page.semanticzoom.dataManager.refresh();
                        }
                    });
                };
                AlbumsListPage.prototype.updateLayout = function (element) {
                    var page = this;
                    this.calcItemsSizes();
                    page.semanticzoom.listview.forceLayout();
                };
                AlbumsListPage.prototype.calcItemsSizes = function () {
                    var page = this;
                    var w = page.element.clientWidth;
                    if (w) {
                        var nbitems = ((w / 500) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1 - 0.25;
                        page.itemsStyle.innerHTML = ".page-albumslist.view-wall .album-item { width:" + posterW + "px; }";
                    }
                };
                AlbumsListPage.url = "/pages/albums/list/albumslist.html";
                AlbumsListPage.albumViews = {
                    "wall": {
                        groupKind: null,
                        groupField: null,
                        template: KodiPassion.Templates.album
                    },
                    "alphabetic": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'title',
                        template: KodiPassion.Templates.album
                    },
                    "year": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'year',
                        template: KodiPassion.Templates.album
                    }
                };
                return AlbumsListPage;
            })();
            Pages.AlbumsListPage = AlbumsListPage;
            WinJS.UI.Pages.define(AlbumsListPage.url, AlbumsListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var BootstrapPage = (function () {
                function BootstrapPage() {
                }
                BootstrapPage.prototype.init = function () {
                    document.body.classList.add("unconnected");
                };
                BootstrapPage.prototype.processed = function (element, options) {
                    var page = this;
                    page.defaultname = Kodi.Settings.defaultConnection();
                    page.settingsForm.setting = Kodi.Settings.getSetting(page.defaultname);
                };
                BootstrapPage.prototype.testConnection = function () {
                    var page = this;
                    page.messages.innerHTML = "";
                    if (page.settingsForm.validate()) {
                        var setting = page.settingsForm.setting;
                        return Kodi.API.testServerSetting(setting).then(function () {
                            Kodi.Settings.save(page.defaultname, setting, true);
                            Kodi.API.currentSettings = setting;
                            return KodiPassion.UI.DataLoader.showLoader(true);
                        }, function () {
                            page.messages.innerText = "Server cannot be reached. Please verify that your Kodi or XBMC is running and check it's configuration. Also check your network settings like firewall configuration";
                        });
                    }
                };
                BootstrapPage.url = "/pages/bootstrap/bootstrap.html";
                return BootstrapPage;
            })();
            Pages.BootstrapPage = BootstrapPage;
            WinJS.UI.Pages.define(BootstrapPage.url, BootstrapPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var HomePage = (function () {
                function HomePage() {
                    this.allowAutoFlip = true;
                }
                HomePage.prototype.processed = function (element, options) {
                    var _this = this;
                    var page = this;
                    //Kodi.API.introspect().then(function (api) {
                    //    Windows.Storage.ApplicationData.current.localFolder.createFileAsync("kodiapi.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                    //        console.log("kodi api details at " + file.path);
                    //        return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(api));
                    //    });
                    //});        
                    var registerpointerdown = page.eventTracker.addEvent(page.element, "pointerdown", function () {
                        _this.allowAutoFlip = false;
                        registerpointerdown();
                    }, true);
                    Kodi.Data.loadRootData().then(function (data) {
                        page.data = data;
                        _this.loadMovies(data);
                        _this.loadTvshows(data);
                        _this.loadAlbums(data);
                    });
                };
                HomePage.prototype.flipMovies = function () {
                    var _this = this;
                    if (this.allowAutoFlip) {
                        this.mainsplitview.itemDataSource.getCount().then(function (nbitems) {
                            if (_this.mainsplitview.currentPage < nbitems - 1) {
                                _this.mainsplitview.currentPage = _this.mainsplitview.currentPage + 1;
                            }
                            else {
                                _this.mainsplitview.currentPage = 0;
                            }
                        });
                        setTimeout(function () {
                            _this.flipMovies();
                        }, 7000);
                    }
                };
                HomePage.prototype.flipTvshows = function () {
                    var _this = this;
                    if (this.allowAutoFlip) {
                        this.tvshowsflipview.itemDataSource.getCount().then(function (nbitems) {
                            if (_this.tvshowsflipview.currentPage < nbitems - 1) {
                                _this.tvshowsflipview.currentPage = _this.tvshowsflipview.currentPage + 1;
                            }
                            else {
                                _this.tvshowsflipview.currentPage = 0;
                            }
                        });
                        setTimeout(function () {
                            _this.flipTvshows();
                        }, 7000);
                    }
                };
                HomePage.prototype.loadMovies = function (data) {
                    var _this = this;
                    if (data.movies && data.movies.movies) {
                        this.flipviewtemplate = new WinJS.Binding.Template(null, { href: '/templates/moviesplitview.html', extractChild: true });
                        this.mainsplitview.itemTemplate = function (itemPromise) {
                            return itemPromise.then(function (item) {
                                return _this.flipviewtemplate.render(item.data).then(function (rendered) {
                                    WinJSContrib.UI.tap(rendered, function (elt) {
                                        if (!_this.element.classList.contains("inactive")) {
                                            WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                                        }
                                    }, { disableAnimation: true });
                                    return rendered;
                                });
                            });
                        };
                        var movies = {};
                        if (data.recentMovies && data.recentMovies.movies) {
                            data.recentMovies.movies.forEach(function (e) {
                                if (!e.lastplayed) {
                                    movies[e.movieid] = true;
                                }
                            });
                        }
                        var movieslist = data.movies.movies.slice(0, data.movies.movies.length);
                        movieslist = movieslist.sort(this.getSortFunction(movies, "movieid"));
                        this.mainsplitview.itemDataSource = new WinJS.Binding.List(movieslist).dataSource;
                        setTimeout(function () {
                            _this.flipMovies();
                        }, 4000);
                    }
                    else {
                        this.moviesbloc.style.display = "none";
                    }
                };
                HomePage.prototype.loadTvshows = function (data) {
                    var _this = this;
                    if (data.tvshows && data.tvshows.tvshows) {
                        this.tvshowsflipview.itemTemplate = function (itemPromise) {
                            return itemPromise.then(function (item) {
                                return _this.flipviewtemplate.render(item.data).then(function (rendered) {
                                    WinJSContrib.UI.tap(rendered, function (elt) {
                                        if (!_this.element.classList.contains("inactive")) {
                                            WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item.data, navigateStacked: true });
                                        }
                                    }, { disableAnimation: true });
                                    return rendered;
                                });
                            });
                        };
                        var tvshows = {};
                        data.tvshowRecentEpisodes.episodes.forEach(function (e) {
                            if (!e.lastplayed && !tvshows[e.tvshowid]) {
                                tvshows[e.tvshowid] = true;
                            }
                        });
                        var tvshowslist = data.tvshows.tvshows.slice(0, data.tvshows.tvshows.length);
                        tvshowslist = tvshowslist.sort(this.getSortFunction(tvshows, "tvshowid"));
                        this.tvshowsflipview.itemDataSource = new WinJS.Binding.List(tvshowslist).dataSource;
                        setTimeout(function () {
                            _this.flipTvshows();
                        }, 5000);
                    }
                    else {
                        this.tvshowsbloc.style.display = "none";
                    }
                };
                HomePage.prototype.loadAlbums = function (data) {
                    var _this = this;
                    if (data.music && data.music.albums) {
                        var container = document.createDocumentFragment();
                        var p = [];
                        data.recentMusic.albums.slice(0, 12).forEach(function (a) {
                            p.push(KodiPassion.Templates.album.render(a).then(function (rendered) {
                                container.appendChild(rendered);
                                WinJSContrib.UI.tap(rendered, function () {
                                    WinJS.Navigation.navigate("/pages/albums/detail/albumsdetail.html", { album: a, navigateStacked: true });
                                });
                            }));
                        });
                        WinJS.Promise.join(p).then(function () {
                            _this.albumscontainer.appendChild(container);
                        });
                    }
                    else {
                        this.musicbloc.style.display = "none";
                    }
                };
                HomePage.prototype.getSortFunction = function (catalog, fieldname) {
                    var calcpoints = function (item) {
                        var p = item.rating;
                        if (catalog[item[fieldname]])
                            p += 10000;
                        if (!item.lastplayed)
                            p += 5000;
                        return p;
                    };
                    return function (a, b) {
                        var aPoints = calcpoints(a);
                        var bPoints = calcpoints(b);
                        if (aPoints > bPoints)
                            return -1;
                        if (aPoints < bPoints)
                            return 1;
                        if (a.lastplayed < b.lastplayed) {
                            return -1;
                        }
                        else if (a.lastplayed > b.lastplayed) {
                            return 1;
                        }
                        if (a.playcount < b.playcount) {
                            return -1;
                        }
                        else if (a.playcount > b.playcount) {
                            return 1;
                        }
                    };
                };
                HomePage.prototype.scanVideos = function () {
                    Kodi.API.Videos.Movies.scan();
                };
                HomePage.prototype.cleanVideos = function () {
                    Kodi.API.Videos.Movies.clean();
                };
                HomePage.prototype.moviesGenres = function () {
                    if (this.data && this.data.movieGenres && this.data.movieGenres.genres) {
                        KodiPassion.UI.GenrePicker.pick(this.data.movieGenres.genres).then(function (genre) {
                            if (genre) {
                                if (genre === "all") {
                                    WinJS.Navigation.navigate("/pages/movies/list/movieslist.html");
                                }
                                else {
                                    WinJS.Navigation.navigate("/pages/movies/list/movieslist.html", { genre: genre.label });
                                }
                            }
                        });
                    }
                };
                HomePage.prototype.tvshowsGenres = function () {
                    if (this.data && this.data.tvshowGenres && this.data.tvshowGenres.genres) {
                        KodiPassion.UI.GenrePicker.pick(this.data.tvshowGenres.genres).then(function (genre) {
                            if (genre) {
                                if (genre === "all") {
                                    WinJS.Navigation.navigate("/pages/tvshows/list/tvshowslist.html");
                                }
                                else {
                                    WinJS.Navigation.navigate("/pages/tvshows/list/tvshowslist.html", { genre: genre.label });
                                }
                            }
                        });
                    }
                };
                HomePage.prototype.albumsGenres = function () {
                    if (this.data && this.data.tvshowGenres && this.data.tvshowGenres.genres) {
                        KodiPassion.UI.GenrePicker.pick(this.data.musicGenres.genres).then(function (genre) {
                            if (genre) {
                                if (genre === "all") {
                                    WinJS.Navigation.navigate("/pages/albums/list/albumslist.html");
                                }
                                else {
                                    WinJS.Navigation.navigate("/pages/albums/list/albumslist.html", { genre: genre.label });
                                }
                            }
                        });
                    }
                };
                HomePage.prototype.unload = function () {
                    this.allowAutoFlip = false;
                };
                HomePage.url = "/pages/home/home.html";
                return HomePage;
            })();
            Pages.HomePage = HomePage;
            WinJS.UI.Pages.define(HomePage.url, HomePage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var actortemplate = new WinJS.Binding.Template(null, { href: '/templates/actor.html', extractChild: true });
            var MovieDetailPage = (function () {
                function MovieDetailPage() {
                }
                MovieDetailPage.prototype.processed = function (element, options) {
                    var _this = this;
                    this.movie = options.movie;
                    this.element.id = "page-" + WinJSContrib.Utils.guid();
                    this.actorsAspectRatio.prefix = "#" + this.element.id + " .page-moviesdetail";
                    this.eventTracker.addEvent(this.scrollContainer, "scroll", function () {
                        cancelAnimationFrame(_this.scrollDelay);
                        _this.scrollDelay = requestAnimationFrame(function () {
                            _this.checkScroll();
                        });
                    });
                    if (this.movie.file) {
                        var path = Kodi.Utils.getNetworkPath(this.movie.file);
                        if (path) {
                            //this.btnDownloadMovie.style.display = "";
                            this.btnPlayMovieLocal.style.display = "";
                        }
                    }
                    Kodi.API.Videos.Movies.getMovieDetails(this.movie.movieid).then(function (detail) {
                        if (detail.moviedetails.resume && detail.moviedetails.resume.position) {
                            _this.btnResumeMovie.style.display = "";
                        }
                    }, function (err) {
                        var e = err;
                    });
                    var p = [];
                    var bindables = this.element.querySelectorAll(".moviebinding");
                    for (var i = 0, l = bindables.length; i < l; i++) {
                        p.push(WinJS.Binding.processAll(bindables[i], options.movie));
                    }
                    return WinJS.Promise.join(p);
                };
                MovieDetailPage.prototype.ready = function (element, options) {
                    var _this = this;
                    setTimeout(function () {
                        _this.renderCast();
                    }, 400);
                };
                MovieDetailPage.prototype.renderCast = function () {
                    var _this = this;
                    var container = document.createDocumentFragment();
                    var p = [];
                    var items = [];
                    this.movie.cast.slice(0, 20).forEach(function (c) {
                        p.push(actortemplate.render(c).then(function (rendered) {
                            rendered.style.opacity = '0';
                            items.push(rendered);
                            container.appendChild(rendered);
                        }));
                    });
                    WinJS.Promise.join(p).then(function () {
                        _this.castItems.appendChild(container);
                        WinJS.UI.Animation.enterPage(items);
                    });
                };
                MovieDetailPage.prototype.checkScroll = function () {
                    var h = this.headerbanner.clientHeight;
                    var posterinbanner = this.visualstate.states.medium.active;
                    if (!posterinbanner && this.headerposter.style.opacity) {
                        this.headerposter.style.opacity = '';
                    }
                    var dif = (h - this.scrollContainer.scrollTop);
                    if (dif < 0) {
                        if (this.headerbanner.style.opacity != '0') {
                            this.headerbanner.style.opacity = '0';
                        }
                        if (posterinbanner && this.headerposter.style.opacity != '0') {
                            this.headerposter.style.opacity = '0';
                        }
                    }
                    else {
                        var val = (dif / h) + '';
                        this.headerbanner.style.opacity = val;
                        if (posterinbanner) {
                            this.headerposter.style.opacity = val;
                        }
                    }
                };
                MovieDetailPage.prototype.resumeMovie = function () {
                    return Kodi.API.Videos.Movies.playMovie(this.movie.movieid, true);
                };
                MovieDetailPage.prototype.playMovie = function () {
                    return Kodi.API.Videos.Movies.playMovie(this.movie.movieid);
                };
                MovieDetailPage.prototype.playMovieLocal = function () {
                    return Kodi.App.playLocalMedia(this.movie.file);
                };
                MovieDetailPage.prototype.downloadMovie = function () {
                };
                MovieDetailPage.prototype.updateLayout = function () {
                    this.checkScroll();
                };
                MovieDetailPage.url = "/pages/movies/detail/moviesdetail.html";
                return MovieDetailPage;
            })();
            Pages.MovieDetailPage = MovieDetailPage;
            Pages.MovieDetail = WinJS.UI.Pages.define(MovieDetailPage.url, MovieDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var MoviesListPage = (function () {
                function MoviesListPage() {
                }
                MoviesListPage.prototype.init = function (element, options) {
                    var page = this;
                    element.classList.add("page-movieslist");
                    var view = MoviesListPage.moviesViews["wall"];
                    page.itemsPromise = Kodi.Data.loadRootData();
                };
                MoviesListPage.prototype.setView = function (viewname) {
                    var page = this;
                    page.cleanViewClasses();
                    var view = MoviesListPage.moviesViews[viewname] || MoviesListPage.moviesViews["wall"];
                    if (view.groupKind) {
                        page.semanticzoom.dataManager.groupKind = view.groupKind;
                        page.semanticzoom.dataManager.field = view.groupField;
                    }
                    page.element.classList.add("view-" + viewname);
                    page.semanticzoom.listview.itemTemplate = view.template.element;
                };
                MoviesListPage.prototype.cleanViewClasses = function () {
                    var page = this;
                    for (var v in MoviesListPage.moviesViews) {
                        page.element.classList.remove("view-" + v);
                    }
                };
                MoviesListPage.prototype.processed = function (element, options) {
                    var page = this;
                    if (options && options.genre) {
                        page.selectedGenre = options.genre;
                        page.genretitle.innerText = page.selectedGenre;
                    }
                    page.itemsStyle = document.createElement("STYLE");
                    page.element.appendChild(page.itemsStyle);
                    page.itemsPromise = page.itemsPromise.then(function (data) {
                        page.movies = data.movies.movies;
                        page.genres = data.movieGenres.genres;
                        page.setView("wall");
                        page.semanticzoom.dataManager.filter = function (movie) {
                            if (!page.selectedGenre)
                                return true;
                            var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
                            return hasgenre;
                        };
                        page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                        page.semanticzoom.listview.layout.orientation = "vertical";
                        page.semanticzoom.listview.oniteminvoked = function (arg) {
                            arg.detail.itemPromise.then(function (item) {
                                WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                            });
                        };
                    });
                };
                MoviesListPage.prototype.ready = function () {
                    var page = this;
                    page.itemsPromise.then(function () {
                        page.calcItemsSizes();
                        page.semanticzoom.dataManager.items = page.movies;
                    });
                };
                MoviesListPage.prototype.pickGenre = function () {
                    var page = this;
                    KodiPassion.UI.GenrePicker.pick(page.genres).then(function (genre) {
                        if (genre) {
                            if (genre === "all") {
                                page.selectedGenre = null;
                                page.genretitle.innerText = "all";
                            }
                            else {
                                page.selectedGenre = genre.label;
                                page.genretitle.innerText = page.selectedGenre;
                            }
                            page.semanticzoom.dataManager.refresh();
                        }
                    });
                };
                MoviesListPage.prototype.updateLayout = function (element) {
                    var page = this;
                    this.calcItemsSizes();
                    page.semanticzoom.listview.forceLayout();
                };
                MoviesListPage.prototype.calcItemsSizes = function () {
                    var page = this;
                    var w = page.element.clientWidth;
                    if (w) {
                        var nbitems = ((w / 260) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                        page.itemsStyle.innerHTML = ".page-movieslist.view-wall .movie { width:" + posterW + "px; height:" + posterH + "px}";
                    }
                };
                MoviesListPage.url = "/pages/movies/list/movieslist.html";
                MoviesListPage.moviesViews = {
                    "wall": {
                        groupKind: null,
                        groupField: null,
                        template: KodiPassion.Templates.movieposter
                    },
                    "alphabetic": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'title',
                        template: KodiPassion.Templates.movieposter
                    },
                    "year": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'year',
                        template: KodiPassion.Templates.movieposter
                    }
                };
                return MoviesListPage;
            })();
            Pages.MoviesListPage = MoviesListPage;
            WinJS.UI.Pages.define(MoviesListPage.url, MoviesListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var SearchPage = (function () {
                function SearchPage() {
                }
                SearchPage.prototype.processed = function (element, options) {
                };
                SearchPage.url = "/pages/search/search.html";
                return SearchPage;
            })();
            Pages.SearchPage = SearchPage;
            WinJS.UI.Pages.define(SearchPage.url, SearchPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var SettingsServerDetailPage = (function () {
                function SettingsServerDetailPage() {
                }
                Object.defineProperty(SettingsServerDetailPage.prototype, "isDefault", {
                    get: function () {
                        return this.makedefault.checked;
                    },
                    enumerable: true,
                    configurable: true
                });
                SettingsServerDetailPage.prototype.processed = function (element, options) {
                    this.settingName = options.setting;
                    this.setting = Kodi.Settings.getSetting(options.setting) || { name: "new server", host: null, port: 80, user: "", password: "", macAddress: [], };
                    this.settingsForm.setting = this.setting;
                };
                SettingsServerDetailPage.prototype.saveSetting = function () {
                    if (this.settingsForm.validate()) {
                        Kodi.Settings.save(this.settingName || this.settingsForm.setting.name, this.settingsForm.setting, this.isDefault);
                        WinJS.Navigation.back();
                    }
                };
                SettingsServerDetailPage.prototype.closeDetail = function () {
                    WinJS.Navigation.back();
                };
                SettingsServerDetailPage.url = "/pages/settings/serverdetail/serverdetail.html";
                return SettingsServerDetailPage;
            })();
            Pages.SettingsServerDetailPage = SettingsServerDetailPage;
            WinJS.UI.Pages.define(SettingsServerDetailPage.url, SettingsServerDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var SettingsPage = (function () {
                function SettingsPage() {
                }
                SettingsPage.prototype.processed = function (element, options) {
                };
                SettingsPage.prototype.pageNavActivate = function () {
                    this.serversettings.renderSettings();
                };
                SettingsPage.url = "/pages/settings/settings.html";
                return SettingsPage;
            })();
            Pages.SettingsPage = SettingsPage;
            WinJS.UI.Pages.define(SettingsPage.url, SettingsPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var StartUpPage = (function () {
                function StartUpPage() {
                }
                StartUpPage.prototype.processed = function (element, options) {
                    var _this = this;
                    this.eventTracker.addEvent(this.serversettings, "settingslistmessage", function (arg) {
                        if (arg.detail.message) {
                            _this.messages.innerHTML = arg.detail.message;
                        }
                    });
                };
                StartUpPage.prototype.pageNavActivate = function () {
                    this.serversettings.renderSettings();
                };
                StartUpPage.url = "/pages/startup/startup.html";
                return StartUpPage;
            })();
            Pages.StartUpPage = StartUpPage;
            WinJS.UI.Pages.define(StartUpPage.url, StartUpPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var TvShowsListPage = (function () {
                function TvShowsListPage() {
                }
                TvShowsListPage.prototype.init = function (element, options) {
                    var page = this;
                    element.classList.add("page-tvshowslist");
                    var view = TvShowsListPage.tvshowsViews["wall"];
                    page.itemsPromise = Kodi.Data.loadRootData();
                };
                TvShowsListPage.prototype.setView = function (viewname) {
                    var page = this;
                    page.cleanViewClasses();
                    var view = TvShowsListPage.tvshowsViews[viewname] || TvShowsListPage.tvshowsViews["wall"];
                    if (view.groupKind) {
                        page.semanticzoom.dataManager.groupKind = view.groupKind;
                        page.semanticzoom.dataManager.field = view.groupField;
                    }
                    page.element.classList.add("view-" + viewname);
                    page.listitemtemplate = new WinJS.Binding.Template(null, { href: view.template });
                    page.semanticzoom.listview.itemTemplate = page.listitemtemplate.element;
                };
                TvShowsListPage.prototype.cleanViewClasses = function () {
                    var page = this;
                    for (var v in TvShowsListPage.tvshowsViews) {
                        page.element.classList.remove("view-" + v);
                    }
                };
                TvShowsListPage.prototype.processed = function (element, options) {
                    var page = this;
                    if (options && options.genre) {
                        page.selectedGenre = options.genre;
                        page.genretitle.innerText = page.selectedGenre;
                    }
                    page.itemsStyle = document.createElement("STYLE");
                    page.element.appendChild(page.itemsStyle);
                    page.itemsPromise = page.itemsPromise.then(function (data) {
                        page.tvshows = data.tvshows.tvshows;
                        page.genres = data.tvshowGenres.genres;
                        page.setView("wall");
                        page.semanticzoom.dataManager.filter = function (movie) {
                            if (!page.selectedGenre)
                                return true;
                            var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
                            return hasgenre;
                        };
                        page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                        page.semanticzoom.listview.layout.orientation = "vertical";
                        page.semanticzoom.listview.oniteminvoked = function (arg) {
                            arg.detail.itemPromise.then(function (item) {
                                WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item.data, navigateStacked: true });
                            });
                        };
                    });
                };
                TvShowsListPage.prototype.ready = function () {
                    var page = this;
                    page.itemsPromise.then(function () {
                        page.calcItemsSizes();
                        page.semanticzoom.dataManager.items = page.tvshows;
                    });
                };
                TvShowsListPage.prototype.pickGenre = function () {
                    var page = this;
                    KodiPassion.UI.GenrePicker.pick(page.genres).then(function (genre) {
                        if (genre) {
                            if (genre === "all") {
                                page.selectedGenre = null;
                                page.genretitle.innerText = "all";
                            }
                            else {
                                page.selectedGenre = genre.label;
                                page.genretitle.innerText = page.selectedGenre;
                            }
                            page.semanticzoom.dataManager.refresh();
                        }
                    });
                };
                TvShowsListPage.prototype.updateLayout = function (element) {
                    var page = this;
                    this.calcItemsSizes();
                    page.semanticzoom.listview.forceLayout();
                };
                TvShowsListPage.prototype.calcItemsSizes = function () {
                    var page = this;
                    var w = page.element.clientWidth;
                    if (w) {
                        var nbitems = ((w / 260) << 0) + 1;
                        var posterW = ((w / nbitems) << 0) - 1;
                        var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                        page.itemsStyle.innerHTML = ".page-tvshowslist.view-wall .tvshow { width:" + posterW + "px; height:" + posterH + "px}";
                    }
                };
                TvShowsListPage.url = "/pages/tvshows/list/tvshowslist.html";
                TvShowsListPage.tvshowsViews = {
                    "wall": {
                        groupKind: null,
                        groupField: null,
                        template: '/templates/tvshowposter.html'
                    },
                    "alphabetic": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'title',
                        template: '/templates/tvshowposter.html'
                    },
                    "year": {
                        groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                        groupField: 'year',
                        template: '/templates/tvshowposter.html'
                    }
                };
                return TvShowsListPage;
            })();
            Pages.TvShowsListPage = TvShowsListPage;
            WinJS.UI.Pages.define(TvShowsListPage.url, TvShowsListPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var TvShowsDetailPage = (function () {
                function TvShowsDetailPage() {
                }
                TvShowsDetailPage.prototype.init = function (element, options) {
                    this.tvshow = options.tvshow;
                    this.seasonsPromise = Kodi.API.Videos.TVShows.getTVShowSeasons(this.tvshow.tvshowid).then(function (seasons) {
                        if (seasons.seasons.length == 1) {
                            var season = seasons.seasons[0];
                            return Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                                season.episodes = episodes;
                                return seasons;
                            });
                        }
                        return seasons;
                    });
                };
                TvShowsDetailPage.prototype.processed = function (element, options) {
                    var _this = this;
                    this.eventTracker.addEvent(this.scrollContainer, "scroll", function () {
                        cancelAnimationFrame(_this.scrollDelay);
                        _this.scrollDelay = requestAnimationFrame(function () {
                            _this.checkScroll();
                        });
                    });
                    return WinJS.Binding.processAll(element.querySelector('.tvshowsseriedetail'), options.tvshow);
                };
                TvShowsDetailPage.prototype.checkScroll = function () {
                    var h = this.headerbanner.clientHeight;
                    var posterinbanner = this.visualstate.states.medium.active;
                    if (!posterinbanner && this.headerposter.style.opacity) {
                        this.headerposter.style.opacity = '';
                    }
                    var dif = (h - this.scrollContainer.scrollTop);
                    if (dif <= 0) {
                        if (this.headerbanner.style.opacity != '0') {
                            this.headerbanner.style.opacity = '0';
                        }
                        if (posterinbanner && this.headerposter.style.opacity != '0') {
                            this.headerposter.style.opacity = '0';
                        }
                    }
                    else {
                        var val = (dif / h) + '';
                        this.headerbanner.style.opacity = val;
                        if (posterinbanner) {
                            this.headerposter.style.opacity = val;
                        }
                    }
                };
                TvShowsDetailPage.prototype.ready = function (element, options) {
                    var _this = this;
                    this.seasonsPromise.then(function (seasons) {
                        if (seasons) {
                            var container = document.createDocumentFragment();
                            var p = [];
                            if (seasons.seasons.length == 1) {
                                p.push(WinJS.Promise.timeout(200).then(function () {
                                    _this.renderEpisodes(container, seasons.seasons[0].episodes.episodes);
                                }));
                            }
                            else {
                                seasons.seasons.forEach(function (s) {
                                    p.push(_this.renderSeason(container, s));
                                });
                                setImmediate(function () {
                                });
                            }
                            WinJS.Promise.join(p).then(function () {
                                _this.seasonsItems.appendChild(container);
                                var seasons = _this.seasonsItems.querySelectorAll(".season");
                                if (seasons.length) {
                                    WinJS.UI.Animation.enterPage(seasons);
                                }
                            });
                        }
                    });
                };
                TvShowsDetailPage.prototype.renderSeason = function (container, season) {
                    var _this = this;
                    var tmpseason = season;
                    return this.seasonTemplate.render(season).then(function (rendered) {
                        rendered.style.opacity = '0';
                        container.appendChild(rendered);
                        var episodesContainer = rendered.querySelector(".season-episodes");
                        var episodesDesc = rendered.querySelector(".season-desc");
                        WinJSContrib.UI.tap(episodesDesc, function () {
                            rendered.classList.toggle("expanded");
                            if (!tmpseason.hasEpisodes) {
                                tmpseason.hasEpisodes = true;
                                Kodi.API.Videos.TVShows.getTVShowEpisodes(season.tvshowid, season.season).then(function (episodes) {
                                    _this.renderEpisodes(episodesContainer, episodes.episodes);
                                });
                            }
                            else if (rendered.classList.contains("expanded")) {
                                setImmediate(function () {
                                    WinJS.UI.Animation.enterPage(episodesContainer.querySelectorAll('.episode'));
                                });
                            }
                            else {
                                $('.episode', episodesContainer).css('opacity', '0');
                            }
                        });
                    });
                };
                TvShowsDetailPage.prototype.renderEpisodes = function (container, episodes) {
                    var _this = this;
                    var items = [];
                    episodes.forEach(function (e) {
                        _this.episodeTemplate.render(e).then(function (rendered) {
                            items.push(rendered);
                            rendered.style.opacity = '0';
                            _this.prepareEpisode(e, rendered);
                            container.appendChild(rendered);
                        });
                    });
                    setImmediate(function () {
                        WinJS.UI.Animation.enterPage(items);
                    });
                };
                TvShowsDetailPage.prototype.prepareEpisode = function (episode, element) {
                    var btnplay = element.querySelector(".btnplay");
                    var btnadd = element.querySelector(".btnadd");
                    var btnplaylocal = element.querySelector(".btnplaylocal");
                    var btndownload = element.querySelector(".btndownload");
                    var path = Kodi.Utils.getNetworkPath(episode.file);
                    if (path) {
                        btnplaylocal.style.display = "";
                    }
                    WinJSContrib.UI.tap(btnplay, function () {
                        return Kodi.API.Videos.TVShows.playEpisode(episode.episodeid);
                    });
                    if (btnadd) {
                        WinJSContrib.UI.tap(btnadd, function () {
                            return Kodi.API.Videos.TVShows.queueEpisode(episode.episodeid);
                        });
                    }
                    WinJSContrib.UI.tap(btnplaylocal, function () {
                        return Kodi.App.playLocalMedia(episode.file);
                    });
                };
                TvShowsDetailPage.prototype.updateLayout = function () {
                    this.checkScroll();
                };
                TvShowsDetailPage.url = "/pages/tvshows/seriedetail/tvshowsseriedetail.html";
                return TvShowsDetailPage;
            })();
            Pages.TvShowsDetailPage = TvShowsDetailPage;
            WinJS.UI.Pages.define(TvShowsDetailPage.url, TvShowsDetailPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Input;
        (function (Input) {
            //export function properties() {
            //    return API.kodiRequest<any>('Application.GetProperties', { properties: ["muted", "volume", "version"] });
            //}
            function mute(mute) {
                Kodi.NowPlaying.current.muted = mute;
                return API.kodiRequest('Application.SetMute', { mute: mute });
            }
            Input.mute = mute;
            function volumeMute() {
                return mute(true);
            }
            Input.volumeMute = volumeMute;
            function volumeUnmute() {
                return mute(false);
            }
            Input.volumeUnmute = volumeUnmute;
            function volume(volume) {
                Kodi.NowPlaying.current.volume = volume;
                return API.kodiRequest('Application.SetVolume', { volume: volume });
            }
            Input.volume = volume;
            function back() {
                return API.kodiRequest('Input.Back');
            }
            Input.back = back;
            function home() {
                return API.kodiRequest('Input.Home');
            }
            Input.home = home;
            function select() {
                return API.kodiRequest('Input.Select');
            }
            Input.select = select;
            function menu() {
                return API.kodiRequest('Input.ContextMenu');
            }
            Input.menu = menu;
            function info() {
                return API.kodiRequest('Input.Info');
            }
            Input.info = info;
            function up() {
                return API.kodiRequest('Input.Up');
            }
            Input.up = up;
            function down() {
                return API.kodiRequest('Input.Down');
            }
            Input.down = down;
            function left() {
                return API.kodiRequest('Input.Left');
            }
            Input.left = left;
            function right() {
                return API.kodiRequest('Input.Right');
            }
            Input.right = right;
            function activateWindow(window, parameters) {
                return API.kodiRequest('GUI.ActivateWindow', { window: window, parameters: parameters }, false, true);
            }
            Input.activateWindow = activateWindow;
            function openMovies() {
                return activateWindow("videos", ["videodb://movies/titles/"]);
            }
            Input.openMovies = openMovies;
            function openTvShows() {
                return activateWindow("videos", ["videodb://tvshows/titles/"]);
            }
            Input.openTvShows = openTvShows;
            function openMusic() {
                return activateWindow("musiclibrary", ["musicdb://albums/"]);
            }
            Input.openMusic = openMusic;
            function openPictures() {
                return activateWindow("pictures", ["picturedb://"]);
            }
            Input.openPictures = openPictures;
        })(Input = API.Input || (API.Input = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Music;
        (function (Music) {
            function processAlbums(albumset, albumitemcallback) {
                if (albumset && albumset.albums && albumset.albums.length) {
                    albumset.albums.forEach(function (album) {
                        if (album.artist) {
                            var albtype = typeof album.artist;
                            if (albtype === 'object') {
                                album.allartists = album.artist;
                                album.artist = album.artist[0];
                            }
                        }
                        if (album.genre) {
                            var albtype = typeof album.genre;
                            if (albtype === 'object') {
                                album.allgenres = album.genre;
                                album.genre = album.allgenres.join(', ');
                            }
                        }
                        if (albumitemcallback)
                            albumitemcallback(album);
                    });
                }
            }
            Music.processAlbums = processAlbums;
            function AlbumOptions(detailed) {
                if (typeof detailed === "undefined") {
                    detailed = false;
                }
                if (detailed) {
                    return {
                        "properties": [
                            "title", "description", "artist", "genre", "theme", "mood", "style", "type", "albumlabel",
                            "rating", "year", "musicbrainzalbumid", "musicbrainzalbumartistid", "fanart", "thumbnail", "artistid"
                        ]
                    };
                }
                else {
                    return { "properties": ["thumbnail", "fanart", "artist", "style", "albumlabel", "genre", "year", "rating"], "sort": { "method": "label", "order": "ascending" } };
                }
            }
            function getGenres() {
                return API.kodiRequest('AudioLibrary.GetGenres', { "sort": { "method": "label", "order": "ascending" } }, false, true);
            }
            Music.getGenres = getGenres;
            function getArtists() {
                return API.kodiRequest('AudioLibrary.GetArtists', { "sort": { "method": "label", "order": "ascending" } });
            }
            Music.getArtists = getArtists;
            function scan() {
                return API.kodiRequest('AudioLibrary.Scan', {});
            }
            Music.scan = scan;
            //export function getFiles() : WinJS.Promise<any>  {
            //    return xbmcRequest('Files.GetSources', { "media": "music", "sort": { "method": "label", "order": "ascending" } });
            //}
            //export function getFilePath(path) : WinJS.Promise<any>  {
            //    return xbmcRequest('Files.GetDirectory', { "directory": path, "sort": { "method": "label", "order": "ascending" } });
            //}
            function getAllAlbums() {
                var data = AlbumOptions();
                return API.kodiRequest('AudioLibrary.GetAlbums', data, false, true).then(function (albums) {
                    processAlbums(albums);
                    return albums;
                });
            }
            Music.getAllAlbums = getAllAlbums;
            function getAlbumDetails(albumid) {
                var data = AlbumOptions(true);
                data.albumid = albumid;
                return API.kodiRequest('AudioLibrary.GetAlbumDetails', data);
            }
            Music.getAlbumDetails = getAlbumDetails;
            function getRecentAlbums() {
                var data = AlbumOptions();
                return API.kodiRequest('AudioLibrary.GetRecentlyAddedAlbums', data, false, true).then(function (albums) {
                    processAlbums(albums);
                    return albums;
                });
            }
            Music.getRecentAlbums = getRecentAlbums;
            function getAlbumsByArtist(artistid) {
                var data = AlbumOptions();
                data.artistid = artistid;
                return API.kodiRequest('AudioLibrary.GetAlbums', data).then(function (albums) {
                    processAlbums(albums);
                    return albums;
                });
            }
            Music.getAlbumsByArtist = getAlbumsByArtist;
            function getAlbumsByGenre(genreid) {
                var data = AlbumOptions();
                data.genreid = genreid;
                return API.kodiRequest('AudioLibrary.GetAlbums', data).then(function (albums) {
                    processAlbums(albums);
                    return albums;
                });
            }
            Music.getAlbumsByGenre = getAlbumsByGenre;
            function albumSongs(albumid) {
                if (API.version.major >= 12)
                    return API.kodiRequest('AudioLibrary.GetSongs', { filter: { albumid: albumid }, "properties": ["track", "duration", "file"] /*, "sort": { "method": "track", "order": "ascending" } */ });
                else
                    return API.kodiRequest('AudioLibrary.GetSongs', { "albumid": albumid, "properties": ["track", "duration", "file"], "sort": { "method": "track", "order": "ascending" } });
            }
            Music.albumSongs = albumSongs;
            function playAlbum(albumid) {
                return API.kodiRequest('Player.Open', { "item": { "albumid": albumid } }, true);
            }
            Music.playAlbum = playAlbum;
            function queueAlbum(albumid) {
                return API.kodiRequest('Playlist.Add', { "playlistid": 0, "item": { "albumid": albumid } }, true);
            }
            Music.queueAlbum = queueAlbum;
            function playSong(songid) {
                return API.kodiRequest('Player.Open', { "item": { "songid": songid } }, true);
            }
            Music.playSong = playSong;
            function queueSong(songid) {
                return API.kodiRequest('Playlist.Add', { "playlistid": 0, "item": { "songid": songid } }, true);
            }
            Music.queueSong = queueSong;
        })(Music = API.Music || (API.Music = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Player;
        (function (Player) {
            Player.currentPlayer;
            Player.currentPlayerProperties;
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
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var apiUrl = 'http://192.168.1.67:80';
        var apiId = 0;
        var apiVersion = '2.0';
        API.defaultCallTimeout = 10;
        API.currentSettings;
        API.version;
        function redirectToSettings(error) {
            if (error === 'noplayer')
                return WinJS.Promise.wrap();
            return WinJS.Navigation.navigate("/pages/settings/settings.html", { setting: API.currentSettings, error: error });
        }
        API.redirectToSettings = redirectToSettings;
        //ws.onopen = function () {
        //    console.log('open');
        //};
        //ws.onclose = function (evt) {
        //    console.log('closed')
        //};
        //ws.onmessage = function (evt) {
        //    console.log(evt.data)
        //};
        //ws.onerror = function (evt) {
        //    console.log(evt.data)
        //};
        function kodiServerRequest(setting, methodname, params, forceCheck, ignoreXBMCErrors, retries) {
            var p, completed = false, completeCallback, errorCallback = null;
            p = new WinJS.Promise(function (complete, error) {
                completeCallback = complete;
                errorCallback = error;
            });
            if (!setting) {
                var err = { message: 'not initialized' };
                setImmediate(function () {
                    errorCallback(err);
                });
                return p;
            }
            var reqdata = {
                "jsonrpc": apiVersion, "method": methodname, "id": apiId
            };
            if (params)
                reqdata.params = params;
            var url = setting.host + '/jsonrpc';
            if (setting.port !== 80) {
                url = setting.host + ':' + setting.port + '/jsonrpc';
            }
            if (!WinJSContrib.Utils.startsWith(url, 'http://')) {
                url = 'http://' + url;
            }
            var callData = JSON.stringify(reqdata);
            console.log('API call for ' + url + ' ' + callData);
            $.ajax({
                url: url,
                type: 'POST',
                username: setting.user,
                password: setting.password,
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                data: callData,
                success: function (data) {
                    Kodi.NowPlaying.current.reachable = true;
                    console.log('API call success for ' + url + ' ' + callData);
                    if (p._state && p._state.name && p._state.name == 'error') {
                        if (completed)
                            return;
                        else
                            errorCallback();
                    }
                    //if (ignoreXBMCErrors) {
                    //    complete();
                    //    return;
                    //}
                    if (data.error && !ignoreXBMCErrors && data.error.message !== 'Internal error.') {
                        completed = true;
                        errorCallback({ data: data, method: methodname });
                    }
                    else {
                        completed = true;
                        completeCallback(data.result);
                        if (forceCheck) {
                            WinJS.Application.queueEvent({ type: 'xbmcplayercheck' });
                        }
                    }
                },
                error: function (data) {
                    console.log('API call error for ' + url + ' ' + callData);
                    if (p._state && p._state.name && p._state.name == 'error') {
                        if (completed)
                            return;
                        else
                            errorCallback();
                    }
                    if (data.status === 0 && !retries) {
                        console.log('API call retry ' + url + ' ' + callData);
                        kodiServerRequest(setting, methodname, params, forceCheck, ignoreXBMCErrors, (retries || 0) + 1).done(function (data) {
                            completed = true;
                            completeCallback(data);
                        }, function (err) {
                            completed = true;
                            errorCallback(err);
                        });
                    }
                    else {
                        completed = true;
                        errorCallback(data);
                    }
                }
            });
            //});
            return WinJS.Promise.timeout(API.defaultCallTimeout * 1000, p);
        }
        API.kodiServerRequest = kodiServerRequest;
        function testServerSetting(setting) {
            return kodiServerRequest(setting, 'Application.GetProperties', { properties: ["volume", "muted", "version", "name"] }, false, false, 2);
        }
        API.testServerSetting = testServerSetting;
        function kodiRequest(methodname, params, forceCheck, ignoreXBMCErrors, retries) {
            return kodiServerRequest(API.currentSettings, methodname, params, forceCheck, ignoreXBMCErrors, retries).then(function (data) {
                if (API.version && API.version.major >= 12 && !Kodi.API.Websocket.current) {
                    Kodi.API.Websocket.init(API.currentSettings);
                }
                return data;
            });
        }
        API.kodiRequest = kodiRequest;
        function kodiThumbnail(thumburl) {
            var uri = API.currentSettings.host + ':' + API.currentSettings.port + '/vfs/' + encodeURIComponent(thumburl);
            if (!WinJSContrib.Utils.startsWith(uri, 'http://'))
                uri = 'http://' + uri;
            return uri;
        }
        API.kodiThumbnail = kodiThumbnail;
        function getFilePath(path) {
            var uri = API.currentSettings.host + ':' + API.currentSettings.port + '/' + path;
            if (!WinJSContrib.Utils.startsWith(uri, 'http://'))
                uri = 'http://' + uri;
            return uri;
        }
        API.getFilePath = getFilePath;
        function introspect() {
            return kodiRequest('JSONRPC.Introspect');
        }
        API.introspect = introspect;
        function properties() {
            return kodiRequest('Application.GetProperties', { properties: ["volume", "muted", "version", "name"] }, false, true);
        }
        API.properties = properties;
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Profiles;
        (function (Profiles) {
            var profileProperties = ["lockmode", "thumbnail"];
            function getCurrentProfile() {
                return new WinJS.Promise(function (complete, error) {
                    API.kodiRequest('Profiles.GetCurrentProfile', { properties: profileProperties }).then(function (profile) {
                        complete(profile);
                    }, function (err) {
                        complete();
                    });
                });
            }
            Profiles.getCurrentProfile = getCurrentProfile;
            function getProfiles() {
                return new WinJS.Promise(function (complete, error) {
                    API.kodiRequest('Profiles.GetProfiles', { properties: profileProperties }).then(function (profiles) {
                        complete(profiles);
                    }, function (err) {
                        complete();
                    });
                });
            }
            Profiles.getProfiles = getProfiles;
            function loadProfile(name, prompt, password) {
                var arg = { profile: name };
                if (prompt !== undefined)
                    arg.prompt = prompt;
                if (password !== undefined)
                    arg.password = password;
                return API.kodiRequest('Profiles.LoadProfile', arg);
            }
            Profiles.loadProfile = loadProfile;
        })(Profiles = API.Profiles || (API.Profiles = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var PlayList;
        (function (PlayList) {
            function getProperties(playlistid) {
                return API.kodiRequest('Playlist.GetProperties', { playlistid: playlistid });
            }
            PlayList.getProperties = getProperties;
            function getItems(playlistid) {
                return API.kodiRequest('Playlist.GetItems', { playlistid: playlistid, properties: ["set", "setid", "albumid", "album", "duration", "artist", "albumartist", "thumbnail", "tvshowid", "season", "episode"] });
            }
            PlayList.getItems = getItems;
            function removeAt(playlistid, position) {
                return API.kodiRequest('Playlist.Remove', { playlistid: playlistid, position: position });
            }
            PlayList.removeAt = removeAt;
            function swap(playlistid, position, position2) {
                return API.kodiRequest('Playlist.Swap', { playlistid: playlistid, position1: position, position2: position2 });
            }
            PlayList.swap = swap;
            function insertSong(playlistid, position, songId) {
                return API.kodiRequest('Playlist.Insert', { playlistid: playlistid, position: position, item: { songid: songId } });
            }
            PlayList.insertSong = insertSong;
        })(PlayList = API.PlayList || (API.PlayList = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Files;
        (function (Files) {
            function getPicturesDirectory(directory) {
                return API.kodiRequest('Files.GetDirectory', { directory: directory, media: 'pictures', properties: ["title", "file", "thumbnail"] }, false, true);
            }
            Files.getPicturesDirectory = getPicturesDirectory;
            function getPicturesSources() {
                return API.kodiRequest('Files.GetSources', { media: 'pictures' }, false, true);
            }
            Files.getPicturesSources = getPicturesSources;
            function download(path) {
                return API.kodiRequest('Files.PrepareDownload', { path: path });
            }
            Files.download = download;
            function getDirectory(media, directory) {
                return API.kodiRequest('Files.GetDirectory', { directory: directory, media: media, properties: ["title", "file", "thumbnail"] }, false, true);
            }
            Files.getDirectory = getDirectory;
            function getSources(media) {
                return API.kodiRequest('Files.GetSources', { media: media }, false, true);
            }
            Files.getSources = getSources;
        })(Files = API.Files || (API.Files = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var System;
        (function (System) {
            function shutdown() {
                return API.kodiRequest('System.Shutdown', {});
            }
            System.shutdown = shutdown;
            function hibernate() {
                return API.kodiRequest('System.Hibernate', {});
            }
            System.hibernate = hibernate;
            function reboot() {
                return API.kodiRequest('System.Reboot', {});
            }
            System.reboot = reboot;
            function properties() {
                return API.kodiRequest('System.GetProperties', { properties: ["canreboot", "cansuspend", "canhibernate", "canshutdown"] }, false, true);
            }
            System.properties = properties;
        })(System = API.System || (API.System = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Videos;
        (function (Videos) {
            var TVShows;
            (function (TVShows) {
                function TVShowOptions(detailed) {
                    var res;
                    if (detailed) {
                        res = {
                            "properties": [
                                "title", "genre", "year", "rating", "plot", "studio", "mpaa", "cast", "playcount",
                                "episode", "imdbnumber", "premiered", "votes", "lastplayed", "fanart", "thumbnail",
                                "file", "originaltitle", "sorttitle", "episodeguide"
                            ]
                        };
                        if (API.version && API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                    else {
                        res = { "properties": ["thumbnail", "fanart", "title", "originaltitle", "genre", "year"], "sort": { "method": "label", "order": "ascending" } };
                        if (API.version && API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                }
                TVShows.TVShowOptions = TVShowOptions;
                function TVShowSeasonOptions(detailed) {
                    return {
                        "properties": [
                            "season", "showtitle", "playcount", "episode", "fanart", "thumbnail", "tvshowid"
                        ], "sort": { "method": "label", "order": "ascending" }
                    };
                }
                TVShows.TVShowSeasonOptions = TVShowSeasonOptions;
                function TVShowEpisodeOptions(detailed) {
                    if (detailed) {
                        return {
                            "properties": [
                                "title", "plot", "votes", "rating", "writer", "firstaired", "playcount", "runtime",
                                "director", "productioncode", "season", "episode", "originaltitle", "showtitle", "cast",
                                "streamdetails", "lastplayed", "fanart", "thumbnail", "file", "resume", "tvshowid"
                            ]
                        };
                    }
                    else {
                        return { "properties": ["thumbnail", "fanart", "tvshowid", "season", "title", "originaltitle", "showtitle", "episode", "plot"], "sort": { "method": "label", "order": "ascending" } };
                    }
                }
                TVShows.TVShowEpisodeOptions = TVShowEpisodeOptions;
                function processTVShows(tvshowset, tvshowitemcallback) {
                    if (tvshowset && tvshowset.tvshows && tvshowset.tvshows.length) {
                        tvshowset.tvshows.forEach(function (tvshow) {
                            if (tvshow.genre) {
                                var albtype = typeof tvshow.genre;
                                if (albtype === 'object') {
                                    tvshow.allgenres = tvshow.genre;
                                    tvshow.genre = tvshow.allgenres.join(', ');
                                }
                            }
                            if (tvshowitemcallback)
                                tvshowitemcallback(tvshow);
                        });
                    }
                }
                TVShows.processTVShows = processTVShows;
                function getAllTVShows() {
                    var data = TVShowOptions(true);
                    return API.kodiRequest('VideoLibrary.GetTVShows', data, false, true).then(function (tvshows) {
                        processTVShows(tvshows);
                        return WinJS.Promise.wrap(tvshows);
                    });
                }
                TVShows.getAllTVShows = getAllTVShows;
                function getTVShowsGenres() {
                    return API.kodiRequest('VideoLibrary.GetGenres', { type: "tvshow", "sort": { "method": "label", "order": "ascending" } }, false, true);
                }
                TVShows.getTVShowsGenres = getTVShowsGenres;
                function getRecentEpisodes() {
                    var data = TVShowEpisodeOptions(true);
                    return API.kodiRequest('VideoLibrary.GetRecentlyAddedEpisodes', data, false, true);
                }
                TVShows.getRecentEpisodes = getRecentEpisodes;
                function getTVShowDetails(tvshowid) {
                    var data = TVShowOptions(true);
                    data.tvshowid = tvshowid;
                    return API.kodiRequest('VideoLibrary.GetTVShowDetails', data);
                }
                TVShows.getTVShowDetails = getTVShowDetails;
                function getTVShowSeasons(tvshowid) {
                    var data = TVShowSeasonOptions(true);
                    data.tvshowid = tvshowid;
                    return API.kodiRequest('VideoLibrary.GetSeasons', data);
                }
                TVShows.getTVShowSeasons = getTVShowSeasons;
                function getTVShowEpisodes(tvshowid, seasonid) {
                    var data = TVShowEpisodeOptions(true);
                    data.tvshowid = tvshowid;
                    data.season = seasonid;
                    return API.kodiRequest('VideoLibrary.GetEpisodes', data);
                }
                TVShows.getTVShowEpisodes = getTVShowEpisodes;
                function getTVShowEpisodeDetails(episodeid) {
                    return API.kodiRequest('VideoLibrary.GetEpisodes', { episodeid: episodeid });
                }
                TVShows.getTVShowEpisodeDetails = getTVShowEpisodeDetails;
                function playEpisode(episodeid, resume) {
                    var data = { "item": { "episodeid": episodeid } };
                    if (resume) {
                        data.options = { resume: true };
                    }
                    return API.kodiRequest('Player.Open', data, true);
                }
                TVShows.playEpisode = playEpisode;
                function queueEpisode(episodeid) {
                    return API.kodiRequest('Playlist.Add', { "playlistid": 0, "item": { "episodeid": episodeid } }, true);
                }
                TVShows.queueEpisode = queueEpisode;
                function scan() {
                    return API.kodiRequest('VideoLibrary.Scan', {});
                }
                TVShows.scan = scan;
            })(TVShows = Videos.TVShows || (Videos.TVShows = {}));
        })(Videos = API.Videos || (API.Videos = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Videos;
        (function (Videos) {
            var Movies;
            (function (Movies) {
                function MovieOptions(detailed) {
                    if (typeof detailed === "undefined") {
                        detailed = false;
                    }
                    var res;
                    if (detailed) {
                        res = {
                            "properties": [
                                "title", "genre", "year", "rating", "director", "trailer", "tagline", "plot", "plotoutline",
                                "originaltitle", "lastplayed", "playcount", "writer", "studio", "mpaa", "cast", "country",
                                "set", "showlink", "streamdetails", "dateadded", "runtime",
                                "votes", "fanart", "thumbnail", "file", "sorttitle", "resume", "setid"
                            ],
                            "sort": { "method": "label", "order": "ascending" }
                        };
                        if (API.version && API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                    else {
                        res = {
                            "properties": ["thumbnail", "fanart", "title", "originaltitle", "genre", "director", "year", "rating", "lastplayed"],
                            "sort": { "method": "label", "order": "ascending" }
                        };
                        if (Kodi.API.version && Kodi.API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                }
                Movies.MovieOptions = MovieOptions;
                function MovieSetOptions(detailed) {
                    if (typeof detailed === "undefined") {
                        detailed = false;
                    }
                    return {
                        "properties": [
                            "title", "playcount", "fanart", "thumbnail"
                        ], "sort": { "method": "label", "order": "ascending" }
                    };
                }
                Movies.MovieSetOptions = MovieSetOptions;
                function processMovies(movieset, movieItemCallback) {
                    if (movieset && movieset.movies && movieset.movies.length) {
                        movieset.movies.forEach(function (movie) {
                            if (movie.genre) {
                                var albtype = typeof movie.genre;
                                if (albtype === 'object') {
                                    movie.allgenres = movie.genre;
                                    movie.genre = movie.allgenres.join(', ');
                                }
                            }
                            //movie.reducedtitle = MCNEXT.Utils.reduceStringForSearch(movie.label);
                            //movie.reducedgenre = MCNEXT.Utils.reduceStringForSearch(movie.genre);
                            if (movieItemCallback)
                                movieItemCallback(movie);
                        });
                    }
                }
                Movies.processMovies = processMovies;
                function getMovieGenres() {
                    return API.kodiRequest('VideoLibrary.GetGenres', { type: "movie", "sort": { "method": "label", "order": "ascending" } }, false, true);
                }
                Movies.getMovieGenres = getMovieGenres;
                function getAllMovies() {
                    var data = MovieOptions(true);
                    return API.kodiRequest('VideoLibrary.GetMovies', data, false, true).then(function (movies) {
                        processMovies(movies);
                        return WinJS.Promise.wrap(movies);
                    });
                }
                Movies.getAllMovies = getAllMovies;
                function getAllMovieSets() {
                    var data = MovieSetOptions();
                    return API.kodiRequest('VideoLibrary.GetMovieSets', data, false, true);
                }
                Movies.getAllMovieSets = getAllMovieSets;
                function getMovieDetails(movieid) {
                    var data = MovieOptions(true);
                    delete data.sort;
                    data.movieid = movieid;
                    return API.kodiRequest('VideoLibrary.GetMovieDetails', data);
                }
                Movies.getMovieDetails = getMovieDetails;
                function getRecentMovies() {
                    var data = MovieOptions(true);
                    return API.kodiRequest('VideoLibrary.GetRecentlyAddedMovies', data, false, true);
                }
                Movies.getRecentMovies = getRecentMovies;
                function playMovie(movieid, resume) {
                    var data = { "item": { "movieid": movieid } };
                    if (resume) {
                        data.options = { resume: true };
                    }
                    return API.kodiRequest('Player.Open', data, true);
                }
                Movies.playMovie = playMovie;
                function scan() {
                    return API.kodiRequest('VideoLibrary.Scan', {});
                }
                Movies.scan = scan;
                function clean() {
                    return API.kodiRequest('VideoLibrary.Clean', {});
                }
                Movies.clean = clean;
            })(Movies = Videos.Movies || (Videos.Movies = {}));
        })(Videos = API.Videos || (API.Videos = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Websocket;
        (function (Websocket) {
            Websocket.current;
            function socketOpen(evt) {
                console.log('socket opened');
            }
            function socketClosed(evt) {
                Websocket.current = undefined;
                console.log('socket closed');
            }
            function socketMessage(evt) {
                var data = evt.data ? JSON.parse(evt.data) : undefined;
                console.info(evt.data);
                if (data.method) {
                    WinJS.Application.queueEvent({ type: data.method, data: data });
                }
            }
            function socketError(evt) {
                console.log(evt.type);
            }
            function register() {
                Websocket.current.onopen = socketOpen;
                Websocket.current.onclose = socketClosed;
                Websocket.current.onmessage = socketMessage;
                Websocket.current.onerror = socketError;
            }
            function init(setting) {
                Websocket.current = new WebSocket('ws://' + setting.host + ':9090/jsonrpc');
                register();
            }
            Websocket.init = init;
            function close() {
                if (isReady()) {
                    Websocket.current.close();
                }
                Websocket.current = undefined;
            }
            Websocket.close = close;
            function isReady() {
                return Websocket.current && Websocket.current.OPEN === 1;
            }
            Websocket.isReady = isReady;
            function sendData(data, forceCheck, ignoreXBMCErrors) {
                if (!isReady())
                    return WinJS.Promise.wrapError({ message: 'websocket not ready' });
                return new WinJS.Promise(function (complete, error) {
                    Websocket.current.onmessage = function (evt) {
                        complete(evt.data);
                        register();
                        if (forceCheck)
                            WinJS.Application.queueEvent({ type: 'xbmcplayercheck' });
                    };
                    Websocket.current.onerror = function (evt) {
                        if (ignoreXBMCErrors)
                            complete();
                        else
                            error(evt.message);
                        register();
                    };
                    var pushdata = JSON.stringify(data);
                    Websocket.current.send(pushdata);
                });
            }
            Websocket.sendData = sendData;
        })(Websocket = API.Websocket || (API.Websocket = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var App;
    (function (App) {
        App.DefaultGridLayout = {
            horizontal: { query: '(orientation: landscape)', layout: 'horizontal' },
            vertical: { query: '(orientation: portrait)', layout: 'vertical' },
            snapped: { query: '(orientation: portrait) and (max-width: 340px)', layout: 'vertical' }
        };
        App.DefaultListLayout = {
            hor: { query: '(orientation: landscape)', layout: WinJS.UI.GridLayout, options: { orientation: 'horizontal', groupHeaderPosition: 'left' } },
            vert: { query: '(orientation: portrait)', layout: WinJS.UI.GridLayout, options: { orientation: 'vertical', groupHeaderPosition: 'top' } }
        };
        App.PictureRatios = {
            fanart: 1.7778,
            movieposter: 0.6667,
            tvshowepisode: 1.7778,
            album: 1.1,
            actor: 0.6667,
        };
        function playLocalMedia(kodipath) {
            return new WinJS.Promise(function (complete, error) {
                var path = Kodi.Utils.getNetworkPath(kodipath);
                var uri = new Windows.Foundation.Uri(path);
                var opt = new Windows.System.LauncherOptions();
                opt.desiredRemainingView = (Windows.UI.ViewManagement).ViewSizePreference.useNone;
                Windows.System.Launcher.launchUriAsync(uri, opt).done(function (a) {
                    if (a == true) {
                        complete();
                    }
                    else {
                        error();
                        WinJSContrib.Alerts.message('unable to play media', 'cannot play this media. Check the network path you set in your Kodi/XBMC (due to Windows constraints, path with server IP will not work, use server name instead within your media server)');
                    }
                }, error);
            });
        }
        App.playLocalMedia = playLocalMedia;
    })(App = Kodi.App || (Kodi.App = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var Data;
    (function (Data) {
        var pictureslimit = 15;
        var invalidatedcache = false;
        var _invalidateAndRefresh = function () {
            invalidatedcache = true;
            loadRootData(true);
        };
        var _invalidate = function () {
            invalidatedcache = true;
        };
        WinJS.Application.addEventListener("VideoLibrary.OnScanFinished", _invalidateAndRefresh);
        WinJS.Application.addEventListener("VideoLibrary.OnCleanFinished", _invalidateAndRefresh);
        WinJS.Application.addEventListener("MusicLibrary.OnScanFinished", _invalidateAndRefresh);
        WinJS.Application.addEventListener("MusicLibrary.OnCleanFinished", _invalidateAndRefresh);
        WinJS.Application.addEventListener("VideoLibrary.OnUpdate", _invalidate);
        WinJS.Application.addEventListener("VideoLibrary.OnRemove", _invalidate);
        WinJS.Application.addEventListener("MusicLibrary.OnUpdate", _invalidate);
        WinJS.Application.addEventListener("MusicLibrary.OnRemove", _invalidate);
        Data.SearchDefinitions = {
            movies: { fields: { "label": 10, "genre": 1 } },
            music: { fields: { "label": 10, "artist": 2, "genre": 1 } },
            artists: { fields: { "label": 10 } },
            tvshows: { fields: { "label": 10 } }
        };
        var searchIndex = null;
        var library;
        var searchResults = {};
        function activeAllMenus() {
            $('#menumovies, #menumusic, #menuartists, #menutvshow, #menupictures').show();
        }
        function DistinctArray(array, ignorecase) {
            if (typeof ignorecase == "undefined" || array == null || array.length == 0)
                return null;
            if (typeof ignorecase == "undefined")
                ignorecase = false;
            var sMatchedItems = "";
            var foundCounter = 0;
            var newArray = [];
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                var sFind = ignorecase ? item.toLowerCase() : item;
                if (sMatchedItems.indexOf("|" + sFind + "|") < 0) {
                    sMatchedItems += "|" + sFind + "|";
                    newArray[foundCounter++] = array[i];
                }
            }
            return newArray;
        }
        function musicDataCalls() {
            return [
                Kodi.API.Music.getAllAlbums(),
                Kodi.API.Music.getGenres(),
                Kodi.API.Music.getRecentAlbums(),
                Kodi.API.Files.getSources('music')
            ];
        }
        function videoDataCalls() {
            return [
                Kodi.API.Videos.Movies.getAllMovies(),
                Kodi.API.Videos.TVShows.getAllTVShows(),
                Kodi.API.Videos.Movies.getMovieGenres(),
                Kodi.API.Videos.TVShows.getTVShowsGenres(),
                Kodi.API.Videos.Movies.getRecentMovies(),
                Kodi.API.Videos.TVShows.getRecentEpisodes(),
                Kodi.API.Videos.Movies.getAllMovieSets(),
                Kodi.API.Files.getSources('video')
            ];
        }
        function rootDataCalls() {
            return [
                WinJS.Promise.join(musicDataCalls()),
                WinJS.Promise.join(videoDataCalls()),
                Kodi.API.Files.getPicturesSources(),
                Kodi.API.Profiles.getProfiles()
            ];
        }
        function buildMusicLibrary(library, data, searchIndex) {
            var artists = [];
            var allAlbums = data[0];
            if (allAlbums && allAlbums.albums && allAlbums.albums.length) {
                var tmp = [];
                allAlbums.albums.forEach(function (album) {
                    if (album.artist && album.artist.length)
                        tmp.push(album.artist);
                });
                tmp = DistinctArray(tmp, true);
                tmp = tmp.sort();
                tmp.forEach(function (artist) {
                    artists.push({ label: artist });
                });
                if (searchIndex) {
                    searchIndex.indexes.music.addRange(allAlbums.albums);
                    searchIndex.indexes.artists.addRange(artists);
                }
            }
            var pics = [];
            function selectAlbumPictures(album) {
                if (pics.length > pictureslimit)
                    return;
                if (album.thumbnail) {
                    pics.push(Kodi.API.kodiThumbnail(album.thumbnail));
                }
            }
            if (data[2] && data[2].albums) {
                var picsAlbums = data[2].albums.forEach(selectAlbumPictures);
            }
            if (pics.length < pictureslimit && data[0] && data[0].albums) {
                data[0].albums.forEach(selectAlbumPictures);
            }
            library.musicPictures = pics;
            library.artists = artists;
            library.music = data[0];
            library.musicGenres = data[1];
            library.recentMusic = data[2];
            library.musicSources = data[3];
            library.hasAlbums = (library.music && library.music.albums && library.music.albums.length > 0);
            library.hasMusic = library.hasAlbums || (library.musicSources && library.musicSources.sources && library.musicSources.sources.length > 0);
            library.hasRecentMusic = (library.recentMusic && library.recentMusic.albums && library.recentMusic.albums.length);
            if (library.hasRecentMusic) {
                library.recentMusic.albums.sort(function (a, b) {
                    return b.albumid - a.albumid;
                });
            }
        }
        function buildVideoLibrary(library, data, searchIndex) {
            var pics = [];
            function selectMoviePictures(movie) {
                if (pics.length > pictureslimit)
                    return;
                if (movie.art && movie.art.poster) {
                    pics.push(Kodi.API.kodiThumbnail(movie.art.poster));
                }
                else if (movie.thumbnail) {
                    pics.push(Kodi.API.kodiThumbnail(movie.thumbnail));
                }
            }
            if (data[4] && data[4].movies) {
                var picsAlbums = data[4].movies.forEach(selectMoviePictures);
            }
            if (pics.length < pictureslimit && data[0] && data[0].movies) {
                data[0].movies.forEach(selectMoviePictures);
            }
            if (data[0] && data[0].movies && searchIndex) {
                searchIndex.indexes.movies.addRange(data[0].movies);
            }
            if (data[1] && data[1].tvshows && searchIndex) {
                searchIndex.indexes.tvshows.addRange(data[1].tvshows);
            }
            library.moviesPictures = pics;
            library.movies = data[0];
            library.movieGenres = data[2];
            library.recentMovies = data[4];
            library.tvshows = data[1];
            library.tvshowGenres = data[3];
            library.tvshowRecentEpisodes = data[5];
            library.videoSources = data[7];
            library.hasVideos = (library.videoSources && library.videoSources.sources && library.videoSources.sources.length > 0);
            library.hasMovies = (library.movies && library.movies.movies && library.movies.movies.length > 0);
            library.hasRecentMovies = (library.recentMovies && library.recentMovies.movies && library.recentMovies.movies.length > 0);
            library.hasTvshows = (library.tvshows && library.tvshows.tvshows && library.tvshows.tvshows.length > 0);
            library.hasRecentTvshows = (library.tvshowRecentEpisodes && library.tvshowRecentEpisodes.episodes && library.tvshowRecentEpisodes.episodes.length > 0);
            if (library.hasRecentMovies) {
                library.recentMovies.movies.sort(function (a, b) {
                    return b.movieid - a.movieid;
                });
            }
            if (library.hasRecentTvshows) {
                library.tvshowRecentEpisodes.episodes.sort(function (a, b) {
                    return b.episodeid - a.episodeid;
                });
            }
            pics = [];
            function selectTVShowEpisodePictures(movie) {
                if (pics.length > pictureslimit)
                    return;
                if (movie.thumbnail) {
                    pics.push(Kodi.API.kodiThumbnail(movie.thumbnail));
                }
            }
            function selectTVShowPictures(movie) {
                if (pics.length > pictureslimit)
                    return;
                if (movie.art && movie.art.poster) {
                    pics.push(Kodi.API.kodiThumbnail(movie.art.poster));
                }
            }
            if (data[1] && data[1].tvshows) {
                data[1].tvshows.forEach(selectTVShowPictures);
            }
            if (pics.length < pictureslimit && data[5] && data[5].episodes) {
                var picsAlbums = data[5].episodes.forEach(selectTVShowEpisodePictures);
            }
            library.tvshowsPictures = pics;
            library.moviesets = data[6];
        }
        function buildLibrary(data) {
            var tmplibrary = {};
            if (searchIndex)
                searchIndex.dispose();
            searchIndex = new WinJSContrib.Search.IndexGroup(Data.SearchDefinitions);
            buildMusicLibrary(tmplibrary, data[0], searchIndex);
            buildVideoLibrary(tmplibrary, data[1], searchIndex);
            tmplibrary.pictures = data[2];
            tmplibrary.profiles = (data[3] ? data[3].profiles : []);
            tmplibrary.currentprofile = null;
            if (tmplibrary.profiles.length) {
                Kodi.API.Profiles.getCurrentProfile().done(function (profile) {
                    if (profile)
                        tmplibrary.currentprofile = profile.label;
                });
            }
            library = tmplibrary;
            searchIndex.save();
        }
        function showHideMenus() {
            if (!library.movies || !library.movies.movies || !library.movies.movies.length) {
                $(' #menumovies').hide();
            }
            if (!library.music || !library.music.albums || !library.music.albums.length) {
                $('#menumusic, #menuartists').hide();
            }
            if (!library.tvshows || !library.tvshows.tvshows || !library.tvshows.tvshows.length) {
                $('#menutvshows').hide();
            }
            if (!library.pictures || !library.pictures.sources || !library.pictures.sources.length) {
                $('#menupictures').hide();
            }
        }
        function checkConnectivity() {
            if (!Kodi.API.currentSettings || !Kodi.API.currentSettings.host) {
                Kodi.API.currentSettings = Kodi.Settings.load();
                Kodi.API.Websocket.close();
            }
            return Kodi.API.properties();
        }
        Data.checkConnectivity = checkConnectivity;
        function loadRootData(forceLoad) {
            if (!Kodi.API.currentSettings || !Kodi.API.currentSettings.host) {
                Kodi.API.currentSettings = Kodi.Settings.load();
                Kodi.API.Websocket.close();
            }
            if (!invalidatedcache && !forceLoad && library) {
                var cachedprom = WinJS.Promise.wrap(library);
                return cachedprom;
            }
            invalidatedcache = false;
            var prom = new WinJS.Promise(function (complete, error) {
                Kodi.API.properties().done(function (sysprops) {
                    if (sysprops) {
                        Kodi.NowPlaying.current.volume = sysprops.volume;
                        Kodi.NowPlaying.current.muted = sysprops.muted;
                        Kodi.API.version = sysprops.version;
                    }
                    searchResults = {};
                    WinJS.Promise.join(rootDataCalls()).done(function (data) {
                        activeAllMenus();
                        buildLibrary(data);
                        showHideMenus();
                        WinJS.Application.queueEvent({ type: 'appdata.changed', catalog: library });
                        complete(library);
                    }, function (err) {
                        error(err);
                    });
                }, function (err) {
                    error(err);
                });
            });
            return prom;
        }
        Data.loadRootData = loadRootData;
        function checkSystemProperties() {
            Kodi.API.properties().done(function (sysprops) {
                Kodi.NowPlaying.current.volume = sysprops.volume;
                Kodi.NowPlaying.current.muted = sysprops.muted;
            });
        }
        Data.checkSystemProperties = checkSystemProperties;
        function search(queryText) {
            return new WinJS.Promise(function (complete, error) {
                if (!searchIndex) {
                    error();
                    return;
                }
                var res = searchIndex.search(queryText);
                complete(res);
            });
        }
        Data.search = search;
        function hasGenre(obj, queryText) {
            if (!obj || !obj.genre)
                return;
            if (typeof obj.genre !== 'string') {
                if (obj.genre.forEach) {
                    for (var i = 0; i < obj.genre.length; i++) {
                        if (obj.genre[i].toLowerCase().indexOf(queryText) >= 0)
                            return true;
                    }
                }
            }
            else {
                if (obj.genre.toLowerCase().indexOf(queryText) >= 0)
                    return true;
            }
            return false;
        }
        function scanMovies() {
            var text = "Your media center will scan the library for new movies. Unfortunately, you won't get notified in this app when the task is over (upgrade to XBMC 12 to get this feature). \r\n\r\nDo you want to proceed ?";
            if (Kodi.API.Websocket.isReady()) {
                text = "Your media center will scan the library for new movies. \r\n\r\nDo you want to proceed ?";
            }
            WinJSContrib.Alerts.messageBox({ content: text, title: 'Scan video library', commands: [{ label: 'Yes' }, { label: 'No' }] }).done(function (c) {
                if (c.label == 'Yes')
                    Kodi.API.Videos.Movies.scan();
            });
        }
        Data.scanMovies = scanMovies;
        function scanTvshows() {
            var text = "Your media center will scan the library for new tvshows. Unfortunately, you won't get notified in this app when the task is over (upgrade to XBMC 12 to get this feature). \r\n\r\nDo you want to proceed ?";
            if (Kodi.API.Websocket.isReady()) {
                text = "Your media center will scan the library for new tvshows.\r\n\r\nDo you want to proceed ?";
            }
            WinJSContrib.Alerts.messageBox({ content: text, title: 'Scan library', commands: [{ label: 'Yes' }, { label: 'No' }] }).done(function (c) {
                if (c.label == 'Yes')
                    Kodi.API.Videos.Movies.scan();
            });
        }
        Data.scanTvshows = scanTvshows;
        function scanAlbums() {
            var text = "Your media center will scan the library for new albums. Unfortunately, you won't get notified in this app when the task is over (upgrade to XBMC 12 to get this feature). \r\n\r\nDo you want to proceed ?";
            if (Kodi.API.Websocket.isReady()) {
                text = "Your media center will scan the library for new albums.\r\n\r\nDo you want to proceed ?";
            }
            WinJSContrib.Alerts.messageBox({ content: text, title: 'Scan library', commands: [{ label: 'Yes' }, { label: 'No' }] }).done(function (c) {
                if (c.label == 'Yes')
                    Kodi.API.Music.scan();
            });
        }
        Data.scanAlbums = scanAlbums;
        WinJS.Application.addEventListener('VideoLibrary.OnScanFinished', function (arg) {
            WinJS.Promise.join(videoDataCalls()).done(function (data) {
                buildVideoLibrary(library, data);
                showHideMenus();
                WinJSContrib.Alerts.toast('video library scan is finished');
                WinJS.Application.queueEvent({ type: 'VideoLibraryUpdate', library: library });
            });
        });
        WinJS.Application.addEventListener('AudioLibrary.OnScanFinished', function (arg) {
            WinJS.Promise.join(musicDataCalls()).done(function (data) {
                buildMusicLibrary(library, data);
                showHideMenus();
                WinJSContrib.Alerts.toast('audio library scan is finished');
                WinJS.Application.queueEvent({ type: 'AudioLibraryUpdate', library: library });
            });
        });
    })(Data = Kodi.Data || (Kodi.Data = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var NowPlaying;
    (function (NowPlaying) {
        var ObservablePlaying = WinJS.Binding.define({
            id: null, position: 0, progress: 0, enabled: 0, speed: 0, label: '', time: '', totaltime: '', type: null,
            thumbnail: undefined, playerid: null, playlistid: null, volume: 0, muted: false, reachable: 0,
            subtitleenabled: false, currentsubtitle: null, currentaudiostream: null, expanded: false,
            checking: false, hasLanguages: false, hasSubtitles: false, hasLanguagesOrSubtitles: false,
            isPlaying: false, isPlayingMusic: false, isPlayingVideo: false, isPlayingTvShow: false, isPlayingMovie: false
        });
        NowPlaying.current = new ObservablePlaying();
        NowPlaying.intervaldelay = 10000;
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
                nowPlayingInterval = setInterval(check, NowPlaying.intervaldelay);
                check(true);
            }, 500);
        });
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
                Kodi.API.properties().then(function (p) {
                    NowPlaying.current.muted = p.muted;
                    NowPlaying.current.volume = p.volume;
                }, function () {
                });
                Kodi.API.Player.currentItem(undefined).done(function (currentItem) {
                    if (Kodi.API.Player.currentPlayer) {
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
                    }
                    else {
                        NowPlaying.current.playerid = null;
                        complete(NowPlaying.current);
                    }
                }, function (err) {
                    checkError(err);
                    complete(NowPlaying.current);
                });
                if (nowPlayingInterval)
                    clearInterval(nowPlayingInterval);
                nowPlayingInterval = setInterval(check, NowPlaying.intervaldelay);
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
            NowPlaying.current.isPlaying = NowPlaying.current.isPlayingVideo || NowPlaying.current.isPlayingMusic || item.type == 'unknown';
            NowPlaying.current.subtitles = properties.subtitles;
            if (idChanged || !NowPlaying.current.currentsubtitle || (NowPlaying.current.currentsubtitle && properties.currentsubtitle && NowPlaying.current.currentsubtitle.index != properties.currentsubtitle.index))
                NowPlaying.current.currentsubtitle = properties.currentsubtitle;
            NowPlaying.current.audiostreams = properties.audiostreams;
            if (idChanged || !NowPlaying.current.currentaudiostream || (NowPlaying.current.currentaudiostream && properties.currentaudiostream && NowPlaying.current.currentaudiostream.index != properties.currentaudiostream.index))
                NowPlaying.current.currentaudiostream = properties.currentaudiostream;
            NowPlaying.current.subtitleenabled = properties.subtitleenabled;
            NowPlaying.current.hasLanguages = properties.audiostreams && properties.audiostreams.length > 1;
            NowPlaying.current.hasSubtitles = properties.subtitles && properties.subtitles.length > 0;
            NowPlaying.current.hasLanguagesOrSubtitles = NowPlaying.current.hasLanguages || NowPlaying.current.hasSubtitles;
            if (properties.percentage < 0) {
                NowPlaying.current.progress = 0;
            }
            else {
                if (properties.percentage > 100)
                    NowPlaying.current.progress = 100;
                else if (properties.percentage < 0)
                    NowPlaying.current.progress = 0;
                else
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
                if (!NowPlaying.current.enabled) {
                    NowPlaying.current.enabled = true;
                }
            }
        }
        var nowPlayingInterval;
        function init() {
            if (nowPlayingInterval)
                clearInterval(nowPlayingInterval);
            NowPlaying.current.enabled = false;
            NowPlaying.current.reachable = false;
            nowPlayingInterval = setInterval(check, NowPlaying.intervaldelay);
            check();
        }
        NowPlaying.init = init;
    })(NowPlaying = Kodi.NowPlaying || (Kodi.NowPlaying = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var Settings;
    (function (Settings) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var kodiServers = 'kodiAPISettings';
        var currentSettings;
        function saveSetting(name, settings) {
            applicationData.roamingSettings.values[name] = JSON.stringify(settings);
        }
        function loadSetting(name) {
            var content = applicationData.roamingSettings.values[name];
            if (!content)
                return;
            return JSON.parse(content);
        }
        function read(name) {
            return currentSettings.servers[name];
        }
        currentSettings = loadSetting(kodiServers);
        if (!currentSettings)
            currentSettings = {
                defaultSetting: 'Default',
                servers: {
                    Default: {
                        name: 'Default',
                        host: '',
                        port: 80,
                        user: 'kodi',
                        password: '',
                        macAddress: []
                    }
                }
            };
        function save(initialName, setting, setDefault) {
            if (initialName !== setting.name) {
                delete currentSettings.servers[initialName];
                if (currentSettings.defaultSetting === initialName)
                    currentSettings.defaultSetting = setting.name;
            }
            if (setDefault) {
                currentSettings.defaultSetting = setting.name;
            }
            currentSettings.servers[setting.name] = setting;
            saveSetting(kodiServers, currentSettings);
        }
        Settings.save = save;
        function remove(name) {
            delete currentSettings.servers[name];
            saveSetting(kodiServers, currentSettings);
        }
        Settings.remove = remove;
        function getSetting(name) {
            return currentSettings.servers[name];
        }
        Settings.getSetting = getSetting;
        function load() {
            var defaultsetting = currentSettings.servers[currentSettings.defaultSetting];
            if (!defaultsetting)
                defaultsetting = {
                    name: currentSettings.defaultSetting,
                    host: '',
                    port: '',
                    user: '',
                    password: '',
                    macAddress: []
                };
            return defaultsetting;
        }
        Settings.load = load;
        function defaultConnection() {
            return currentSettings.defaultSetting;
        }
        Settings.defaultConnection = defaultConnection;
        function list() {
            var res = [];
            for (var key in currentSettings.servers) {
                if (currentSettings.servers.hasOwnProperty(key)) {
                    res.push(key);
                }
            }
            return res;
        }
        Settings.list = list;
    })(Settings = Kodi.Settings || (Kodi.Settings = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var Utils;
    (function (Utils) {
        function bgImage(source, sourceProperty, dest, destProperty, defaultImage) {
            function setImage(url, img) {
                dest.style.visibility = '';
                WinJS.Utilities.addClass(dest, 'imageLoaded');
                if (dest.nodeName === "IMG") {
                    dest.src = url;
                    dest.style.width = "";
                    if (img && img.element) {
                        var ratio = img.element.naturalWidth / img.element.naturalHeight;
                        var w = dest.clientHeight * ratio;
                        dest.style.width = w + "px";
                    }
                }
                else {
                    dest.style.backgroundImage = 'url("' + url + '")';
                }
            }
            function setBg() {
                dest.style.visibility = 'hidden';
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                WinJS.Utilities.removeClass(dest, 'imageLoaded');
                if (!data || !data.length) {
                    if (defaultImage) {
                        setImage(defaultImage);
                        dest.style.backgroundSize = 'contain';
                    }
                    return;
                }
                if (data === 'DefaultAlbumCover.png') {
                    //setImage("/images/cd.png");
                    return;
                }
                var imgUrl = Kodi.API.kodiThumbnail(data);
                setTimeout(function () {
                    WinJSContrib.UI.loadImage(imgUrl).done(function (img) {
                        setImage(imgUrl, img);
                    }, function () {
                        if (defaultImage) {
                            setImage(defaultImage);
                        }
                    });
                }, 250);
            }
            var bindingDesc = {};
            bindingDesc[sourceProperty] = setBg;
            return WinJS.Binding.bind(source, bindingDesc);
        }
        function imageUrl(source, sourceProperty, dest, destProperty, defaultImage) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            var imgUrl = defaultImage;
            if (!data || !data.length) {
                if (!imgUrl)
                    return;
            }
            else {
                imgUrl = Kodi.API.kodiThumbnail(data);
            }
            return WinJS.Binding.oneTime({ url: imgUrl }, ['url'], dest, [destProperty]);
        }
        function formatPlayerTime(props, data) {
            var res = [];
            if (data.hours || props.type === 'video')
                res.push(WinJSContrib.Utils.pad2(data.hours | 0) + ':');
            res.push(WinJSContrib.Utils.pad2(data.minutes | 0) + ':');
            res.push(WinJSContrib.Utils.pad2(data.seconds | 0));
            return res.join('');
        }
        Utils.formatPlayerTime = formatPlayerTime;
        Utils.toThumbnailBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, undefined);
        });
        Utils.toThumbnailAlbumBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, '/images/cd.png');
        });
        Utils.toThumbnailActorBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, '/images/artist.png');
        });
        Utils.toThumbnailImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, undefined);
        });
        Utils.toThumbnailAlbumImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, '/images/cd.png');
        });
        Utils.toThumbnailActorImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, '/images/artist.png');
        });
        Utils.toFormatedPlayerTime = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data)
                return;
            WinJS.Binding.oneTime({ time: Kodi.Utils.formatPlayerTime(source, data) }, ['time'], dest, [destProperty]);
        });
        Utils.toDuration = WinJS.Binding.initializer(function toDurationBinding(source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data)
                return;
            var totalseconds = parseInt(data);
            var hours = 0;
            var minutes = ((totalseconds / 60) >> 0);
            if (minutes > 60) {
                var hours = (minutes / 60) >> 0;
                minutes = minutes - (60 * hours);
            }
            var seconds = totalseconds - (minutes * 60);
            var d = (hours ? hours + "h" : "") + WinJSContrib.Utils.pad2(minutes) + 'min' + (!hours && seconds ? WinJSContrib.Utils.pad2(seconds) : "");
            WinJS.Binding.oneTime({ duration: d }, ['duration'], dest, [destProperty]);
        });
        Utils.rating = WinJS.Binding.initializer(function ratingBinding(source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data)
                return;
            dest.innerHTML = data.toFixed(1);
        });
        Utils.stringlist = WinJS.Binding.initializer(function stringlistBinding(source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data && !data.length)
                return;
            dest.innerText = data.join(', ');
        });
        Utils.showIfNetworkPath = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data || data.indexOf('\\\\') != 0) {
                dest.style.display = 'none';
            }
            else {
                dest.style.display = '';
            }
        });
        Utils.isCurrent = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            function setClass() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (data) {
                    WinJS.Utilities.addClass(dest, 'iscurrent');
                }
                else {
                    WinJS.Utilities.removeClass(dest, 'iscurrent');
                }
            }
            var bindingDesc = {};
            bindingDesc[sourceProperty] = setClass;
            return WinJS.Binding.bind(source, bindingDesc);
        });
        function getNetworkPath(mediapath) {
            if (!mediapath)
                return null;
            if (mediapath.indexOf('\\\\') == 0) {
                return mediapath;
            }
            else if (mediapath.indexOf('smb://') == 0) {
                var path = mediapath.substr(4, mediapath.length - 4);
                var pattern = "/", re = new RegExp(pattern, "g");
                path = path.replace(re, '\\');
                return path;
            }
            return null;
        }
        Utils.getNetworkPath = getNetworkPath;
    })(Utils = Kodi.Utils || (Kodi.Utils = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var WOL;
    (function (WOL) {
        function wakeUp(macAddress) {
            var host = '255.255.255.255';
            //host = '192.168.1.255';
            return WinJS.Promise.join([
                doWakeUp(host, '7', macAddress),
                doWakeUp(host, '9', macAddress)
            ]);
        }
        WOL.wakeUp = wakeUp;
        function doWakeUp(host, service, macAddress) {
            return new WinJS.Promise(function (complete, error) {
                var hostName;
                try {
                    hostName = new Windows.Networking.HostName(host);
                }
                catch (ex) {
                    error({ message: "Invalid host name." });
                    return;
                }
                var clientSocket = new Windows.Networking.Sockets.DatagramSocket();
                function onerror(err) {
                    try {
                        if (clientSocket)
                            clientSocket.close();
                    }
                    catch (ex) {
                    }
                    error(err);
                }
                var ep;
                clientSocket.getOutputStreamAsync(hostName, service).done(function (outputStream) {
                    //});
                    var bytes;
                    bytes = [255, 255, 255, 255, 255, 255];
                    for (var i = 0; i < 16; i++) {
                        for (var m = 0; m < macAddress.length; m++) {
                            bytes.push(macAddress[m]);
                        }
                    }
                    //clientSocket.connectAsync(hostName, service).done(function () {
                    //var clientDataWriter = new Windows.Storage.Streams.DataWriter(clientSocket.outputStream);
                    var clientDataWriter = new Windows.Storage.Streams.DataWriter(outputStream);
                    clientDataWriter.writeBytes(bytes);
                    clientDataWriter.storeAsync().done(function () {
                        clientDataWriter.close();
                        clientSocket.close();
                        complete();
                    }, onerror);
                }, onerror);
            });
        }
    })(WOL = Kodi.WOL || (Kodi.WOL = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=compiledfiles.js.map