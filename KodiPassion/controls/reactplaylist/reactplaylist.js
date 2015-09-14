"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KodiPassion = KodiPassion || {};
KodiPassion.UI = KodiPassion.UI || {};
(function () {
    'use strict';
    var CSSTransitionGroup = React.addons.CSSTransitionGroup;

    var PlaylistItem = (function (_React$Component) {
        _inherits(PlaylistItem, _React$Component);

        function PlaylistItem() {
            _classCallCheck(this, PlaylistItem);

            _get(Object.getPrototypeOf(PlaylistItem.prototype), "constructor", this).apply(this, arguments);
        }

        _createClass(PlaylistItem, [{
            key: "render",
            value: function render() {
                return React.createElement(
                    "div",
                    { key: this.props.data.id, className: Kodi.NowPlaying.current.id == this.props.data.id ? "playlist-item current" : "playlist-item" },
                    React.createElement("img", { src: this.props.picture, className: "thumbnail", draggable: "false" }),
                    React.createElement(
                        "div",
                        { className: "desc" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            this.props.data.label
                        ),
                        React.createElement(
                            "div",
                            { className: "album" },
                            React.createElement(
                                "div",
                                null,
                                this.props.data.artist
                            ),
                            React.createElement(
                                "div",
                                null,
                                this.props.data.album
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "actions" },
                        React.createElement("button", { className: "blink btnplay kdp-play" }),
                        React.createElement("button", { className: "blink btnremove kdp-close" })
                    )
                );
            }
        }, {
            key: "componentDidMount",
            value: function componentDidMount() {
                var node = React.findDOMNode(this);
                node.style.opacity = '0';
                var delay = Math.max(this.props.index * 40, 300);
                setTimeout(function () {
                    WinJSContrib.UI.Animation.slideFromBottom(node);
                }, delay);
                this.registerEvents(node);
            }
        }, {
            key: "componentDidUpdate",
            value: function componentDidUpdate() {
                var node = React.findDOMNode(this);
                this.registerEvents(node);
            }
        }, {
            key: "componentWillUpdate",
            value: function componentWillUpdate(nextProps, nextState) {
                var node = React.findDOMNode(this);
                var targeturl = Kodi.API.kodiThumbnail(nextProps.data.thumbnail);
                var thumbnail = node.querySelector(".thumbnail");
                if (thumbnail && thumbnail.src == targeturl) {
                    nextProps.picture = thumbnail.src;
                }
            }
        }, {
            key: "registerEvents",
            value: function registerEvents(node) {
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
            }
        }]);

        return PlaylistItem;
    })(React.Component);

    var PlaylistItemsList = (function (_React$Component2) {
        _inherits(PlaylistItemsList, _React$Component2);

        function PlaylistItemsList() {
            _classCallCheck(this, PlaylistItemsList);

            _get(Object.getPrototypeOf(PlaylistItemsList.prototype), "constructor", this).apply(this, arguments);
        }

        _createClass(PlaylistItemsList, [{
            key: "render",
            value: function render() {
                this.props.items = this.props.items || [];

                return React.createElement(
                    "div",
                    { className: "playlist-items" },
                    this.props.items.map(function (item, idx) {
                        return React.createElement(PlaylistItem, { index: idx, data: item });
                    })
                );
            }
        }]);

        return PlaylistItemsList;
    })(React.Component);

    var ReactPlayListControl = (function () {
        function ReactPlayListControl(element, options) {
            var _this2 = this;

            _classCallCheck(this, ReactPlayListControl);

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
                _this2.refresh();
            });

            this.eventTracker.addBinding(Kodi.NowPlaying.current, "id", function () {
                _this2.refresh();
            });

            this.eventTracker.addBinding(Kodi.NowPlaying.current, "expanded", function () {
                _this2.refresh();
                if (!Kodi.NowPlaying.current.expanded) {
                    _this2.element.innerHTML = "";
                }
            });

            this.eventTracker.addEvent(WinJS.Application, "Playlist.OnAdd", function () {
                clearTimeout(_this2.throttle);
                _this2.throttle = setTimeout(function () {
                    var delta = new Date() - _this2.lastrefresh;
                    if (delta > 1000) {
                        _this2.refresh();
                    }
                }, 700);
            });
        }

        _createClass(ReactPlayListControl, [{
            key: "refresh",
            value: function refresh() {
                var _this3 = this;

                if (Kodi.NowPlaying.current.expanded) {
                    console.info("refresh playlist");
                    Kodi.API.PlayList.getItems(Kodi.NowPlaying.current.playlistid).then(function (playlist) {
                        _this3._items = playlist.items;

                        _this3.component = React.render(_this3.compFactory({ items: _this3.items }), _this3.element);
                        _this3.lastrefresh = new Date();
                    }, function (err) {
                        console.error(err);
                    });
                }
            }
        }, {
            key: "items",
            get: function get() {
                return this._items;
            },
            set: function set(val) {
                this._items = val;
                this.refresh();
            }
        }]);

        return ReactPlayListControl;
    })();

    KodiPassion.UI.ReactPlayListControl = ReactPlayListControl;
})();
//# sourceMappingURL=../../../KodiPassion/controls/reactplaylist/reactplaylist.js.map