module KodiPassion.UI {
    export declare var ReactPlayListControl: any;

    class PlayingContentControl {
        element: HTMLElement;
        currentContent: HTMLElement;
        eventTracker: WinJSContrib.UI.EventTracker;
        currentPlayerId: number;
        currentPlaylistId: number;
        currentType: string;

        constructor(element, options) {
            this.element = element || document.createElement('DIV');
            this.eventTracker = new WinJSContrib.UI.EventTracker();
            options = options || {};
            this.element.winControl = this;
            this.element.classList.add('playingcontent');
            this.element.classList.add('win-disposable');
            this.element.classList.add('mcn-layout-ctrl');
            WinJS.UI.setOptions(this, options);

            this.eventTracker.addBinding(Kodi.NowPlaying.current, "id", () => {
                this.setCurrentItem();
            });

            this.eventTracker.addEvent(window, "resize", () => {
                this.updateLayout();
            });
            this.manageSmallScreen();
            this.showEmpty();
        }

        manageSmallScreen() {
            var controls = document.querySelectorAll("#nowplayingcontent .menubar .menu");
            for (var i = 0, l = controls.length; i < l; i++) {
                this.manageSmallScreenMenu(<HTMLElement>controls[i]);
            }
        }

        manageSmallScreenMenu(menu: HTMLElement) {
            var targetid = menu.getAttribute("target");
            if (targetid) {
                var target = <HTMLElement>document.getElementById(targetid);
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
        }

        setCurrentItem() {
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

                this.closeCurrent().then(() => {
                    if (Kodi.NowPlaying.current.id != null && Kodi.NowPlaying.current.id != undefined) {
                        if (Kodi.NowPlaying.current.playlistid != null && Kodi.NowPlaying.current.playlistid != undefined) {
                            return Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then((playlist) => {
                                if (Kodi.NowPlaying.current.type === "song") {
                                    return this.showReactPlayList(playlist.items);
                                }
                                else if (playlist.items && playlist.items.length > 1) {
                                    return this.showPlayList(playlist.items);
                                } else if (Kodi.NowPlaying.current.type === "movie") {
                                    return this.showMovie();
                                } else if (Kodi.NowPlaying.current.type === "episode") {
                                    return this.showEpisode();
                                }
                                return this.showEmpty();

                            });
                        }
                    }
                    this.showEmpty();

                });
            }
        }

        showEmpty() {
            var p = WinJS.Promise.wrap();
            this.currentPlaylistId = null;
            this.currentPlayerId = null;
            this.currentType = null;

            if (this.currentContent && !this.currentContent.classList.contains("emptyplaying")) {
                p = this.closeCurrent();
            }

            p.then(() => {
                if (!this.currentContent || !this.currentContent.classList.contains("emptyplaying")) {


                    this.currentContent = document.createElement("DIV");

                    this.currentContent.classList.add("emptyplaying");
                    this.currentContent.innerHTML = '<div class="content"><img src="/images/logos/KodiPassion-notitle-white.svg"  draggable="false"/><div class="message">nothing is currently playing</div></div>';
                    this.element.appendChild(this.currentContent);
                }
            });
        }

        showMovie() {
            Kodi.Data.loadRootData().then((data) => {
                var movie = data.movies.movies.filter((m) => {
                    return m.movieid == Kodi.NowPlaying.current.id
                })[0];
                if (movie) {
                    this.currentContent = document.createElement("DIV");
                    this.element.appendChild(this.currentContent);

                    var page = new KodiPassion.UI.Pages.MovieDetail(this.currentContent, { movie: movie });
                }
            });
        }

        showEpisode() {
        }

        showReactPlayList(items) {
            var elt = document.createElement("DIV");
            this.element.appendChild(elt);
            var playlistctrl = new KodiPassion.UI.ReactPlayListControl(elt);
            this.currentContent = playlistctrl.element
            playlistctrl.items = items;
        }

        showPlayList(items) {
            var playlistctrl = new KodiPassion.UI.PlayListControl();
            this.currentContent = playlistctrl.element
            this.element.appendChild(this.currentContent);
            playlistctrl.items = items;
        }

        closeCurrent() {
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
        }

        updateLayout() {
            if (this.currentContent) {
                var control = this.currentContent.winControl;
                if (control) {
                    if (control.updateLayout) {
                        control.updateLayout();
                        var layoutcontrols = this.currentContent.querySelectorAll(".mcn-layout-ctrl");
                        for (var i = 0, l = layoutcontrols.length; i < l; i++) {
                            var ctrl = <HTMLElement>layoutcontrols[i];
                            if (ctrl.winControl && ctrl.winControl.updateLayout) {
                                ctrl.winControl.updateLayout();
                            }
                        }
                    }
                }
            }
        }

        dispose() {
            this.eventTracker.dispose();
        }
    }

    export var PlayingContent = WinJS.Class.mix(WinJS.Utilities.markSupportedForProcessing(PlayingContentControl), WinJS.Utilities.eventMixin,
        WinJS.Utilities.createEventProperties("myevent"));
}