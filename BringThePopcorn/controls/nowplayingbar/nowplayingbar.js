﻿var BtPo;
(function (BtPo) {
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
                BtPo.mapKodiApi(element);
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
                    //var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                    //ctrl.playingElt.style.height = 'auto';
                    //$.Velocity.hook(ctrl.playingElt, "top", target + "px");
                    WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(20, 120);
                    document.body.classList.add("nowplaying-expanded");
                    Kodi.NowPlaying.current.expanded = true;
                }
            };
            NowPlayingBarControl.prototype.minimize = function (instantly) {
                var ctrl = this;
                if (document.body.classList.contains("nowplaying-expanded")) {
                    //if (instantly) {
                    //    ctrl.playingElt.style.transform = '';
                    //    document.body.classList.remove("nowplaying-expanded");
                    //    return;
                    //}
                    // var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                    //$.Velocity.hook(ctrl.playingElt, "top", "0");
                    var currentPage = WinJSContrib.UI.Application.navigator.pageControl;
                    if (currentPage && currentPage.foWrapper) {
                        currentPage.foWrapper.blurTo(0, 90);
                    }
                    document.body.classList.remove("nowplaying-expanded");
                    Kodi.NowPlaying.current.expanded = false;
                }
            };
            NowPlayingBarControl.url = "/controls/nowplayingbar/nowplayingbar.html";
            return NowPlayingBarControl;
        })();
        UI.NowPlayingBarControl = NowPlayingBarControl;
        UI.NowPlayingSummary = WinJS.UI.Pages.define(NowPlayingBarControl.url, NowPlayingBarControl);
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));

//# sourceMappingURL=../../../BringThePopcorn/controls/nowplayingbar/nowplayingbar.js.map