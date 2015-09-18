module BtPo.UI {
    export class PlayListControl {
        public element: HTMLElement;
        eventTracker: WinJSContrib.UI.EventTracker;
        itemTemplate: WinJS.Binding.Template;
        currentId: number;
        throttle: number;
        _items: any[];
        lastrefresh: Date;
        
        constructor(element?, options?) {
            this.element = element || document.createElement('DIV');
            this.eventTracker = new WinJSContrib.UI.EventTracker();
            options = options || {};
            this.element.winControl = this;
            this.element.classList.add('playlistcontrol');
            this.element.classList.add('win-disposable');
            this.element.classList.add('mcn-layout-ctrl');
            WinJS.UI.setOptions(this, options);
            this.itemTemplate = new WinJS.Binding.Template(null, { href: '/templates/playlistitem.html', extractChild: true });

            this.eventTracker.addBinding(Kodi.NowPlaying.current, "id", () => {
                this.refresh();
            });

            this.eventTracker.addBinding(Kodi.NowPlaying.current, "expanded", () => {
                this.refresh(true);
                if (!Kodi.NowPlaying.current.expanded) {
                    this.element.innerHTML = "";
                }
            });

            this.eventTracker.addEvent(WinJS.Application, "Playlist.OnAdd", () => {
                clearTimeout(this.throttle);
                this.throttle = setTimeout(() => {
                    var delta = (<any>new Date()) - <any>this.lastrefresh;
                    if (delta > 1000) {
                        this.refresh();
                    }
                }, 700);
                
            });

            
        }

        get items() {
            return this._items;
        }

        set items(val) {
            this._items = val;
            
        }

        refresh(animate? : boolean) {
            if (Kodi.NowPlaying.current.expanded) {
                Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then((playlist) => {
                    this.items = playlist.items;
                    this.renderItems(animate);
                    this.lastrefresh = new Date();
                });
            }
        }

        renderItems(animate: boolean) {
            //var container = document.createDocumentFragment();
            var p = [];
            var elts = [];

            this.element.innerHTML = "";

            if (this.items) {
                this.items.forEach((i, index) => {
                    p.push(this.itemTemplate.render(i).then((rendered) => {
                        elts.push(rendered);
                        if (animate) {
                            rendered.style.opacity = "0";
                        }
                        this.element.appendChild(rendered);
                        if (i.id == Kodi.NowPlaying.current.id) {
                            rendered.classList.add("current");
                        }

                        var btnplay = rendered.querySelector(".btnplay");
                        var btnremove = rendered.querySelector(".btnremove");

                        WinJSContrib.UI.tap(btnplay, () => {
                            return Kodi.API.Player.moveTo(Kodi.NowPlaying.current.playerid, index).then(() => {
                                this.refresh();
                            });
                        });

                        WinJSContrib.UI.tap(btnremove, () => {
                            return Kodi.API.PlayList.removeAt(Kodi.NowPlaying.current.playlistid, index).then(() => {
                                return WinJSContrib.UI.removeElementAnimation(rendered).then(() => {
                                    //this.refresh();
                                });
                            });
                        });
                    }));
                });

                WinJS.Promise.join(p).then(() => {
                    if (animate) {
                        WinJS.UI.Animation.enterPage(elts);
                    }
                    //    this.element.innerHTML = "";
                    //    this.element.appendChild(container);
                });
            }
        }

        dispose() {
            this.eventTracker.dispose();
        }
    }

    export var PlayList = WinJS.Class.mix(WinJS.Utilities.markSupportedForProcessing(PlayListControl), WinJS.Utilities.eventMixin,
        WinJS.Utilities.createEventProperties("myevent"));
}