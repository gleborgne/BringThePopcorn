(function () {
    "use strict";

    var ctor = WinJS.UI.Pages.define("/controls/nowplayingbar/nowplayingbar.html", {
        processed: function (element, options) {
            var ctrl = this;
            ctrl.container = document.getElementById("contentwrapper");
            ctrl.playingElt = document.getElementById("nowplaying");
            ctrl.contentElt = document.getElementById("nowplayingcontent");

            WinJS.Navigation.addEventListener("beforenavigate", function () {
                ctrl.minimize(true);
            });
        },

        toggleView: function () {
            var ctrl = this;

            if (document.body.classList.contains("nowplaying-expanded")) {                
                ctrl.minimize();
            } else {
                ctrl.maximize();
            }
        },

        maximize: function () {
            var ctrl = this;
            if (!document.body.classList.contains("nowplaying-expanded")) {
                var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                ctrl.playingElt.style.height = 'auto';
                $.Velocity.hook(ctrl.playingElt, "top", target + "px");
                WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(20, 120);
                $.Velocity(ctrl.playingElt, { top: '0px' }, { duration: 120, easing: 'ease-out' }).then(function () {
                    document.body.classList.add("nowplaying-expanded");
                });
            }
        },

        minimize: function (instantly) {
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
                $.Velocity(ctrl.playingElt, { top: target + 'px' }, { duration: 90, easing: 'ease-out' }).then(function () {
                    ctrl.playingElt.style.height = '';
                    ctrl.playingElt.style.top = '';
                    document.body.classList.remove("nowplaying-expanded");
                });
            }
        },
    });

    WinJS.Namespace.define("KodiPassion.UI", {
        NowPlayingSummary : ctor
    })
})();
