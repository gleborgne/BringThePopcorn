module KodiPassion.UI {
    export class PlayListControl {
        public element: HTMLElement;
        eventTracker: WinJSContrib.UI.EventTracker;
        itemTemplate: WinJS.Binding.Template;
        currentId: number;
        _items: any[];

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
        }

        get items() {
            return this._items;
        }

        set items(val) {
            this._items = val;
            this.renderItems();
        }

        refresh() {
            Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then((playlist) =>{
                this.items = playlist.items;
            });
        }

        renderItems() {
            var container = document.createDocumentFragment();
            var p = [];
            this.items.forEach((i, index) => {
                p.push(this.itemTemplate.render(i).then((rendered) => {
                    container.appendChild(rendered);
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
                this.element.style.opacity = "0";
                this.element.innerHTML = "";
                this.element.appendChild(container);
                this.element.style.opacity = "1";
            });
        }

        dispose() {
            this.eventTracker.dispose();
        }
    }

    export var PlayList = WinJS.Class.mix(WinJS.Utilities.markSupportedForProcessing(PlayListControl), WinJS.Utilities.eventMixin,
        WinJS.Utilities.createEventProperties("myevent"));
}