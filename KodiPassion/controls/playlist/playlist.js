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
            }
            Object.defineProperty(PlayListControl.prototype, "items", {
                get: function () {
                    return this._items;
                },
                set: function (val) {
                    this._items = val;
                    this.renderItems();
                },
                enumerable: true,
                configurable: true
            });
            PlayListControl.prototype.refresh = function () {
                var _this = this;
                Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then(function (playlist) {
                    _this.items = playlist.items;
                });
            };
            PlayListControl.prototype.renderItems = function () {
                var _this = this;
                var container = document.createDocumentFragment();
                var p = [];
                this.items.forEach(function (i, index) {
                    p.push(_this.itemTemplate.render(i).then(function (rendered) {
                        container.appendChild(rendered);
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
                    _this.element.style.opacity = "0";
                    _this.element.innerHTML = "";
                    _this.element.appendChild(container);
                    _this.element.style.opacity = "1";
                });
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
//# sourceMappingURL=playlist.js.map