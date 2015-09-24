var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var CSSTransitionGroup = React.addons.CSSTransitionGroup;
        var PlaylistItem = (function (_super) {
            __extends(PlaylistItem, _super);
            function PlaylistItem() {
                _super.apply(this, arguments);
            }
            PlaylistItem.prototype.render = function () {
                return (React.createElement("div", {"key": this.props.data.id, "className": (Kodi.NowPlaying.current.id == this.props.data.id) ? "playlist-item current" : "playlist-item"}, React.createElement("img", {"src": this.props.picture, "className": "thumbnail", "draggable": false}), React.createElement("div", {"className": "desc"}, React.createElement("div", {"className": "title"}, this.props.data.label), React.createElement("div", {"className": "album"}, React.createElement("div", null, this.props.data.artist), React.createElement("div", null, this.props.data.album))), React.createElement("div", {"className": "actions"}, React.createElement("button", {"className": "blink btnplay btpo-play"}), React.createElement("button", {"className": "blink btnremove btpo-close"}))));
            };
            PlaylistItem.prototype.componentDidMount = function () {
                var node = React.findDOMNode(this);
                node.style.opacity = '0';
                var delay = Math.max(this.props.index * 40, 300);
                setTimeout(function () {
                    WinJSContrib.UI.Animation.slideFromBottom(node);
                }, delay);
                this.registerEvents(node);
            };
            PlaylistItem.prototype.componentDidUpdate = function () {
                var node = React.findDOMNode(this);
                this.registerEvents(node);
            };
            PlaylistItem.prototype.componentWillUpdate = function (nextProps, nextState) {
                var node = React.findDOMNode(this);
                var targeturl = Kodi.API.kodiThumbnail(nextProps.data.thumbnail);
                var thumbnail = node.querySelector(".thumbnail");
                if (thumbnail && thumbnail.src == targeturl) {
                    nextProps.picture = thumbnail.src;
                }
            };
            PlaylistItem.prototype.registerEvents = function (node) {
                var _this = this;
                var thumbnail = node.querySelector(".thumbnail");
                if (!thumbnail.src) {
                    Kodi.Utils.toThumbnailBg(this.props.data, ['thumbnail'], thumbnail, ['src']);
                }
                var btnplay = node.querySelector(".btnplay");
                WinJSContrib.UI.tap(btnplay, function () {
                    return Kodi.API.Player.moveTo(Kodi.NowPlaying.current.playerid, _this.props.index).then(function () {
                        var e = document.createEvent('Event');
                        e.initEvent('refreshplaylist', true, true);
                        node.dispatchEvent(e);
                    });
                });
                var btnremove = node.querySelector(".btnremove");
                WinJSContrib.UI.tap(btnremove, function () {
                    return Kodi.API.PlayList.removeAt(Kodi.NowPlaying.current.playlistid, _this.props.index).then(function () {
                        return WinJSContrib.UI.removeElementAnimation(node).then(function () {
                            var e = document.createEvent('Event');
                            e.initEvent('refreshplaylist', true, true);
                            node.dispatchEvent(e);
                        });
                    });
                });
            };
            return PlaylistItem;
        })(React.Component);
        var PlaylistItemsList = (function (_super) {
            __extends(PlaylistItemsList, _super);
            function PlaylistItemsList() {
                _super.apply(this, arguments);
            }
            PlaylistItemsList.prototype.render = function () {
                this.props.items = this.props.items || [];
                return (React.createElement("div", {"className": "playlist-items"}, this.props.items.map(function (item, idx) {
                    return React.createElement(PlaylistItem, {"index": idx, "data": item});
                })));
            };
            return PlaylistItemsList;
        })(React.Component);
        var ReactPlayListControl = (function () {
            function ReactPlayListControl(element, options) {
                var _this = this;
                this.element = element || document.createElement('DIV');
                this.eventTracker = new WinJSContrib.UI.EventTracker();
                options = options || {};
                this.element.winControl = this;
                this.element.classList.add('reactplaylistcontrol');
                this.element.classList.add('win-disposable');
                this.element.classList.add('mcn-layout-ctrl');
                WinJS.UI.setOptions(this, options);
                this.compFactory = React.createFactory(PlaylistItemsList);
                this.eventTracker.addEvent(this.element, "refreshplaylist", function () {
                    _this.refresh();
                });
                this.eventTracker.addBinding(Kodi.NowPlaying.current, "id", function () {
                    _this.refresh();
                });
                this.eventTracker.addBinding(Kodi.NowPlaying.current, "expanded", function () {
                    _this.refresh();
                    if (!Kodi.NowPlaying.current.expanded) {
                        _this.element.innerHTML = "";
                    }
                });
                this.eventTracker.addEvent(WinJS.Application, "Playlist.OnAdd", function () {
                    clearTimeout(_this.throttle);
                    _this.throttle = setTimeout(function () {
                        var now = new Date();
                        var last = _this.lastrefresh;
                        var delta = now - last;
                        if (delta > 1000) {
                            _this.refresh();
                        }
                    }, 700);
                });
            }
            Object.defineProperty(ReactPlayListControl.prototype, "items", {
                get: function () {
                    return this._items;
                },
                set: function (val) {
                    this._items = val;
                    this.refresh();
                },
                enumerable: true,
                configurable: true
            });
            ReactPlayListControl.prototype.refresh = function () {
                var _this = this;
                if (Kodi.NowPlaying.current.expanded) {
                    console.info("refresh playlist");
                    Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then(function (playlist) {
                        _this._items = playlist.items;
                        _this.component = React.render(_this.compFactory({ items: _this.items }), _this.element);
                        _this.lastrefresh = new Date();
                    }, function (err) {
                        console.error(err);
                    });
                }
            };
            return ReactPlayListControl;
        })();
        UI.ReactPlayListControl = ReactPlayListControl;
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
